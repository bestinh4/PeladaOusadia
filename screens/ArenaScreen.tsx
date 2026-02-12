
import React from 'react';
import { Screen, Player } from '../types';

interface ArenaScreenProps {
  players: Player[];
  currentPlayer: Player | null;
  onToggleConfirm: (id: string) => void;
  onNavigate: (screen: Screen) => void;
}

const ArenaScreen: React.FC<ArenaScreenProps> = ({ players, currentPlayer, onToggleConfirm, onNavigate }) => {
  const confirmedCount = players.filter(p => p.confirmed).length;
  const isConfirmed = currentPlayer?.confirmed || false;

  return (
    <div className="h-full bg-background overflow-y-auto no-scrollbar pb-32 pt-6 px-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 animate-fade-in">
        <h1 className="text-xl font-black text-secondary italic tracking-tighter">Vatreni Manager</h1>
        <button 
          onClick={() => onNavigate('finance')}
          className="group relative size-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90"
        >
          <span className="material-symbols-outlined text-[24px] interactive-icon">payments</span>
          <div className="absolute -top-1 -right-1 size-3 bg-primary rounded-full border-2 border-white animate-pulse"></div>
        </button>
      </header>

      {/* Hero Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between animate-slide-up">
          <h2 className="text-2xl font-black text-secondary italic">Próxima Partida</h2>
          <span className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black text-primary tracking-widest uppercase animate-pulse border border-primary/20">Em 3 Dias</span>
        </div>

        {/* Match Card */}
        <div className="stadium-bg rounded-[2.5rem] p-8 border border-slate-100 relative overflow-hidden group premium-card animate-slide-up delay-100 cursor-pointer bg-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="size-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#ff0000]"></span>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Confirmado</span>
          </div>
          <h3 className="text-3xl font-black text-secondary italic tracking-tighter mb-1 transition-transform group-hover:translate-x-1">Sábado, 24 Out</h3>
          <p className="text-4xl font-black text-primary italic mb-8 drop-shadow-sm">18:00</p>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between group-hover:bg-slate-100 transition-all group-hover:scale-[1.02]">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:rotate-6 transition-transform">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <p className="text-xs font-black text-secondary">Arena Central</p>
                <p className="text-[9px] font-medium text-slate-400">Campo 3 • Sintético</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-300 text-[18px] group-hover:text-primary transition-colors">open_in_new</span>
          </div>

          <div className="mt-8 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span className="text-slate-400">Jogadores</span>
              <span className="text-secondary"><span className="text-primary font-black">{confirmedCount}</span> / 18</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-primary transition-all duration-1000 ease-out rounded-full" style={{ width: `${(confirmedCount/18)*100}%` }}></div>
            </div>
            <p className="text-[9px] font-bold text-slate-400 italic">
              {confirmedCount >= 18 ? "Time fechado! ⚽" : `Faltam ${18 - confirmedCount} guerreiros!`}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 space-y-3 animate-slide-up delay-200">
        {!isConfirmed ? (
          <button 
            onClick={() => currentPlayer && onToggleConfirm(currentPlayer.id)}
            className="w-full h-15 btn-primary rounded-2xl flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined font-black">check_circle</span>
            Confirmar Presença
          </button>
        ) : (
          <button 
            onClick={() => currentPlayer && onToggleConfirm(currentPlayer.id)}
            className="w-full h-15 bg-white border border-slate-200 text-slate-400 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs active:scale-95 transition-all hover:bg-slate-50 hover:text-primary hover:border-primary/20"
          >
            <span className="material-symbols-outlined">cancel</span>
            Desistir
          </button>
        )}
      </div>

      {/* Status Card */}
      <div className="mt-6 animate-slide-up delay-300">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center justify-between premium-card group cursor-default shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="size-14 rounded-full p-0.5 border-2 border-slate-100 group-hover:border-primary/40 transition-all overflow-hidden bg-slate-50">
                <img src={currentPlayer?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} className="size-full rounded-full transition-transform group-hover:scale-110 object-cover" />
              </div>
              {isConfirmed && (
                <div className="absolute -bottom-1 -right-1 size-6 bg-primary rounded-full border-4 border-white flex items-center justify-center animate-scale-in shadow-lg">
                  <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Seu Perfil</p>
              <p className="text-sm font-black text-secondary">
                {isConfirmed ? "Confirmado ✅" : "Pendente ⏳"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Saldo</p>
            <p className="text-lg font-black text-primary transition-all group-hover:scale-110 origin-right">R$ 20,00</p>
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
            <p className="text-2xl font-black text-secondary">{18 - confirmedCount}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Vagas abertas</p>
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
            <p className="text-2xl font-black text-secondary">R$ 30</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Taxa de jogo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArenaScreen;
