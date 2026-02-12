
import React, { useState, useMemo } from 'react';
import { Player, Screen } from '../types';

interface PlayerListScreenProps {
  players: Player[];
  onToggleConfirm: (id: string) => void;
  onNavigate: (screen: Screen, data?: any) => void;
}

const PlayerListScreen: React.FC<PlayerListScreenProps> = ({ players, onToggleConfirm, onNavigate }) => {
  const [tab, setTab] = useState('confirmados');
  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState('Todos');
  const [sortBy, setSortBy] = useState<'rating' | 'name'>('rating');

  const positions = ['Todos', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

  const filteredPlayers = useMemo(() => {
    let list = players.filter(p => {
      if (tab === 'confirmados') return p.confirmed;
      if (tab === 'pendentes') return !p.confirmed;
      return true;
    });

    if (search.trim()) {
      list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (posFilter !== 'Todos') {
      list = list.filter(p => p.position === posFilter);
    }

    list.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [players, tab, search, posFilter, sortBy]);

  return (
    <div className="h-full bg-background flex flex-col relative">
      <header className="flex items-center justify-between px-6 py-6 sticky top-0 bg-white/90 backdrop-blur-md z-30 border-b border-slate-100 shrink-0">
        <button onClick={() => onNavigate('home')} className="size-10 flex items-center justify-center rounded-xl bg-slate-50 text-secondary hover:text-primary transition-all active:scale-90">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-black text-secondary italic tracking-tighter">Atletas</h2>
        <div className="size-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <div className="px-6 mt-8 mb-6 animate-slide-up">
          <h1 className="text-3xl font-black text-secondary mb-1 italic tracking-tighter uppercase">O<span className="text-primary">&</span>A Squad</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{players.length} Atletas Inscritos</p>
        </div>

        <div className="px-6 mb-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Pesquisar atleta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 bg-white border border-slate-200 rounded-2xl px-12 text-sm font-bold text-secondary focus:outline-none focus:border-primary transition-all shadow-sm"
            />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">search</span>
          </div>
        </div>

        <div className="px-6 flex gap-4 border-b border-slate-100 mb-6">
          {[
            { id: 'confirmados', label: 'Convocados', count: players.filter(p => p.confirmed).length, icon: 'check_circle', color: 'text-primary' },
            { id: 'pendentes', label: 'Lista de Espera', count: players.filter(p => !p.confirmed).length, icon: 'schedule', color: 'text-amber-500' }
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 pb-4 flex flex-col items-center gap-1.5 relative transition-all ${tab === t.id ? 'opacity-100' : 'opacity-40 grayscale'}`}
            >
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[18px] ${t.color}`}>{t.icon}</span>
                <span className="text-[10px] font-black uppercase text-secondary tracking-widest">{t.label}</span>
              </div>
              <div className={`px-3 py-0.5 rounded-full text-[10px] font-black ${tab === t.id ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-400'}`}>
                {t.count}
              </div>
              {tab === t.id && <div className="absolute bottom-0 w-full h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(255,0,0,0.3)]"></div>}
            </button>
          ))}
        </div>

        <div className="px-6 mb-6 overflow-x-auto no-scrollbar flex gap-2">
          {positions.map(pos => (
            <button
              key={pos}
              onClick={() => setPosFilter(pos)}
              className={`px-5 h-9 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
                posFilter === pos ? 'bg-secondary text-white border-secondary shadow-md' : 'bg-white text-slate-400 border-slate-100'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>

        <div className="px-6 space-y-3">
          {filteredPlayers.length === 0 ? (
            <div className="py-20 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest">Nenhum atleta encontrado</div>
          ) : (
            filteredPlayers.map((player, idx) => (
              <div 
                key={player.id}
                onClick={() => onNavigate('profile', player)}
                className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm active:scale-[0.98] transition-all group"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="relative shrink-0">
                  <img src={player.avatar} className="size-14 rounded-full object-cover border-2 border-slate-50" />
                  {player.confirmed && (
                    <div className="absolute -bottom-1 -right-1 size-5 bg-primary rounded-full border-2 border-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[10px] font-bold">check</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-secondary uppercase italic tracking-tight truncate group-hover:text-primary transition-colors">{player.name}</h4>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{player.position}</p>
                </div>
                <div className="text-right shrink-0">
                   <div className="text-lg font-black text-primary italic">{player.rating}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerListScreen;
