
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
    if (loading) return; // Wait for auth check

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
  }, [user, isDemoMode, loading]);

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

  const handleLogout = async () => {
    await auth.signOut();
    setIsDemoMode(false);
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    if (error && !isDemoMode && user) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-white text-center">
          <div className="size-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[32px]">gpp_bad</span>
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2 italic uppercase tracking-tighter">Permission Required</h2>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed px-4">
            {error}
          </p>
          
          <div className="w-full bg-navy/5 p-4 rounded-2xl text-left font-mono text-[9px] text-gray-600 mb-6 border border-navy/10">
            <p className="font-bold text-navy/40 mb-1">// Firebase Firestore Rules:</p>
            <p>match /databases/{"{db}"}/documents {"{"}</p>
            <p className="ml-2 font-bold text-primary">match /{"{document=**}"} {"{"}</p>
            <p className="ml-4 font-bold text-primary">allow read, write: if request.auth != null;</p>
            <p className="ml-2">{"}"}</p>
            <p>{"}"}</p>
          </div>

          <div className="w-full space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full h-12 bg-navy text-white rounded-xl font-bold text-sm shadow-lg active:scale-95"
            >
              Try Again
            </button>
            <button 
              onClick={() => setIsDemoMode(true)}
              className="w-full h-12 bg-white border-2 border-primary text-primary rounded-xl font-bold text-sm active:scale-95"
            >
              Use Offline Mode
            </button>
          </div>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="h-full flex flex-col items-center justify-center bg-white gap-4">
          <div className="size-12 border-4 border-gray-100 border-t-primary rounded-full animate-spin"></div>
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest animate-pulse">Initializing...</span>
        </div>
      );
    }

    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen 
            onLogin={() => navigateTo('home')} 
            onDemoMode={() => {
              setIsDemoMode(true);
              navigateTo('home');
            }} 
          />
        );
      case 'home':
        return <ArenaScreen onNavigate={navigateTo} />;
      case 'players':
        return (
          <PlayerListScreen 
            players={players} 
            onToggleConfirm={toggleConfirm} 
            onNavigate={navigateTo} 
          />
        );
      case 'scout':
        return <ScoutScreen players={players} onNavigate={navigateTo} />;
      case 'create-match':
        return <CreateMatchScreen onNavigate={navigateTo} />;
      case 'profile':
        return selectedPlayer ? (
          <ProfileScreen player={selectedPlayer} players={players} onNavigate={navigateTo} />
        ) : <ArenaScreen onNavigate={navigateTo} />;
      default:
        return <ArenaScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-200 lg:py-8 overflow-hidden">
      <div className="w-full max-w-[430px] h-[932px] max-h-screen bg-surface-gray shadow-2xl relative flex flex-col overflow-hidden sm:rounded-[40px] border-8 border-white dark:border-gray-900">
        
        {isDemoMode && currentScreen !== 'login' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-amber-500 text-white text-[9px] font-black uppercase rounded-full shadow-lg animate-bounce border-2 border-white/20">
            DEMO MODE (OFFLINE)
          </div>
        )}

        {user && (
          <div className="absolute top-4 right-4 z-50 animate-fade-in-up">
             <button 
              onClick={handleLogout}
              className="size-10 bg-white/80 backdrop-blur shadow-sm border border-white rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all active:scale-90"
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
