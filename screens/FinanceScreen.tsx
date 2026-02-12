
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
  const confirmedPlayers = players.filter(p => p.confirmed);
  const paidPlayers = players.filter(p => p.paid);
  const totalArrecadado = paidPlayers.length * GAME_FEE;
  const totalGoal = confirmedPlayers.length * GAME_FEE;
  const progress = confirmedPlayers.length > 0 ? Math.round((paidPlayers.length / confirmedPlayers.length) * 100) : 0;

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
    <div className="h-full bg-slate-50 flex flex-col relative">
      <header className="flex items-center justify-between px-6 py-8 sticky top-0 bg-slate-50/80 backdrop-blur-xl z-30 border-b border-slate-100 shrink-0">
        <button onClick={() => onNavigate('home')} className="size-11 bg-white border border-slate-100 text-secondary rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-sm">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <div className="text-center">
          <h2 className="text-xl font-black text-secondary italic tracking-tighter leading-none mb-1">Cofre</h2>
          <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Gestão Financeira</p>
        </div>
        <div className="size-11"></div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6 pt-6">
        {/* Neo-Bank Balance Card */}
        <div className="mb-10 animate-slide-up">
          <div className="bg-white border border-slate-100 rounded-[3rem] p-8 relative overflow-hidden pro-shadow">
            <div className="absolute top-0 right-0 size-40 bg-slate-50 rounded-bl-full opacity-50 -z-0"></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Arrecadação Atual</p>
                <h3 className="text-4xl font-black text-secondary italic truncate leading-none">
                  R$ {totalArrecadado},00 
                </h3>
                <p className="text-[11px] font-medium text-slate-300 mt-2 uppercase tracking-widest italic">Objetivo: R$ {totalGoal}</p>
              </div>
              <div className="size-14 bg-success text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-success/20 shrink-0">
                <span className="material-symbols-outlined text-[32px]">account_balance</span>
              </div>
            </div>
            
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Eficiência de Cobrança</span>
                <span className="text-success">{progress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden p-1 border border-slate-100 shadow-inner">
                <div 
                  className="h-full bg-success rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(16,185,129,0.4)]" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Search & Filter */}
        <div className="mb-8 animate-slide-up delay-100">
          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Pesquisar atleta..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full h-16 bg-white border border-slate-100 rounded-[1.8rem] px-14 text-sm font-bold text-secondary placeholder:text-slate-300 focus:outline-none transition-all pro-shadow" 
            />
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 text-[24px]">search</span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {['Todos', 'Pagos', 'Pendentes'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                className={`px-8 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  filter === f ? 'bg-secondary text-white border-secondary shadow-xl shadow-secondary/20' : 'bg-white text-slate-400 border-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Professional Transaction List */}
        <div className="space-y-4 animate-slide-up delay-200">
          {filteredPlayers.length === 0 ? (
            <div className="py-24 text-center text-slate-300 font-black uppercase text-[11px] tracking-widest italic">Sem registros financeiros</div>
          ) : (
            filteredPlayers.map((player, idx) => (
              <div 
                key={player.id} 
                className="flex items-center justify-between bg-white p-4 rounded-[2.2rem] border border-slate-100 pro-shadow active:scale-[0.98] transition-all group"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex items-center gap-5 min-w-0">
                  <div className="relative">
                    <img src={player.avatar} className="size-14 rounded-full border-4 border-slate-50 p-0.5 object-cover bg-slate-100 shrink-0 shadow-sm" alt={player.name} />
                    {player.paid && (
                      <div className="absolute -bottom-1 -right-1 size-6 bg-success rounded-full border-4 border-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[10px] font-black">check</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[15px] font-black text-secondary uppercase italic leading-none mb-1.5 truncate group-hover:text-primary transition-colors">{player.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${player.paid ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                        {player.paid ? 'Confirmado' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleTogglePayment(player)}
                  className={`px-6 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ml-4 ${
                    player.paid 
                      ? 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100' 
                      : 'bg-primary text-white shadow-lg shadow-primary/20 hover:brightness-110'
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
