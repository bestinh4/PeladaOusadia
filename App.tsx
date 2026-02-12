
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { Screen, Player } from './types';
import { playerService } from './services/playerService';
import { MOCK_PLAYERS } from './constants';
import LoginScreen from './screens/LoginScreen';
import ArenaScreen from './screens/ArenaScreen';
import PlayerListScreen from './screens/PlayerListScreen';
import ScoutScreen from './screens/ScoutScreen';
import CreateMatchScreen from './screens/CreateMatchScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomNav from './components/BottomNav';

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

  const navigateTo = (screen: Screen, data?: any) => {
    if (screen === 'profile' && data) {
      setSelectedPlayer(data);
    }
    setCurrentScreen(screen);
  };

  const toggleConfirm = async (id: string) => {
    if (isDemoMode) {
      const updated = players.map(p => p.id === id ? { ...p, confirmed: !p.confirmed } : p);
      setPlayers(updated);
      localStorage.setItem('oa_players', JSON.stringify(updated));
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
  };

  const handleUpdateAvatar = async (id: string, file: File | string) => {
    if (isDemoMode) {
      const avatarUrl = typeof file === 'string' ? file : await fileToBase64(file);
      const updated = players.map(p => p.id === id ? { ...p, avatar: avatarUrl } : p);
      setPlayers(updated);
      localStorage.setItem('oa_players', JSON.stringify(updated));
      if (selectedPlayer?.id === id) {
        setSelectedPlayer({ ...selectedPlayer, avatar: avatarUrl });
      }
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
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleLogout = async () => {
    await auth.signOut();
    setIsDemoMode(false);
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    let screenContent;
    
    if (error && !isDemoMode && user) {
      screenContent = (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-background text-center animate-fade-in">
          <div className="size-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 animate-scale-in">
            <span className="material-symbols-outlined text-[32px]">gpp_bad</span>
          </div>
          <h2 className="text-xl font-black text-white mb-2 italic uppercase tracking-tighter">Permission Required</h2>
          <p className="text-xs text-white/40 mb-6 leading-relaxed px-4">
            {error}
          </p>
          <div className="w-full space-y-3 animate-slide-up delay-100">
            <button 
              onClick={() => window.location.reload()}
              className="w-full h-12 bg-white text-background rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
            >
              Try Again
            </button>
            <button 
              onClick={() => setIsDemoMode(true)}
              className="w-full h-12 bg-transparent border-2 border-primary text-primary rounded-xl font-bold text-sm active:scale-95 transition-all"
            >
              Use Offline Mode
            </button>
          </div>
        </div>
      );
    } else if (loading) {
      screenContent = (
        <div className="h-full flex flex-col items-center justify-center bg-background gap-4 animate-fade-in">
          <div className="size-12 border-4 border-white/5 border-t-primary rounded-full animate-spin"></div>
          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest animate-pulse">Initializing...</span>
        </div>
      );
    } else {
      switch (currentScreen) {
        case 'login':
          screenContent = <LoginScreen onLogin={() => navigateTo('home')} onDemoMode={() => { setIsDemoMode(true); navigateTo('home'); }} />;
          break;
        case 'home':
          screenContent = <ArenaScreen onNavigate={navigateTo} />;
          break;
        case 'players':
          screenContent = <PlayerListScreen players={players} onToggleConfirm={toggleConfirm} onNavigate={navigateTo} />;
          break;
        case 'scout':
          screenContent = <ScoutScreen players={players} onNavigate={navigateTo} />;
          break;
        case 'profile':
          screenContent = selectedPlayer ? (
            <ProfileScreen player={selectedPlayer} players={players} onNavigate={navigateTo} onUpdateAvatar={handleUpdateAvatar} />
          ) : <ArenaScreen onNavigate={navigateTo} />;
          break;
        default:
          screenContent = <ArenaScreen onNavigate={navigateTo} />;
      }
    }

    return (
      <div key={currentScreen} className="h-full w-full">
        {screenContent}
      </div>
    );
  };

  return (
    <div className="flex justify-center min-h-screen bg-[#080c0a] lg:py-8 overflow-hidden">
      <div className="w-full max-w-[430px] h-[932px] max-h-screen bg-background shadow-2xl relative flex flex-col overflow-hidden sm:rounded-[40px] border-4 border-white/5">
        
        {isDemoMode && currentScreen !== 'login' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-amber-500 text-[#0d1310] text-[9px] font-black uppercase rounded-full shadow-[0_4px_20px_rgba(245,158,11,0.3)] animate-slide-up border border-white/20">
            DEMO MODE (OFFLINE)
          </div>
        )}

        {user && currentScreen !== 'login' && (
          <div className="absolute top-4 right-4 z-50 animate-scale-in">
             <button 
              onClick={handleLogout}
              className="size-10 bg-surface/80 backdrop-blur shadow-sm border border-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-primary transition-all active:scale-90"
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
