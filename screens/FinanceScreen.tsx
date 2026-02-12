
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
      <header className="flex items-center justify-between px-6 py-6 sticky top-0 bg-white/90 backdrop-blur-md z-30 border-b border-slate-100 shadow-sm shrink-0">
        <button onClick={() => onNavigate('home')} className="size-10 bg-slate-50 text-secondary rounded-xl flex items-center justify-center active:scale-90 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-xl font-black text-secondary italic">Financeiro Real</h2>
        <div className="size-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-40 px-6 pt-6">
        <div className="mb-8 animate-slide-up">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 relative overflow-hidden shadow-md">
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Caixa da Partida</p>
                <h3 className="text-3xl font-black text-secondary italic">R$ {totalArrecadado},00 <span className="text-xs font-medium text-slate-300">/ R$ {totalGoal}</span></h3>
              </div>
              <div className="size-12 bg-success text-white rounded-2xl flex items-center justify-center shadow-lg shadow-success/20">
                <span className="material-symbols-outlined text-[28px]">payments</span>
              </div>
            </div>
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Progresso de Cobrança</span>
                <span className="text-primary">{progress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50">
                <div className="h-full bg-success rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 animate-slide-up delay-100">
          <div className="relative">
            <input type="text" placeholder="Filtrar por nome..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-12 text-sm font-bold text-secondary placeholder:text-slate-300 focus:outline-none focus:border-primary transition-all shadow-sm" />
            <span className="material-symbols-outlined absolute left-4 top-4 text-slate-300">search</span>
          </div>
        </div>

        <div className="flex gap-3 mb-8 animate-slide-up delay-100">
          {['Todos', 'Pagos', 'Pendentes'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-6 h-10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-secondary text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200'}`}>{f}</button>
          ))}
        </div>

        <div className="space-y-4 animate-slide-up delay-200">
          {filteredPlayers.length === 0 ? (
            <div className="py-10 text-center text-slate-300 font-bold uppercase text-[10px]">Nenhum registro encontrado</div>
          ) : (
            filteredPlayers.map((player) => (
              <div key={player.id} className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm list-item-hover">
                <div className="flex items-center gap-4">
                  <img src={player.avatar} className="size-12 rounded-full border border-slate-200 p-0.5 object-cover bg-slate-50" />
                  <div>
                    <h4 className="text-sm font-black text-secondary uppercase italic leading-none mb-1">{player.name}</h4>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{player.paid ? 'Pago' : 'Pendente'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleTogglePayment(player)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${player.paid ? 'bg-success/10 text-success border border-success/20' : 'bg-primary/10 text-primary border border-primary/20'}`}
                >
                  {player.paid ? 'Confirmado' : 'Cobrar'}
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
