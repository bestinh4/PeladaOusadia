
import React, { useEffect, useCallback, Suspense, lazy, useReducer } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { Screen, Player } from './types';
import { playerService } from './services/playerService';
import { MOCK_PLAYERS } from './constants';
import BottomNav from './components/BottomNav';

// Lazy load screens for code splitting
const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const ArenaScreen = lazy(() => import('./screens/ArenaScreen'));
const PlayerListScreen = lazy(() => import('./screens/PlayerListScreen'));
const ScoutScreen = lazy(() => import('./screens/ScoutScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
const DrawScreen = lazy(() => import('./screens/DrawScreen'));
const FinanceScreen = lazy(() => import('./screens/FinanceScreen'));

// --- Reducer Types & Initial State ---
interface AppState {
  user: User | null;
  currentScreen: Screen;
  players: Player[];
  selectedPlayer: Player | null;
  loading: boolean;
  error: string | null;
  isDemoMode: boolean;
}

type AppAction =
  | { type: 'SET_AUTH'; user: User | null; isDemoMode: boolean }
  | { type: 'NAVIGATE'; screen: Screen; data?: any }
  | { type: 'SET_PLAYERS'; players: Player[] }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'SET_DEMO_MODE'; enabled: boolean }
  | { type: 'UPDATE_SELECTED_PLAYER'; player: Player | null }
  | { type: 'TOGGLE_PLAYER_PRESENCE'; id: string };

const initialState: AppState = {
  user: null,
  currentScreen: 'login',
  players: [],
  selectedPlayer: null,
  loading: true,
  error: null,
  isDemoMode: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        user: action.user,
        isDemoMode: action.isDemoMode,
        currentScreen: action.user ? 'home' : (action.isDemoMode ? state.currentScreen : 'login'),
        loading: false,
      };
    case 'NAVIGATE':
      let nextSelectedPlayer = state.selectedPlayer;
      if (action.screen === 'profile') {
        // Priority: Passed data > Current User found in players > Existing selected > First player
        const currentUserInList = state.user ? state.players.find(p => p.id === state.user?.uid) : null;
        nextSelectedPlayer = action.data || currentUserInList || state.selectedPlayer || state.players[0] || null;
      }
      
      return {
        ...state,
        currentScreen: action.screen,
        selectedPlayer: nextSelectedPlayer,
      };
    case 'SET_PLAYERS':
      const newPlayers = action.players;
      const syncSelected = state.selectedPlayer 
          ? (newPlayers.find(p => p.id === state.selectedPlayer?.id) || state.selectedPlayer)
          : (state.currentScreen === 'profile' ? newPlayers[0] : null);

      return {
        ...state,
        players: newPlayers,
        selectedPlayer: syncSelected
      };
    case 'SET_ERROR':
      return { ...state, error: action.error, loading: false };
    case 'SET_DEMO_MODE':
      return { 
        ...state, 
        isDemoMode: action.enabled, 
        currentScreen: action.enabled ? 'home' : state.currentScreen,
        user: action.enabled ? null : state.user
      };
    case 'UPDATE_SELECTED_PLAYER':
      return { ...state, selectedPlayer: action.player };
    case 'TOGGLE_PLAYER_PRESENCE':
      const updatedPlayers = state.players.map(p => 
        p.id === action.id ? { ...p, confirmed: !p.confirmed } : p
      );
      if (state.isDemoMode) {
        localStorage.setItem('oa_players', JSON.stringify(updatedPlayers));
      }
      return { ...state, players: updatedPlayers };
    default:
      return state;
  }
}

