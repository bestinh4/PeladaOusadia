
import React, { useEffect, useCallback, Suspense, lazy, useReducer } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { Screen, Player } from './types';
import { playerService } from './services/playerService';
import BottomNav from './components/BottomNav';

// Lazy load screens
const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const ArenaScreen = lazy(() => import('./screens/ArenaScreen'));
const PlayerListScreen = lazy(() => import('./screens/PlayerListScreen'));
const ScoutScreen = lazy(() => import('./screens/ScoutScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
const DrawScreen = lazy(() => import('./screens/DrawScreen'));
const FinanceScreen = lazy(() => import('./screens/FinanceScreen'));

interface AppState {
  user: User | null;
  currentScreen: Screen;
  players: Player[];
  selectedPlayer: Player | null;
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_AUTH'; user: User | null }
  | { type: 'NAVIGATE'; screen: Screen; data?: any }
  | { type: 'SET_PLAYERS'; players: Player[] }
  | { type: 'SET_ERROR'; error: string | null };

const initialState: AppState = {
  user: null,
  currentScreen: 'login',
  players: [],
  selectedPlayer: null,
  loading: true,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        user: action.user,
        currentScreen: action.user ? 'home' : 'login',
        loading: false,
      };
    case 'NAVIGATE':
      const currentUserInList = state.user ? state.players.find(p => p.id === state.user?.uid) : null;
      return {
        ...state,
        currentScreen: action.screen,
        selectedPlayer: action.screen === 'profile' 
          ? (action.data || currentUserInList || state.players[0] || null) 
          : state.selectedPlayer,
      };
    case 'SET_PLAYERS':
      return { ...state, players: action.players };
    case 'SET_ERROR':
      return { ...state, error: action.error, loading: false };
    default:
      return state;
  }
}

const ScreenLoader = () => (
  <div className="h-full flex flex-col items-center justify-center bg-background gap-4">
    <div className="size-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
    <span className="text-[9px] font-black text-secondary/40 uppercase tracking-widest">Sincronizando...</span>
  </div>
);

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user, currentScreen, players, selectedPlayer, loading, error } = state;

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      dispatch({ type: 'SET_AUTH', user: firebaseUser });
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (loading || !user) return;

    let unsubscribePlayers: (() => void) | undefined;
    
    const initData = async () => {
      try {
        await playerService.ensurePlayerProfile(user);
        unsubscribePlayers = playerService.subscribeToPlayers(
          (data) => dispatch({ type: 'SET_PLAYERS', players: data }),
          (err) => dispatch({ type: 'SET_ERROR', error: err.message })
        );
      } catch (err: any) {
        dispatch({ type: 'SET_ERROR', error: err.message });
      }
    };

    initData();
    return () => unsubscribePlayers?.();
  }, [user, loading]);

  const navigateTo = useCallback((screen: Screen, data?: any) => {
    dispatch({ type: 'NAVIGATE', screen, data });
  }, []);

  const toggleConfirm = useCallback(async (id: string) => {
    const player = players.find(p => p.id === id);
    if (player) {
      try {
        await playerService.togglePresence(id, player.confirmed);
      } catch (err: any) {
        alert("Erro ao confirmar presença: " + err.message);
      }
    }
  }, [players]);

  const handleUpdateAvatar = useCallback(async (id: string, file: File | string) => {
    try {
      const cdnUrl = file instanceof File 
        ? await playerService.uploadAvatarToStorage(id, file)
        : file;
      await playerService.updateAvatar(id, cdnUrl);
    } catch (err: any) {
      alert("Erro ao atualizar foto: " + err.message);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await auth.signOut();
    dispatch({ type: 'NAVIGATE', screen: 'login' });
  }, []);

  const renderScreen = () => {
    if (error && user) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-background text-center">
          <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
          <h2 className="text-xl font-black text-secondary uppercase italic">Erro de Conexão</h2>
          <p className="text-xs text-secondary/60 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="w-full h-12 bg-primary text-white rounded-xl font-bold">Recarregar</button>
        </div>
      );
    }
    
    if (loading) return <ScreenLoader />;
    
    const currentPlayer = user ? players.find(p => p.id === user.uid) : null;

    return (
      <Suspense fallback={<ScreenLoader />}>
        {currentScreen === 'login' && (
          <LoginScreen 
            onLogin={() => navigateTo('home')} 
          />
        )}
        {currentScreen === 'home' && <ArenaScreen players={players} currentPlayer={currentPlayer || null} onToggleConfirm={toggleConfirm} onNavigate={navigateTo} />}
        {currentScreen === 'players' && <PlayerListScreen players={players} onToggleConfirm={toggleConfirm} onNavigate={navigateTo} />}
        {currentScreen === 'scout' && <ScoutScreen players={players} onNavigate={navigateTo} />}
        {currentScreen === 'draw' && <DrawScreen players={players} onNavigate={navigateTo} />}
        {currentScreen === 'finance' && <FinanceScreen players={players} onNavigate={navigateTo} />}
        {currentScreen === 'profile' && selectedPlayer && (
          <ProfileScreen player={selectedPlayer} players={players} onNavigate={navigateTo} onUpdateAvatar={handleUpdateAvatar} />
        )}
      </Suspense>
    );
  };

  return (
    <div className="flex justify-center min-h-screen bg-slate-100 lg:py-8 overflow-hidden">
      <div className="w-full max-w-[430px] h-full sm:h-[932px] sm:max-h-[95vh] bg-background shadow-2xl relative flex flex-col overflow-hidden sm:rounded-[48px] border-4 border-white">
        
        {user && currentScreen !== 'login' && (
          <button onClick={handleLogout} className="absolute top-6 right-6 z-[60] size-10 bg-white shadow-md rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-95">
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        )}

        <div className="flex-1 overflow-hidden relative">
          {renderScreen()}
        </div>

        {currentScreen !== 'login' && (
          <div className="shrink-0 z-50">
            <BottomNav activeScreen={currentScreen} onNavigate={navigateTo} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
