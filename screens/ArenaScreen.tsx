
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
  const CROATIA_LOGO = "https://upload.wikimedia.org/wikipedia/en/d/d0/Croatian_Football_Federation_logo.svg";

  return (
    <div className="h-full bg-background overflow-y-auto no-scrollbar pb-36 px-5">
      {/* Header Fiel ao Print */}
      <header className="flex items-center justify-between pt-8 pb-4 sticky top-0 z-40 bg-background/90 backdrop-blur-md -mx-5 px-5">
        <div className="flex items-center gap-2">
          <img src={CROATIA_LOGO} alt="Logo" className="size-8 object-contain" />
          <div className="flex flex-col">
            <h1 className="text-lg font-black text-secondary italic tracking-tighter leading-none">
              O<span className="text-primary">&</span>A
            </h1>
            <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Elite Manager</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button 
              onClick={() => onNavigate('create-match')}
              className="size-10 bg-primary text-white rounded-xl flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-[20px] font-bold">add</span>
            </button>
          )}
          <button 
            onClick={() => onNavigate('profile')}
            className="size-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-secondary shadow-sm active:scale-90"
          >
            <span className="material-symbols-outlined text-[20px]">account_circle</span>
          </button>
        </div>
      </header>

      <div className="mt-4 space-y-6">
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Próxima Convocação</h2>
            {activeMatch && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 rounded-full border border-primary/10">
                <span className="size-1.5 bg-primary rounded-full animate-pulse"></span>
                <span className="text-[7px] font-black text-primary uppercase tracking-widest">Inscrições Abertas</span>
              </div>
            )}
          </div>

          {activeMatch ? (
            <div className="stadium-overlay rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-2xl animate-scale-in">
              {/* Overlay Content */}
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[8px] font-bold uppercase tracking-widest border border-white/10">
                    {activeMatch.type} (7x7)
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-white/60 uppercase tracking-widest mb-0.5">Taxa de Arena</p>
                    <p className="text-xs font-black italic">R$ {activeMatch.price}</p>
                  </div>
                </div>

                <div className="text-center mb-10">
                  <h3 className="text-6xl font-black italic tracking-tighter leading-none mb-1">{activeMatch.time}</h3>
                  <p className="text-[10px] font-bold text-white/70 tracking-[0.3em] uppercase">{activeMatch.date}</p>
                </div>

                {/* Location Pill */}
                <div className="bg-secondary/40 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white/10 mb-8 max-w-[90%]">
                  <div className="size-8 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-white text-[18px]">location_on</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">Localização</p>
                    <p className="text-[11px] font-black truncate">{activeMatch.location}</p>
                  </div>
                </div>

                {/* Progress Bar Fiel */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                    <span className="opacity-60">Confirmados</span>
                    <span>{confirmedCount} / {activeMatch.limit}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${(confirmedCount/activeMatch.limit)*100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-[40px] text-slate-200 mb-4">sports_soccer</span>
              <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Aguardando nova pelada...</p>
            </div>
          )}
        </section>

        {/* Botão de Presença Fiel ao Print */}
        {activeMatch && (
          <button 
            onClick={() => currentPlayer && onToggleConfirm(currentPlayer.id)}
            className="w-full h-14 bg-white border border-slate-50 rounded-2xl flex items-center justify-center gap-3 shadow-sm active:scale-95 transition-all group"
          >
            <span className="material-symbols-outlined text-slate-400 group-active:text-primary transition-colors">
              {isConfirmed ? 'cancel' : 'check_circle'}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
              {isConfirmed ? 'Retirar Presença' : 'Confirmar Presença'}
            </span>
          </button>
        )}

        {/* User Info Card Fiel ao Print */}
        <section>
          <div className="bg-white rounded-[1.8rem] p-5 flex items-center justify-between shadow-sm border border-slate-50">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={currentPlayer?.avatar} className="size-14 rounded-full border-4 border-slate-50 object-cover shadow-sm" alt="Profile" />
                {isConfirmed && (
                  <div className="absolute -bottom-1 -right-1 size-5 bg-success rounded-full border-2 border-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[10px] font-black">done</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Meu Status</p>
                <p className={`text-[11px] font-black uppercase italic ${isConfirmed ? 'text-secondary' : 'text-slate-300'}`}>
                  {isConfirmed ? "Convocado ✅" : "Pendente ⏳"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Taxa</p>
              <p className={`text-sm font-black italic ${userBalance > 0 ? 'text-primary' : 'text-success'}`}>
                {userBalance > 0 ? `R$ ${userBalance}` : 'Pago'}
              </p>
            </div>
          </div>
        </section>

        {/* Info Grid Fiel ao Print */}
        <div className="grid grid-cols-2 gap-4 pb-10">
          <div onClick={() => onNavigate('players')} className="bg-white rounded-[1.8rem] p-6 space-y-4 border border-slate-50 shadow-sm active:scale-95 transition-all cursor-pointer">
            <div className="size-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px] font-bold">groups</span>
            </div>
            <div>
              <p className="text-3xl font-black text-secondary italic leading-none">
                {activeMatch ? Math.max(activeMatch.limit - confirmedCount, 0) : '0'}
              </p>
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.1em] mt-1">Vagas Livres</p>
            </div>
          </div>
          <div onClick={() => onNavigate('scout')} className="bg-white rounded-[1.8rem] p-6 space-y-4 border border-slate-50 shadow-sm active:scale-95 transition-all cursor-pointer">
            <div className="size-10 bg-secondary/5 rounded-xl flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px] font-bold">leaderboard</span>
            </div>
            <div>
              <p className="text-3xl font-black text-secondary italic leading-none">
                #{players.findIndex(p => p.id === currentPlayer?.id) + 1 || '1'}
              </p>
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.1em] mt-1">Meu Ranking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArenaScreen;