// --- Components ---
const ScreenLoader = () => (
  <div className="h-full flex flex-col items-center justify-center bg-background gap-4 animate-fade-in">
    <div className="size-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
    <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest animate-pulse">Carregando...</span>
  </div>
);

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user, currentScreen, players, selectedPlayer, loading, error, isDemoMode } = state;

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      dispatch({ type: 'SET_AUTH', user: firebaseUser, isDemoMode: false });
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (loading) return;
    
    if (isDemoMode) {
      const saved = localStorage.getItem('oa_players');
      dispatch({ type: 'SET_PLAYERS', players: saved ? JSON.parse(saved) : MOCK_PLAYERS });
      dispatch({ type: 'SET_ERROR', error: null });
      return;
    }
    
    if (!user) {
      dispatch({ type: 'SET_PLAYERS', players: [] });
      return;
    }

    let unsubscribePlayers: (() => void) | undefined;
    
    const initData = async () => {
      try {
        dispatch({ type: 'SET_ERROR', error: null });
        
        // 1. First, ensure user has a profile in Firestore
        await playerService.ensurePlayerProfile(user);
        
        // 2. Seed mock data if DB is empty
        await playerService.seedPlayers();
        
        // 3. Subscribe to real-time updates
        unsubscribePlayers = playerService.subscribeToPlayers(
          (data) => dispatch({ type: 'SET_PLAYERS', players: data }),
          (err) => {
            dispatch({ 
              type: 'SET_ERROR', 
              error: err.code === 'permission-denied' ? 'Firestore rules restricted.' : err.message 
            });
          }
        );
      } catch (err: any) {
        dispatch({ type: 'SET_ERROR', error: err.message });
      }
    };

    initData();
    return () => unsubscribePlayers?.();
  }, [user, isDemoMode, loading]);

  const navigateTo = useCallback((screen: Screen, data?: any) => {
    dispatch({ type: 'NAVIGATE', screen, data });
  }, []);

  const toggleConfirm = useCallback(async (id: string) => {
    if (isDemoMode) {
      dispatch({ type: 'TOGGLE_PLAYER_PRESENCE', id });
      return;
    }
    const player = players.find(p => p.id === id);
    if (player) {
      try {
        await playerService.togglePresence(id, player.confirmed);
      } catch (err: any) {
        alert("Firebase Error: " + (err.code === 'permission-denied' ? "Insufficient permissions." : err.message));
      }
    }
  }, [isDemoMode, players]);

  const handleUpdateAvatar = useCallback(async (id: string, file: File | string) => {
    const fileToBase64 = (f: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(f);
      });
    };
    if (isDemoMode) {
      const avatarUrl = typeof file === 'string' ? file : await fileToBase64(file);
      const updatedPlayers = players.map(p => p.id === id ? { ...p, avatar: avatarUrl } : p);
      dispatch({ type: 'SET_PLAYERS', players: updatedPlayers });
      localStorage.setItem('oa_players', JSON.stringify(updatedPlayers));
      return;
    }
    try {
      if (file instanceof File) {
        const cdnUrl = await playerService.uploadAvatarToStorage(id, file);
        await playerService.updateAvatar(id, cdnUrl);
      } else {
        await playerService.updateAvatar(id, file);
      }
    } catch (err: any) {
      alert("Storage Error: " + err.message);
    }
  }, [isDemoMode, players]);

  const handleLogout = useCallback(async () => {
    await auth.signOut();
    dispatch({ type: 'SET_DEMO_MODE', enabled: false });
    dispatch({ type: 'NAVIGATE', screen: 'login' });
  }, []);

  const renderScreen = () => {
    if (error && !isDemoMode && user) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-background text-center animate-fade-in">
          <div className="size-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 animate-scale-in">
            <span className="material-symbols-outlined text-[32px]">gpp_bad</span>
          </div>
          <h2 className="text-xl font-black text-secondary mb-2 italic uppercase tracking-tighter">Erro de Permissão</h2>
          <p className="text-xs text-secondary/60 mb-6 leading-relaxed px-4">{error}</p>
          <div className="w-full space-y-3 animate-slide-up delay-100">
            <button onClick={() => window.location.reload()} className="w-full h-12 bg-primary text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all">Tentar Novamente</button>
            <button onClick={() => dispatch({ type: 'SET_DEMO_MODE', enabled: true })} className="w-full h-12 bg-transparent border-2 border-primary text-primary rounded-xl font-bold text-sm active:scale-95 transition-all">Modo Offline</button>
          </div>
        </div>
      );
    }
    
    if (loading) return <ScreenLoader />;
    
    // Logic: If logged in, find the player with matching UID. If demo mode, use first.
    const currentPlayer = user 
      ? players.find(p => p.id === user.uid) 
      : (isDemoMode && players.length > 0 ? players[0] : null);

    return (
      <Suspense fallback={<ScreenLoader />}>
        {currentScreen === 'login' && <LoginScreen onLogin={() => navigateTo('home')} onDemoMode={() => dispatch({ type: 'SET_DEMO_MODE', enabled: true })} />}
        {currentScreen === 'home' && <ArenaScreen players={players} currentPlayer={currentPlayer || null} onToggleConfirm={toggleConfirm} onNavigate={navigateTo} />}
        {currentScreen === 'players' && <PlayerListScreen players={players} onToggleConfirm={toggleConfirm} onNavigate={navigateTo} />}
        {currentScreen === 'scout' && <ScoutScreen players={players} onNavigate={navigateTo} />}
        {currentScreen === 'draw' && <DrawScreen players={players} onNavigate={navigateTo} />}
        {currentScreen === 'finance' && <FinanceScreen players={players} onNavigate={navigateTo} />}
        {currentScreen === 'profile' && selectedPlayer ? (
          <ProfileScreen player={selectedPlayer} players={players} onNavigate={navigateTo} onUpdateAvatar={handleUpdateAvatar} />
        ) : currentScreen === 'profile' ? (
          <ArenaScreen players={players} currentPlayer={currentPlayer || null} onToggleConfirm={toggleConfirm} onNavigate={navigateTo} />
        ) : null}
      </Suspense>
    );
  };

  return (
    <div className="flex justify-center min-h-screen bg-slate-100 lg:py-8 transition-all duration-500 overflow-hidden">
      <div className="w-full max-w-[430px] h-full sm:h-[932px] sm:max-h-[95vh] bg-background shadow-2xl relative flex flex-col overflow-hidden sm:rounded-[48px] border-4 border-white transition-all duration-500">
        
        {isDemoMode && currentScreen !== 'login' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 bg-warning text-white text-[9px] font-black uppercase rounded-full shadow-lg animate-slide-up border border-white/20">
            DEMO MODE (OFFLINE)
          </div>
        )}

        {user && currentScreen !== 'login' && (
          <div className="absolute top-4 right-4 z-[60] animate-scale-in">
             <button onClick={handleLogout} className="size-10 bg-white shadow-md border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90">
               <span className="material-symbols-outlined text-[20px]">logout</span>
             </button>
          </div>
        )}

        <div className="flex-1 overflow-hidden relative">
          {renderScreen()}
        </div>

        {currentScreen !== 'login' && (!error || isDemoMode) && (
          <div className="shrink-0 z-50">
            <BottomNav activeScreen={currentScreen} onNavigate={navigateTo} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
