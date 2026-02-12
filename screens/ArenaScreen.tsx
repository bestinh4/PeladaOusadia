
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

  const handleInvite = () => {
    if (!activeMatch) return;
    const appUrl = window.location.href;
    const text = `*⚽ CONVOCAÇÃO OUSADIA & ALEGRIA*\n\nEstamos recrutando para a próxima partida!\n\n📍 *Local:* ${activeMatch.location}\n📅 *Data:* ${activeMatch.date}\n⏰ *Hora:* ${activeMatch.time}\n💰 *Valor:* R$ ${activeMatch.price},00\n\n_Confirme sua presença pelo app!_\n👉 ${appUrl}`;
    navigator.clipboard.writeText(text);
    alert("Convite copiado! Cole agora no grupo do WhatsApp para convocar o pessoal. 🚀");
  };

  return (
    <div className="h-full bg-slate-50 overflow-y-auto no-scrollbar pb-36 px-6">
      <header className="flex items-center justify-between pt-10 pb-6 sticky top-0 z-40 bg-slate-50/80 backdrop-blur-xl -mx-6 px-6">
        <div>
          <h1 className="text-2xl font-black text-secondary italic tracking-tighter leading-none">O<span className="text-primary">&</span>A</h1>
          <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mt-1.5">Elite Manager</p>
        </div>
        <div className="flex items-center gap-2">
          {activeMatch && (
             <button 
                onClick={handleInvite}
                className="size-11 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 active:scale-90 transition-all shadow-sm"
                title="Convidar Galera"
              >
                <span className="material-symbols-outlined text-[24px]">share</span>
              </button>
          )}
          {isAdmin && (
            <button 
              onClick={() => onNavigate('create-match')}
              className="size-11 bg-secondary text-white rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-xl shadow-secondary/20"
              title="Nova Partida"
            >
              <span className="material-symbols-outlined text-[24px]">add</span>
            </button>
          )}
          {isAdmin && (
            <button 
              onClick={() => onNavigate('finance')}
              className="size-11 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-secondary shadow-sm active:scale-90 transition-all relative"
            >
              <span className="material-symbols-outlined text-[24px]">payments</span>
              {players.some(p => !p.paid && p.confirmed) && (
                <span className="absolute top-0 right-0 size-2.5 bg-primary rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>
          )}
        </div>
      </header>

      <div className="space-y-8 mt-4">
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Próximo Confronto</h2>
            {activeMatch && (
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <span className="size-1.5 bg-primary rounded-full animate-pulse"></span>
                <span className="text-[8px] font-black text-primary uppercase tracking-widest">Inscrições Abertas</span>
              </div>
            )}
          </div>

          {activeMatch ? (
            <div className="stadium-overlay rounded-[3rem] p-8 border border-white/10 relative overflow-hidden pro-shadow animate-scale-in">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">
                    {activeMatch.type} (7x7)
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-0.5">Arena Price</p>
                    <p className="text-sm font-black text-white italic">R$ {activeMatch.price}</p>
                  </div>
                </div>

                <div className="mb-10 text-center">
                  <h3 className="text-5xl font-black text-white italic tracking-tighter mb-1">{activeMatch.time}</h3>
                  <p className="text-sm font-bold text-white/70 uppercase tracking-widest">{activeMatch.date}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-5 border border-white/5 flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="size-10 bg-primary text-white rounded-xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[22px]">location_on</span>
                    </div>
                    <div className="truncate">
                      <p className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Localização</p>
                      <p className="text-xs font-black text-white truncate">{activeMatch.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white">
                    <span className="opacity-60">Escalação Confirmada</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-md">{confirmedCount} / {activeMatch.limit}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${(confirmedCount/activeMatch.limit)*100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center animate-scale-in">
              <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                <span className="material-symbols-outlined text-[40px]">sports_soccer</span>
              </div>
              <p className="text-[11px] font-black text-secondary uppercase tracking-widest leading-relaxed mb-6">
                Nenhuma convocação ativa.
              </p>
              {isAdmin && (
                <button 
                  onClick={() => onNavigate('create-match')}
                  className="px-8 h-12 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                  Lançar Primeiro Jogo
                </button>
              )}
            </div>
          )}
        </section>

        {activeMatch && (
          <div className="animate-slide-up delay-100">
            {!isConfirmed ? (
              <button 
                onClick={() => currentPlayer && onToggleConfirm(currentPlayer.id)}
                disabled={confirmedCount >= activeMatch.limit}
                className="w-full h-20 btn-elite rounded-3xl flex items-center justify-center gap-4 shadow-2xl shadow-primary/30 disabled:opacity-50 disabled:grayscale"
              >
                <span className="material-symbols-outlined font-black text-[28px] text-white">check_circle</span>
                <span className="text-sm uppercase tracking-[0.2em] font-black italic text-white">Confirmar Presença</span>
              </button>
            ) : (
              <button 
                onClick={() => currentPlayer && onToggleConfirm(currentPlayer.id)}
                className="w-full h-18 bg-white border-2 border-slate-100 text-slate-400 rounded-3xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all hover:text-primary hover:border-primary/20"
              >
                <span className="material-symbols-outlined text-[22px]">cancel</span>
                Retirar meu Nome
              </button>
            )}
          </div>
        )}

        <section className="animate-slide-up delay-200">
          <div 
            onClick={() => onNavigate('profile')}
            className="bg-white border border-slate-100 rounded-[2.5rem] p-6 flex items-center justify-between pro-shadow active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={currentPlayer?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} 
                  className="size-16 rounded-full border-4 border-slate-50 object-cover shadow-sm" 
                  alt="Avatar"
                />
                {isConfirmed && (
                  <div className="absolute -bottom-1 -right-1 size-6 bg-success rounded-full border-4 border-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[12px] font-black">done</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Meu Status</p>
                <p className={`text-sm font-black uppercase italic ${isConfirmed ? 'text-secondary' : 'text-slate-300'}`}>
                  {isConfirmed ? "Convocado ✅" : "Pendente ⏳"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Taxa</p>
              <p className={`text-xl font-black italic ${userBalance > 0 ? 'text-primary' : 'text-success'}`}>
                {userBalance > 0 ? `R$ ${userBalance}` : 'Pago'}
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-5 animate-slide-up delay-300 pb-12">
          <div 
            onClick={() => onNavigate('players')}
            className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-4 pro-shadow group cursor-pointer active:scale-95 transition-all"
          >
            <div className="size-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[26px]">groups</span>
            </div>
            <div>
              <p className="text-3xl font-black text-secondary leading-none italic">
                {activeMatch ? Math.max(activeMatch.limit - confirmedCount, 0) : '0'}
              </p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Vagas Livres</p>
            </div>
          </div>
          
          <div 
            onClick={() => onNavigate('scout')}
            className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-4 pro-shadow group cursor-pointer active:scale-95 transition-all"
          >
            <div className="size-12 bg-secondary/5 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[26px]">military_tech</span>
            </div>
            <div>
              <p className="text-3xl font-black text-secondary leading-none italic">#{players.findIndex(p => p.id === currentPlayer?.id) + 1 || '?'}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Meu Ranking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArenaScreen;
