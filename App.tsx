
import React, { useState, useEffect } from 'react';
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
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    if (isDemoMode) {
      // Load from local storage or mock
      const saved = localStorage.getItem('oa_players');
      setPlayers(saved ? JSON.parse(saved) : MOCK_PLAYERS);
      setLoading(false);
      setError(null);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      try {
        setError(null);
        await playerService.seedPlayers();
        
        unsubscribe = playerService.subscribeToPlayers(
          (data) => {
            setPlayers(data);
            setLoading(false);
          },
          (err) => {
            console.error("Subscription error", err);
            if (err.code === 'permission-denied') {
              setError('Seu Firestore está bloqueado. Altere as Regras de Segurança no Console Firebase para "Modo de Teste".');
            } else {
              setError(err.message);
            }
            setLoading(false);
          }
        );
      } catch (err: any) {
        console.error("Initialization Error:", err);
        if (err.code === 'permission-denied') {
          setError('Acesso Negado: Verifique as Regras do Firestore no Console Firebase.');
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isDemoMode]);

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
        alert("Erro no Firebase: " + (err.code === 'permission-denied' ? "Permissão insuficiente." : err.message));
      }
    }
  };

  const renderScreen = () => {
    if (error && !isDemoMode) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-white text-center overflow-y-auto no-scrollbar">
          <div className="size-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shrink-0">
            <span className="material-symbols-outlined text-[32px]">gpp_bad</span>
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2 italic uppercase">Erro de Permissão</h2>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed px-4">
            {error}
          </p>
          
          <div className="w-full bg-navy/5 p-4 rounded-2xl text-left font-mono text-[9px] text-gray-600 mb-6 border border-navy/10">
            <p className="font-bold text-navy/40 mb-1">// Como corrigir no Console Firebase:</p>
            <p>match /databases/{"{db}"}/documents {"{"}</p>
            <p className="ml-2 font-bold text-primary">match /{"{document=**}"} {"{"}</p>
            <p className="ml-4 font-bold text-primary">allow read, write: if true;</p>
            <p className="ml-2">{"}"}</p>
            <p>{"}"}</p>
          </div>

          <div className="w-full space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full h-12 bg-[#1a0a0b] text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
            >
              Tentar Novamente
            </button>
            <button 
              onClick={() => {
                setIsDemoMode(true);
                setCurrentScreen('home');
              }}
              className="w-full h-12 bg-white border-2 border-primary text-primary rounded-xl font-bold text-sm active:scale-95 transition-all"
            >
              Usar Modo de Demonstração
            </button>
          </div>
        </div>
      );
    }

    if (loading && currentScreen !== 'login') {
      return (
        <div className="h-full flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={() => navigateTo('home')} />;
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
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 px-3 py-1 bg-amber-500 text-white text-[8px] font-black uppercase rounded-full shadow-md animate-bounce">
            Modo de Demonstração (Offline)
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
