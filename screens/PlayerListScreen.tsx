
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
    // 1. Filter by Status Tab
    let list = players.filter(p => {
      if (tab === 'confirmados') return p.confirmed;
      if (tab === 'espera') return !p.confirmed && (parseInt(p.id) % 3 === 0); // Mocking "waiting"
      if (tab === 'nao-vao') return !p.confirmed && (parseInt(p.id) % 3 !== 0); // Mocking "no-show"
      return true;
    });

    // 2. Filter by Search
    if (search.trim()) {
      list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    // 3. Filter by Position
    if (posFilter !== 'Todos') {
      list = list.filter(p => p.position === posFilter);
    }

    // 4. Sort
    list.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [players, tab, search, posFilter, sortBy]);

  return (
    <div className="h-full bg-background flex flex-col relative">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 sticky top-0 bg-white/90 backdrop-blur-md z-30 animate-fade-in border-b border-slate-100 shrink-0">
        <button onClick={() => onNavigate('home')} className="size-10 flex items-center justify-center rounded-xl bg-slate-50 text-secondary hover:text-primary transition-all active:scale-90 hover:bg-slate-100">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-xl font-black text-secondary italic tracking-tighter">Lista de Chamada</h2>
        <button className="size-10 flex items-center justify-center rounded-xl bg-slate-50 text-secondary hover:text-primary transition-all active:scale-90 hover:bg-slate-100">
          <span className="material-symbols-outlined">share</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
        <div className="px-6 mt-8 mb-6 flex items-center justify-between animate-slide-up">
          <div className="flex-1 mr-4">
            <h1 className="text-3xl font-black text-secondary mb-1 italic tracking-tighter leading-none">Vatreni Manager</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Controle de Atletas</p>
          </div>
          <div className="size-14 bg-white rounded-2xl flex items-center justify-center text-primary border border-slate-100 animate-float shadow-lg">
            <span className="material-symbols-outlined text-[30px]">groups</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 mb-6 animate-slide-up delay-100">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 bg-white border border-slate-200 rounded-2xl px-12 text-sm font-bold text-secondary placeholder:text-slate-300 focus:outline-none focus:border-primary transition-all shadow-sm group-hover:border-slate-300"
            />
            <span className="material-symbols-outlined absolute left-4 top-3 text-slate-300 group-focus-within:text-primary transition-colors">search</span>
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-4 top-3 text-slate-300 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabs (Status) */}
        <div className="px-6 flex gap-4 border-b border-slate-100 mb-6 animate-slide-up delay-100">
          {[
            { id: 'confirmados', label: 'Confirmados', count: players.filter(p => p.confirmed).length, icon: 'check_circle', color: 'text-primary' },
            { id: 'espera', label: 'Espera', count: 3, icon: 'schedule', color: 'text-amber-500' },
            { id: 'nao-vao', label: 'Não Vão', count: 5, icon: 'cancel', color: 'text-slate-400' }
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 pb-4 flex flex-col items-center gap-1.5 relative transition-all duration-300 ${tab === t.id ? 'opacity-100 scale-105' : 'opacity-40 grayscale hover:opacity-70'}`}
            >
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[20px] ${t.color}`}>{t.icon}</span>
                <span className="text-[10px] font-black uppercase text-secondary tracking-widest">{t.label}</span>
              </div>
              <div className={`px-3 py-0.5 rounded-full text-[10px] font-black transition-all ${tab === t.id ? 'bg-primary/10 text-primary shadow-sm' : 'bg-slate-50 text-slate-400'}`}>
                {t.count}
              </div>
              {tab === t.id && <div className="absolute bottom-0 w-full h-1 bg-primary rounded-full animate-fade-in"></div>}
            </button>
          ))}
        </div>

        {/* Position Filters */}
        <div className="px-6 mb-6 overflow-x-auto no-scrollbar flex gap-2 animate-slide-up delay-150">
          {positions.map(pos => (
            <button
              key={pos}
              onClick={() => setPosFilter(pos)}
              className={`px-4 h-8 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                posFilter === pos 
                  ? 'bg-secondary text-white border-secondary shadow-md' 
                  : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
              }`}
            >
              {pos === 'Todos' ? 'Todos' : pos === 'Goalkeeper' ? 'Goleiros' : pos === 'Defender' ? 'Defensores' : pos === 'Midfielder' ? 'Meias' : 'Atacantes'}
            </button>
          ))}
        </div>

        {/* Sort & Count */}
        <div className="px-6 mb-4 flex justify-between items-center animate-slide-up delay-200">
          <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{filteredPlayers.length} Jogadores encontrados</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setSortBy(sortBy === 'rating' ? 'name' : 'rating')}
              className="px-3 py-1.5 bg-slate-50 rounded-xl text-[9px] font-black text-secondary uppercase tracking-widest flex items-center gap-2 hover:bg-primary/5 transition-all border border-slate-100"
            >
              <span className="material-symbols-outlined text-[14px]">{sortBy === 'rating' ? 'trending_up' : 'sort_by_alpha'}</span>
              {sortBy === 'rating' ? 'Por Rating' : 'Por Nome'}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="px-6 space-y-3">
          {filteredPlayers.length === 0 ? (
            <div className="py-20 text-center animate-fade-in">
              <span className="material-symbols-outlined text-slate-200 text-6xl mb-4">search_off</span>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Nenhum jogador encontrado</p>
            </div>
          ) : (
            filteredPlayers.map((player, idx) => (
              <div 
                key={player.id}
                onClick={() => onNavigate('profile', player)}
                className="flex items-center gap-4 p-3 rounded-2xl list-item-hover group cursor-pointer bg-white border border-slate-100 shadow-sm animate-slide-in-right"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="relative">
                  <div className="size-14 rounded-full p-0.5 border-2 border-slate-100 group-hover:border-primary/40 transition-all overflow-hidden bg-slate-50">
                    <img src={player.avatar} className="size-full rounded-full object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 size-6 bg-secondary border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-md">
                    {idx + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-[15px] font-black text-secondary uppercase group-hover:text-primary transition-colors tracking-tight">{player.name}</h4>
                    {player.rating > 85 && <span className="material-symbols-outlined text-amber-500 text-[16px]">verified</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className={`material-symbols-outlined text-[10px] ${i <= Math.round(player.rating / 20) ? 'text-primary' : 'text-slate-100'}`}>star</span>
                      ))}
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">{player.position}</span>
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-sm font-black text-secondary italic">{player.rating}</div>
                   <div className="text-[8px] font-black text-slate-300 uppercase">Rating</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Action Buttons Area */}
      <div className="absolute bottom-10 left-0 w-full px-6 flex gap-3 z-40 animate-slide-up pointer-events-none">
        <button className="flex-1 h-15 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-secondary font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all hover:bg-slate-50 shadow-xl pointer-events-auto">
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Convidar
        </button>
        <button className="flex-[1.8] h-15 btn-primary rounded-2xl flex items-center justify-center gap-3 text-xs tracking-widest shadow-2xl pointer-events-auto">
          <span className="material-symbols-outlined font-black">check</span>
          Confirmar Presença
        </button>
      </div>
    </div>
  );
};

export default PlayerListScreen;
