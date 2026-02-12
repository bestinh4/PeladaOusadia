
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
    <div className="h-full bg-background overflow-y-auto no-scrollbar pb-32 pt-6 px-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 animate-fade-in">
        <h1 className="text-xl font-black text-secondary italic tracking-tighter">Vatreni Manager</h1>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button 
              onClick={() => onNavigate('create-match')}
              className="size-10 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined">add_circle</span>
            </button>
          )}
          <button 
            onClick={() => onNavigate('finance')}
            className="group relative size-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-[24px] interactive-icon">payments</span>
            {players.some(p => !p.paid && p.confirmed) && (
              <div className="absolute -top-1 -right-1 size-3 bg-primary rounded-full border-2 border-white animate-pulse"></div>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between animate-slide-up">
          <h2 className="text-2xl font-black text-secondary italic">Próxima Partida</h2>
          <span className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black text-primary tracking-widest uppercase border border-primary/20">
            {activeMatch ? 'Agendada' : 'Nenhuma'}
          </span>
        </div>

        {/* Match Card */}
        {activeMatch ? (
          <div className="stadium-bg rounded-[2.5rem] p-8 border border-slate-100 relative overflow-hidden group premium-card animate-slide-up delay-100 cursor-default bg-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="size-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#ff0000]"></span>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Status: Ativo</span>
            </div>
            <h3 className="text-3xl font-black text-secondary italic tracking-tighter mb-1">{activeMatch.date}</h3>
            <p className="text-4xl font-black text-primary italic mb-8 drop-shadow-sm">{activeMatch.time}</p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between transition-all">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary transition-transform">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <p className="text-xs font-black text-secondary">{activeMatch.location}</p>
                  <p className="text-[9px] font-medium text-slate-400">{activeMatch.type}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Confirmados</span>
                <span className="text-secondary"><span className="text-primary font-black">{confirmedCount}</span> / {activeMatch.limit}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-primary transition-all duration-1000 ease-out rounded-full" style={{ width: `${Math.min((confirmedCount/activeMatch.limit)*100, 100)}%` }}></div>
              </div>
              <p className="text-[9px] font-bold text-slate-400 italic">
                {confirmedCount >= activeMatch.limit ? "Lista completa! ⚽" : `Restam ${Math.max(activeMatch.limit - confirmedCount, 0)} vagas.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center animate-slide-up delay-100">
            <span className="material-symbols-outlined text-[48px] text-slate-200 mb-4">sports_soccer</span>
            <p className="text-sm font-black text-slate-300 uppercase italic tracking-widest">Aguardando nova pelada...</p>
            {isAdmin && (
              <button 
                onClick={() => onNavigate('create-match')}
                className="mt-6 px-6 py-3 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all"
              >
                Criar Agora
              </button>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {activeMatch && (
        <div className="mt-8 space-y-3 animate-slide-up delay-200">
          {!isConfirmed ? (
            <button 
              onClick={() => currentPlayer && onToggleConfirm(currentPlayer.id)}
              disabled={confirmedCount >= activeMatch.limit}
              className="w-full h-15 btn-primary rounded-2xl flex items-center justify-center gap-3 active:scale-95 shadow-lg disabled:opacity-50 disabled:grayscale"
            >
              <span className="material-symbols-outlined font-black">check_circle</span>
              Marcar Presença
            </button>
          ) : (
            <button 
              onClick={() => currentPlayer && onToggleConfirm(currentPlayer.id)}
              className="w-full h-15 bg-white border border-slate-200 text-slate-400 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs active:scale-95 transition-all hover:text-primary hover:border-primary/20"
            >
              <span className="material-symbols-outlined">cancel</span>
              Retirar Nome
            </button>
          )}
        </div>
      )}

      {/* Status Card */}
      <div className="mt-6 animate-slide-up delay-300">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center justify-between premium-card group cursor-pointer shadow-sm" onClick={() => onNavigate('profile')}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="size-14 rounded-full p-0.5 border-2 border-slate-100 transition-all overflow-hidden bg-slate-50">
                <img src={currentPlayer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentPlayer?.id || 'guest'}`} className="size-full rounded-full object-cover" />
              </div>
              {isConfirmed && (
                <div className="absolute -bottom-1 -right-1 size-6 bg-primary rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Seu Status</p>
              <p className="text-sm font-black text-secondary">
                {isConfirmed ? "Confirmado ✅" : "Pendente ⏳"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Débito</p>
            <p className={`text-lg font-black transition-all ${userBalance > 0 ? 'text-primary' : 'text-success'}`}>
              R$ {userBalance},00
            </p>
          </div>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="mt-6 grid grid-cols-2 gap-4 animate-slide-up delay-400">
        <div 
          onClick={() => onNavigate('players')}
          className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 premium-card group cursor-pointer shadow-sm"
        >
          <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all">
            <span className="material-symbols-outlined text-[24px] interactive-icon">groups</span>
          </div>
          <div>
            <p className="text-2xl font-black text-secondary">
              {activeMatch ? Math.max(activeMatch.limit - confirmedCount, 0) : '0'}
            </p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Vagas Livres</p>
          </div>
        </div>
        <div 
          onClick={() => onNavigate('finance')}
          className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 premium-card group cursor-pointer shadow-sm"
        >
          <div className="size-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary group-hover:bg-secondary/20 transition-all">
            <span className="material-symbols-outlined text-[24px] interactive-icon">payments</span>
          </div>
          <div>
            <p className="text-2xl font-black text-secondary">R$ {GAME_FEE}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Taxa de Jogo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArenaScreen;
