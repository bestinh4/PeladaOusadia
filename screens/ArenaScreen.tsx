
import React from 'react';
import { Screen, Player, Match } from '../types';

interface ArenaScreenProps {
  players: Player[];
  activeMatch: Match | null;
  currentPlayer: Player | null;
  onToggleConfirm: (id: string) => void;
  onNavigate: (screen: Screen) => void;
}

const ArenaScreen: React.FC<ArenaScreenProps> = ({ players, activeMatch, currentPlayer, onToggleConfirm, onNavigate }) => {
  const confirmedCount = players.filter(p => p.confirmed).length;
  const isConfirmed = currentPlayer?.confirmed || false;
  const isAdmin = currentPlayer?.role === 'admin';
  
  const GAME_FEE = activeMatch?.price || 0;
  const userBalance = currentPlayer?.paid ? 0 : (isConfirmed ? GAME_FEE : 0);

  return (
    <div className="h-full bg-background overflow-y-auto no-scrollbar pb-36 px-5 sm:px-6">
      {/* Header Premium */}
      <header className="flex items-center justify-between pt-8 pb-6 sticky top-0 z-40 glass-header -mx-5 px-5 transition-all duration-300">
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-secondary italic tracking-tighter leading-none">Vatreni</h1>
          <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em] mt-1">Football Manager</p>
        </div>
        <div className="flex items-center gap-2.5">
          {isAdmin && (
            <button 
              onClick={() => onNavigate('create-match')}
              className="size-10 bg-secondary text-white rounded-xl flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-secondary/20"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
          )}
          <button 
            onClick={() => onNavigate('finance')}
            className="group relative size-10 bg-white shadow-md border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-[22px] interactive-icon">account_balance_wallet</span>
            {players.some(p => !p.paid && p.confirmed) && (
              <div className="absolute top-0.5 right-0.5 size-2.5 bg-primary rounded-full border-2 border-white animate-ping"></div>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="space-y-6 mt-2">
        {/* Match Highlight Section */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-secondary uppercase tracking-widest italic">Match Day</h2>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 bg-primary rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">Live Updates</span>
            </div>
          </div>

          {activeMatch ? (
            <div className="stadium-bg rounded-[2.5rem] p-7 border border-white/20 relative overflow-hidden group premium-shadow animate-scale-in">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <span className="material-symbols-outlined text-[80px]">sports_soccer</span>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest border border-white/20">
                    {activeMatch.type}
                  </span>
                </div>

                <div className="mb-8">
                  <h3 className="text-3xl font-black text-white italic tracking-tighter leading-none mb-1">{activeMatch.time}</h3>
                  <p className="text-sm font-bold text-white/80 italic">{activeMatch.date}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="size-9 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg">
                      <span className="material-symbols-outlined text-[18px]">stadium</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-none mb-1">Local</p>
                      <p className="text-xs font-black text-white truncate">{activeMatch.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/80">
                    <span>Squad Confirmada</span>
                    <span>{confirmedCount} / {activeMatch.limit}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden p-[1px]">
                    <div 
                      className="h-full bg-white transition-all duration-1000 ease-out rounded-full" 
                      style={{ width: `${Math.min((confirmedCount/activeMatch.limit)*100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center animate-scale-in">
              <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                <span className="material-symbols-outlined text-[32px]">event_busy</span>
              </div>
              <p className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest leading-relaxed">
                Nenhum confronto agendado.<br/>Fique atento às convocações!
              </p>
            </div>
          )}
        </section>

        {/* Action Button */}
        {activeMatch && (
          <div className="animate-slide-up delay-100">
            {!isConfirmed ? (
              <button 
                onClick={() => currentPlayer && onToggleConfirm(currentPlayer.id)}
                disabled={confirmedCount >= activeMatch.limit}
                className="w-full h-16 btn-primary rounded-2xl flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
              >
                <span className="material-symbols-outlined font-black text-[22px]">check_circle</span>
                <span className="text-xs uppercase tracking-[0.2em] font-black italic">Confirmar Presença</span>
              </button>
            ) : (
              <button 
                onClick={() => currentPlayer && onToggleConfirm(currentPlayer.id)}
                className="w-full h-16 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all hover:text-primary hover:border-primary/20"
              >
                <span className="material-symbols-outlined text-[22px]">cancel</span>
                Retirar meu Nome
              </button>
            )}
          </div>
        )}

        {/* User Status Bar */}
        <section className="animate-slide-up delay-200">
          <div 
            className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center justify-between premium-shadow active:scale-[0.98] transition-all cursor-pointer"
            onClick={() => onNavigate('profile')}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={currentPlayer?.avatar} 
                  className="size-14 rounded-full border-2 border-slate-100 object-cover bg-slate-50" 
                  alt="Avatar"
                />
                {isConfirmed && (
                  <div className="absolute -bottom-0.5 -right-0.5 size-5 bg-success rounded-full border-2 border-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[10px] font-black">done</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Meu Status</p>
                <p className="text-xs font-black text-secondary uppercase italic">
                  {isConfirmed ? "Convite Aceito ✅" : "Aguardando Resposta ⏳"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Taxa de Jogo</p>
              <p className={`text-lg font-black italic ${userBalance > 0 ? 'text-primary' : 'text-success'}`}>
                R$ {userBalance}
              </p>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 animate-slide-up delay-300 pb-10">
          <div 
            onClick={() => onNavigate('players')}
            className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 premium-shadow group cursor-pointer active:scale-95 transition-all"
          >
            <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">group</span>
            </div>
            <div>
              <p className="text-2xl font-black text-secondary leading-none italic">
                {activeMatch ? Math.max(activeMatch.limit - confirmedCount, 0) : '0'}
              </p>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Vagas Livres</p>
            </div>
          </div>
          
          <div 
            onClick={() => onNavigate('scout')}
            className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 premium-shadow group cursor-pointer active:scale-95 transition-all"
          >
            <div className="size-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">military_tech</span>
            </div>
            <div>
              <p className="text-2xl font-black text-secondary leading-none italic">#{players.findIndex(p => p.id === currentPlayer?.id) + 1 || '?'}</p>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Minha Posição</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArenaScreen;
