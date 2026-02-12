
import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
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

// Loading Fallback Component
const ScreenLoader = () => (
  <div className="h-full flex flex-col items-center justify-center bg-background gap-4 animate-fade-in">
    <div className="size-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
    <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest animate-pulse">Carregando...</span>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Auth State Observer
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setIsDemoMode(false);
        setCurrentScreen('home');
      } else if (!isDemoMode) {
        setCurrentScreen('login');
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [isDemoMode]);

  // Player Data Sync
  useEffect(() => {
    if (loading) return;

    if (isDemoMode) {
      const saved = localStorage.getItem('oa_players');
      setPlayers(saved ? JSON.parse(saved) : MOCK_PLAYERS);
      setError(null);
      return;
    }

    if (!user) {
      setPlayers([]);
      return;
    }

    let unsubscribePlayers: (() => void) | undefined;

    const initData = async () => {
      try {
        setError(null);
        await playerService.seedPlayers();
        
        unsubscribePlayers = playerService.subscribeToPlayers(
          (data) => {
            setPlayers(data);
            if (selectedPlayer) {
              const updated = data.find(p => p.id === selectedPlayer.id);
              if (updated) setSelectedPlayer(updated);
            }
          },
          (err) => {
            console.error("Subscription error", err);
            if (err.code === 'permission-denied') {
              setError('Firestore rules restricted. Set to "Test Mode" in Firebase Console.');
            } else {
              setError(err.message);
            }
          }
        );
      } catch (err: any) {
        console.error("Initialization Error:", err);
        setError(err.message);
      }
    };

    initData();

    return () => {
      if (unsubscribePlayers) unsubscribePlayers();
    };
  }, [user, isDemoMode, loading, selectedPlayer?.id]);

  // Memoized navigation handler
  const navigateTo = useCallback((screen: Screen, data?: any) => {
    if (screen === 'profile' && data) {
      setSelectedPlayer(data);
    }
    setCurrentScreen(screen);
  }, []);

  // Memoized presence toggle
  const toggleConfirm = useCallback(async (id: string) => {
    if (isDemoMode) {
      setPlayers(prev => {
        const updated = prev.map(p => p.id === id ? { ...p, confirmed: !p.confirmed } : p);
        localStorage.setItem('oa_players', JSON.stringify(updated));
        return updated;
      });
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
      setPlayers(prev => {
        const updated = prev.map(p => p.id === id ? { ...p, avatar: avatarUrl } : p);
        localStorage.setItem('oa_players', JSON.stringify(updated));
        return updated;
      });
      setSelectedPlayer(prev => prev?.id === id ? { ...prev, avatar: avatarUrl } : prev);
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
  }, [isDemoMode]);

  const handleLogout = useCallback(async () => {
    await auth.signOut();
    setIsDemoMode(false);
    setCurrentScreen('login');
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
            <button 
              onClick={() => window.location.reload()}
              className="w-full h-12 bg-primary text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
            >
              Tentar Novamente
            </button>
            <button 
              onClick={() => setIsDemoMode(true)}
              className="w-full h-12 bg-transparent border-2 border-primary text-primary rounded-xl font-bold text-sm active:scale-95 transition-all"
            >
              Modo Offline
            </button>
          </div>
        </div>
      );
    }

    if (loading) return <ScreenLoader />;

    const currentPlayer = players.length > 0 ? players[0] : null;

    return (
      <Suspense fallback={<ScreenLoader />}>
        {currentScreen === 'login' && (
          <LoginScreen onLogin={() => navigateTo('home')} onDemoMode={() => { setIsDemoMode(true); navigateTo('home'); }} />
        )}
        {currentScreen === 'home' && (
          <ArenaScreen players={players} currentPlayer={currentPlayer} onToggleConfirm={toggleConfirm} onNavigate={navigateTo} />
        )}
        {currentScreen === 'players' && (
          <PlayerListScreen players={players} onToggleConfirm={toggleConfirm} onNavigate={navigateTo} />
        )}
        {currentScreen === 'scout' && (
          <ScoutScreen players={players} onNavigate={navigateTo} />
        )}
        {currentScreen === 'draw' && (
          <DrawScreen players={players} onNavigate={navigateTo} />
        )}
        {currentScreen === 'finance' && (
          <FinanceScreen players={players} onNavigate={navigateTo} />
        )}
        {currentScreen === 'profile' && selectedPlayer && (
          <ProfileScreen player={selectedPlayer} players={players} onNavigate={navigateTo} onUpdateAvatar={handleUpdateAvatar} />
        )}
        {currentScreen === 'profile' && !selectedPlayer && (
          <ArenaScreen players={players} currentPlayer={currentPlayer} onToggleConfirm={toggleConfirm} onNavigate={navigateTo} />
        )}
      </Suspense>
    );
  };

  return (
    <div className="flex justify-center min-h-screen bg-slate-100 lg:py-8 overflow-hidden">
      <div className="w-full max-w-[430px] h-[932px] max-h-screen bg-background shadow-2xl relative flex flex-col overflow-hidden sm:rounded-[40px] border-4 border-white">
        
        {isDemoMode && currentScreen !== 'login' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-warning text-white text-[9px] font-black uppercase rounded-full shadow-lg animate-slide-up border border-white/20">
            DEMO MODE (OFFLINE)
          </div>
        )}

        {user && currentScreen !== 'login' && (
          <div className="absolute top-4 right-4 z-50 animate-scale-in">
             <button 
              onClick={handleLogout}
              className="size-10 bg-white shadow-md border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90"
             >
               <span className="material-symbols-outlined text-[20px]">logout</span>
             </button>
          </div>
        )}

        <div className="flex-1 overflow-hidden relative">
          {renderScreen()}
        </div>

        {currentScreen !== 'login' && (!error || isDemoMode) && (
          <BottomNav activeScreen={currentScreen} onNavigate={navigateTo} />
        )}
      </div>
    </div>
  );
};

export default App;
