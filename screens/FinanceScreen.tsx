
import React, { useState } from 'react';
import { Player, Screen } from '../types';
import { playerService } from '../services/playerService';

interface FinanceScreenProps {
  players: Player[];
  onNavigate: (screen: Screen) => void;
}

const FinanceScreen: React.FC<FinanceScreenProps> = ({ players, onNavigate }) => {
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');

  const GAME_FEE = 30;
  const paidPlayers = players.filter(p => p.paid);
  const totalArrecadado = paidPlayers.length * GAME_FEE;
  const totalGoal = players.length * GAME_FEE;
  const progress = players.length > 0 ? Math.round((paidPlayers.length / players.length) * 100) : 0;

  const filteredPlayers = players.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'Todos') return matchesSearch;
    if (filter === 'Pagos') return p.paid && matchesSearch;
    if (filter === 'Pendentes') return !p.paid && matchesSearch;
    return matchesSearch;
  });

  const handleTogglePayment = async (player: Player) => {
    try {
      await playerService.togglePayment(player.id, player.paid);
    } catch (err: any) {
      alert("Erro ao atualizar pagamento: " + err.message);
    }
  };

  return (
    <div className="h-full bg-background flex flex-col relative">
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 sticky top-0 bg-white/90 backdrop-blur-md z-30 border-b border-slate-100 shadow-sm shrink-0">
        <button onClick={() => onNavigate('home')} className="size-9 sm:size-10 bg-slate-50 text-secondary rounded-xl flex items-center justify-center active:scale-90 transition-all">
          <span className="material-symbols-outlined text-[20px] sm:text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-lg sm:text-xl font-black text-secondary italic tracking-tighter">Financeiro Real</h2>
        <div className="size-9 sm:size-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-4 sm:px-6 pt-4 sm:pt-6">
        {/* Main Stats Card Responsive */}
        <div className="mb-6 sm:mb-8 animate-slide-up">
          <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-7 relative overflow-hidden shadow-md">
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Arrecadado</p>
                <h3 className="text-2xl sm:text-3xl font-black text-secondary italic truncate leading-none">
                  R$ {totalArrecadado},00 
                  <span className="text-[10px] sm:text-xs font-medium text-slate-300 ml-2 uppercase tracking-tight">/ R$ {totalGoal}</span>
                </h3>
              </div>
              <div className="size-11 sm:size-12 bg-success text-white rounded-2xl flex items-center justify-center shadow-lg shadow-success/20 shrink-0 ml-4">
                <span className="material-symbols-outlined text-[24px] sm:text-[28px]">payments</span>
              </div>
            </div>
            
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Cobrança Efetuada</span>
                <span className="text-primary">{progress}%</span>
              </div>
              <div className="w-full h-2.5 sm:h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50 shadow-inner">
                <div 
                  className="h-full bg-success rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters Pixel-Perfect */}
        <div className="mb-6 animate-slide-up delay-100">
          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Pesquisar atleta..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full h-12 sm:h-14 bg-white border border-slate-200 rounded-2xl px-12 text-sm font-bold text-secondary placeholder:text-slate-300 focus:outline-none focus:border-primary transition-all shadow-sm" 
            />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">search</span>
          </div>

          <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
            {['Todos', 'Pagos', 'Pendentes'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                className={`px-5 sm:px-6 h-9 sm:h-10 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === f ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* List items refined */}
        <div className="space-y-3 animate-slide-up delay-200">
          {filteredPlayers.length === 0 ? (
            <div className="py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic">Nenhum registro encontrado</div>
          ) : (
            filteredPlayers.map((player, idx) => (
              <div 
                key={player.id} 
                className="flex items-center justify-between bg-white p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 shadow-sm list-item-hover active:scale-[0.98] transition-all"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <img src={player.avatar} className="size-11 sm:size-12 rounded-full border border-slate-200 p-0.5 object-cover bg-slate-50 shrink-0" alt={player.name} />
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-secondary uppercase italic leading-none mb-1 truncate">{player.name}</h4>
                    <p className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${player.paid ? 'text-success' : 'text-slate-300'}`}>
                      {player.paid ? 'Confirmado ✅' : 'Pendente ⏳'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleTogglePayment(player)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ml-3 ${
                    player.paid 
                      ? 'bg-success/10 text-success border border-success/20 hover:bg-success/20' 
                      : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                  }`}
                >
                  {player.paid ? 'Reverter' : 'Cobrar'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceScreen;
