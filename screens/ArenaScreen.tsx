
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
    <div className="h-full bg-background overflow-y-auto no-scrollbar pb-48 px-8 sm:px-12">
      <header className="flex items-center justify-between pt-14 pb-10 sticky top-0 z-40 bg-background/95 backdrop-blur-3xl -mx-8 sm:-mx-12 px-8 sm:px-12 border-b border-slate-100">
        <div className="flex items-center gap-5">
          <img src={CROATIA_LOGO} alt="Logo" className="size-16 object-contain drop-shadow-md" />
          <div>
            <h1 className="text-3xl font-black text-secondary italic tracking-tighter leading-none">O<span className="text-primary">&</span>A</h1>
            <p className="text-[12px] font-black text-primary uppercase tracking-[0.5em] mt-2">Elite Manager</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <button 
              onClick={() => onNavigate('create-match')}
              className="size-16 bg-primary text-white rounded-[1.8rem] flex items-center justify-center active:scale-90 transition-all shadow-2xl shadow-primary/40"
            >
              <span className="material-symbols-outlined text-[36px] font-bold">add</span>
            </button>
          )}
          {isAdmin && (
            <button 
              onClick={() => onNavigate('finance')}
              className="size-16 bg-white border border-slate-100 rounded-[1.8rem] flex items-center justify-center text-secondary shadow-sm active:scale-90 transition-all relative"
            >
              <span className="material-symbols-outlined text-[36px] font-bold">payments</span>
              {players.some(p => !p.paid && p.confirmed) && (
                <span className="absolute top-1.5 right-1.5 size-4 bg-primary rounded-full border-[3px] border-white animate-pulse"></span>
              )}
            </button>
          )}
        </div>
      </header>

      <div className="space-y-12 mt-10">
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[14px] font-black text-slate-400 uppercase tracking-[0.2em]">Próxima Convocação</h2>
            {activeMatch && (
              <div className="flex items-center gap-3 px-5 py-2.5 bg-primary/10 rounded-full">
                <span className="size-2.5 bg-primary rounded-full animate-pulse"></span>
                <span className="text-[11px] font-black text-primary uppercase tracking-widest">Inscrições Abertas</span>
              </div>
            )}
          </div>

          {activeMatch ? (
            <div className="stadium-overlay rounded-[4.5rem] p-12 border border-white/10 relative overflow-hidden pro-shadow animate-scale-in min-h-[500px] flex flex-col justify-between">
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-14">
                  <div className="px-6 py-3 bg-white/15 backdrop-blur-xl rounded-[1.4rem] border border-white/20 text-[13px] font-black text-white uppercase tracking-widest">
                    {activeMatch.type} (7x7)
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] font-black text-white/50 uppercase tracking-widest mb-1.5">Taxa Arena</p>
                    <p className="text-2xl font-black text-white italic">R$ {activeMatch.price}</p>
                  </div>
                </div>

                <div className="mb-14 text-center">
                  <h3 className="text-8xl font-black text-white italic tracking-tighter mb-4 drop-shadow-2xl">{activeMatch.time}</h3>
                  <p className="text-2xl font-bold text-white/80 uppercase tracking-[0.3em]">{activeMatch.date}</p>
                </div>

                <div className="bg-white/15 backdrop-blur-3xl rounded-[2.8rem] p-8 border border-white/15 flex items-center justify-between mb-12">
                  <div className="flex items-center gap-6 min-w-0">
                    <div className="size-18 bg-primary text-white rounded-[1.6rem] flex items-center justify-center shrink-0 shadow-2xl">
                      <span className="material-symbols-outlined text-[38px] font-bold">location_on</span>
                    </div>
                    <div className="truncate">
                      <p className="text-[12px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mb-2">Arena Oficial</p>
                      <p className="text-lg font-black text-white truncate">{activeMatch.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex justify-between items-center text-[14px] font-black uppercase tracking-widest text-white">
                    <span className="opacity-60">Escalação Atual</span>
                    <span className="bg-white/25 px-4 py-1.5 rounded-xl text-[16px]">{confirmedCount} / {activeMatch.limit}</span>
                  </div>
                  <div className="w-full h-4.5 bg-white/10 rounded-full overflow-hidden p-1 border border-white/10 shadow-inner">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(255,255,255,0.8)]" 
                      style={{ width: `${(confirmedCount/activeMatch.limit)*100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 size-48 kockasti-pattern opacity-[0.06] pointer-events-none -rotate-12 translate-x-16 -translate-y-16"></div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[4.5rem] p-20 flex flex-col items-center justify-center text-center animate-scale-in">
              <span className="material-symbols-outlined text-[72px] text-slate-200 mb-10">sports_soccer</span>
              <p className="text-[16px] font-black text-secondary uppercase tracking-widest mb-12">Nenhum jogo agendado.</p>
              {isAdmin && (
                <button onClick={() => onNavigate('create-match')} className="px-14 h-20 bg-secondary text-white rounded-[2.5rem] font-black uppercase text-[14px] tracking-widest shadow-2xl shadow-secondary/20 hover:scale-105 transition-all">Lançar Pelada</button>
              )}
            </div>
          )}
        </section>

        {activeMatch && (
          <div className="animate-slide-up delay-100">
            <button 
              onClick={() => currentPlayer && onToggleConfirm(currentPlayer.id)}
              disabled={!isConfirmed && confirmedCount >= activeMatch.limit}
              className={`w-full h-28 rounded-[3rem] flex items-center justify-center gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all active:scale-95 disabled:opacity-50 ${isConfirmed ? 'bg-white border-2 border-slate-100 text-slate-400' : 'btn-elite text-white shadow-primary/40'}`}
            >
              <span className="material-symbols-outlined font-black text-[42px]">{isConfirmed ? 'cancel' : 'check_circle'}</span>
              <span className="text-xl uppercase tracking-[0.2em] font-black italic">{isConfirmed ? 'Retirar Presença' : 'Confirmar Presença'}</span>
            </button>
          </div>
        )}

        <section className="animate-slide-up delay-200">
          <div 
            onClick={() => onNavigate('profile')}
            className="bg-white border border-slate-100 rounded-[3.5rem] p-10 flex items-center justify-between pro-shadow active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-8">
              <div className="relative">
                <img src={currentPlayer?.avatar} className="size-24 rounded-full border-[6px] border-slate-50 object-cover shadow-lg" alt="Avatar" />
                {isConfirmed && (
                  <div className="absolute -bottom-1.5 -right-1.5 size-10 bg-success rounded-full border-[5px] border-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[18px] font-black">done</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-[13px] font-black text-slate-400 uppercase tracking-widest mb-2">Meu Status</p>
                <p className={`text-xl font-black uppercase italic ${isConfirmed ? 'text-secondary' : 'text-slate-300'}`}>
                  {isConfirmed ? "Convocado ✅" : "Pendente ⏳"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[13px] font-black text-slate-400 uppercase tracking-widest mb-2">Taxa</p>
              <p className={`text-3xl font-black italic ${userBalance > 0 ? 'text-primary' : 'text-success'}`}>
                {userBalance > 0 ? `R$ ${userBalance}` : 'Pago'}
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-8 animate-slide-up delay-300 pb-20">
          <div onClick={() => onNavigate('players')} className="bg-white border border-slate-100 rounded-[3rem] p-10 space-y-8 pro-shadow group cursor-pointer active:scale-95 transition-all">
            <div className="size-20 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[42px] font-bold">groups</span>
            </div>
            <div>
              <p className="text-5xl font-black text-secondary italic leading-none">{activeMatch ? Math.max(activeMatch.limit - confirmedCount, 0) : '0'}</p>
              <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">Vagas Livres</p>
            </div>
          </div>
          <div onClick={() => onNavigate('scout')} className="bg-white border border-slate-100 rounded-[3rem] p-10 space-y-8 pro-shadow group cursor-pointer active:scale-95 transition-all">
            <div className="size-20 bg-secondary/5 rounded-[2rem] flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[42px] font-bold">leaderboard</span>
            </div>
            <div>
              <p className="text-5xl font-black text-secondary italic leading-none">#{players.findIndex(p => p.id === currentPlayer?.id) + 1 || '?'}</p>
              <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">Meu Ranking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArenaScreen;
