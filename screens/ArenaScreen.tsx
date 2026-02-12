
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
    <div className="h-full bg-background overflow-y-auto no-scrollbar pb-36 pt-4 sm:pt-6 px-4 sm:px-6">
      {/* Header Responsive */}
      <header className="flex items-center justify-between mb-6 sm:mb-8 animate-fade-in">
        <h1 className="text-lg sm:text-xl font-black text-secondary italic tracking-tighter">Vatreni Manager</h1>
        <div className="flex items-center gap-2 sm:gap-3">
          {isAdmin && (
            <button 
              onClick={() => onNavigate('create-match')}
              className="size-9 sm:size-10 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center active:scale-90 transition-all"
              title="Criar Partida"
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]">add_circle</span>
            </button>
          )}
          <button 
            onClick={() => onNavigate('finance')}
            className="group relative size-9 sm:size-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[24px] interactive-icon">payments</span>
            {players.some(p => !p.paid && p.confirmed) && (
              <div className="absolute -top-1 -right-1 size-2.5 sm:size-3 bg-primary rounded-full border-2 border-white animate-pulse"></div>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section Responsive */}
      <div className="space-y-4">
        <div className="flex items-center justify-between animate-slide-up">
          <h2 className="text-xl sm:text-2xl font-black text-secondary italic">Próxima Partida</h2>
          <span className="px-2.5 py-1 bg-primary/10 rounded-full text-[9px] sm:text-[10px] font-black text-primary tracking-widest uppercase border border-primary/20 whitespace-nowrap">
            {activeMatch ? 'Agendada' : 'Nenhuma'}
          </span>
        </div>

        {/* Match Card Optimized for all sizes */}
        {activeMatch ? (
          <div className="stadium-bg rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 relative overflow-hidden group premium-card animate-slide-up delay-100 cursor-default bg-white">
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <span className="size-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#ff0000]"></span>
              <span className="text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-widest">Status: Ativo</span>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-black text-secondary italic tracking-tighter mb-1 leading-tight">{activeMatch.date}</h3>
              <p className="text-3xl sm:text-4xl font-black text-primary italic mb-6 sm:mb-8 drop-shadow-sm">{activeMatch.time}</p>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-slate-100 flex items-center justify-between transition-all">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="size-8 sm:size-10 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px] sm:text-[22px]">location_on</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs font-black text-secondary truncate">{activeMatch.location}</p>
                    <p className="text-[8px] sm:text-[9px] font-medium text-slate-400 uppercase tracking-wider">{activeMatch.type}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 space-y-2">
                <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Confirmados</span>
                  <span className="text-secondary">
                    <span className="text-primary font-black">{confirmedCount}</span> / {activeMatch.limit}
                  </span>
                </div>
                <div className="w-full h-2 sm:h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div 
                    className="h-full bg-primary transition-all duration-1000 ease-out rounded-full shadow-[0_0_8px_rgba(255,0,0,0.4)]" 
                    style={{ width: `${Math.min((confirmedCount/activeMatch.limit)*100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 italic">
                  {confirmedCount >= activeMatch.limit ? "Lista completa! ⚽" : `Restam ${Math.max(activeMatch.limit - confirmedCount, 0)} vagas.`}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-10 sm:p-12 flex flex-col items-center justify-center text-center animate-slide-up delay-100">
            <span className="material-symbols-outlined text-[40px] sm:text-[48px] text-slate-200 mb-4">sports_soccer</span>
            <p className="text-[11px] sm:text-sm font-black text-slate-300 uppercase italic tracking-widest leading-relaxed">
              Sem partidas ativas no momento.<br/>Aguarde o convite!
            </p>
            {isAdmin && (
              <button 
                onClick={() => onNavigate('create-match')}
                className="mt-6 px-6 py-3 bg-secondary text-white rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all shadow-lg"
              >
                Criar Nova Partida
              </button>
            )}
          </div>
        )}
      </div>

      {/* Actions Optimized */}
      {activeMatch && (
        <div className="mt-6 sm:mt-8 space-y-3 animate-slide-up delay-200">
          {!isConfirmed ? (
            <button 
              onClick={() => currentPlayer && onToggleConfirm(currentPlayer.id)}
              disabled={confirmedCount >= activeMatch.limit}
              className="w-full h-14 sm:h-15 btn-primary rounded-2xl flex items-center justify-center gap-3 active:scale-95 shadow-xl disabled:opacity-50 disabled:grayscale transition-all"
            >
              <span className="material-symbols-outlined font-black text-[20px] sm:text-[24px]">check_circle</span>
              <span className="text-xs sm:text-sm uppercase tracking-wider">Marcar Presença</span>
            </button>
          ) : (
            <button 
              onClick={() => currentPlayer && onToggleConfirm(currentPlayer.id)}
              className="w-full h-14 sm:h-15 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] sm:text-xs active:scale-95 transition-all hover:text-primary hover:border-primary/20"
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]">cancel</span>
              Retirar Meu Nome
            </button>
          )}
        </div>
      )}

      {/* Status Card Responsive */}
      <div className="mt-6 animate-slide-up delay-300">
        <div 
          className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 flex items-center justify-between premium-card group cursor-pointer shadow-sm active:scale-[0.98] transition-all" 
          onClick={() => onNavigate('profile')}
        >
          <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
            <div className="relative flex-shrink-0">
              <div className="size-12 sm:size-14 rounded-full p-0.5 border-2 border-slate-100 transition-all overflow-hidden bg-slate-50">
                <img 
                  src={currentPlayer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentPlayer?.id || 'guest'}`} 
                  className="size-full rounded-full object-cover" 
                  alt="Avatar"
                />
              </div>
              {isConfirmed && (
                <div className="absolute -bottom-0.5 -right-0.5 size-5 sm:size-6 bg-primary rounded-full border-[3px] border-white flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-white text-[10px] sm:text-[12px] font-bold">check</span>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 truncate">Minha Atividade</p>
              <p className="text-xs sm:text-sm font-black text-secondary truncate">
                {isConfirmed ? "Confirmado ✅" : "Pendente ⏳"}
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Taxa</p>
            <p className={`text-base sm:text-lg font-black transition-all ${userBalance > 0 ? 'text-primary' : 'text-success'}`}>
              R$ {userBalance}
            </p>
          </div>
        </div>
      </div>

      {/* Mini Stats Responsive Grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 animate-slide-up delay-400">
        <div 
          onClick={() => onNavigate('players')}
          className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 space-y-3 sm:space-y-4 premium-card group cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <div className="size-9 sm:size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all">
            <span className="material-symbols-outlined text-[20px] sm:text-[24px] interactive-icon">groups</span>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-secondary leading-none">
              {activeMatch ? Math.max(activeMatch.limit - confirmedCount, 0) : '0'}
            </p>
            <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Disponível</p>
          </div>
        </div>
        
        <div 
          onClick={() => onNavigate('finance')}
          className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 space-y-3 sm:space-y-4 premium-card group cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <div className="size-9 sm:size-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary group-hover:bg-secondary/20 transition-all">
            <span className="material-symbols-outlined text-[20px] sm:text-[24px] interactive-icon">payments</span>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-secondary leading-none">R$ {GAME_FEE}</p>
            <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Custo/Jogo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArenaScreen;
