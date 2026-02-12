
import React, { useState } from 'react';
import { Player, Screen } from '../types';

interface ScoutScreenProps {
  players: Player[];
  onNavigate: (screen: Screen, data?: any) => void;
}

const ScoutScreen: React.FC<ScoutScreenProps> = ({ players, onNavigate }) => {
  const [filter, setFilter] = useState('Todos');
  
  const sortedPlayers = [...players].sort((a, b) => b.goals - a.goals);
  const filteredPlayers = filter === 'Todos' 
    ? sortedPlayers 
    : sortedPlayers.filter(p => p.position === filter);

  const filters = ['Todos', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'];

  return (
    <div className="h-full bg-background overflow-y-auto no-scrollbar pb-32">
      {/* Header High Impact */}
      <header className="px-6 pt-10 pb-12 bg-secondary relative overflow-hidden sticky top-0 z-40">
        <div className="absolute inset-0 opacity-10 checkerboard-pattern pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/80"></div>
        
        <div className="flex items-center justify-between mb-8 relative z-10">
           <button onClick={() => onNavigate('home')} className="size-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white active:scale-90 transition-all">
             <span className="material-symbols-outlined">chevron_left</span>
           </button>
           <h2 className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase italic">Vatreni Rankings</h2>
           <div className="size-10"></div>
        </div>

        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none mb-2">Hall of <span className="text-primary drop-shadow-lg">Fame</span></h1>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">Season 2024 • Overall Leaders</p>
        </div>
      </header>

      {/* Modern Filter Tabs */}
      <div className="flex gap-2.5 px-6 py-6 overflow-x-auto no-scrollbar glass-header sticky top-[168px] z-30 border-b border-slate-100 shadow-sm">
        {filters.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 h-10 rounded-2xl whitespace-nowrap text-[9px] font-black uppercase tracking-widest transition-all duration-300 border ${
              filter === f 
                ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20' 
                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Ranking List Professional */}
      <div className="px-6 py-8 space-y-4">
        {filteredPlayers.length === 0 ? (
          <div className="py-20 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest italic">Nenhum atleta listado</div>
        ) : (
          filteredPlayers.map((player, idx) => {
            const isTop3 = idx < 3;
            const rankStyles = [
              { border: 'border-amber-400', bg: 'bg-gradient-to-br from-amber-300 to-amber-600', text: 'text-amber-600' },
              { border: 'border-slate-300', bg: 'bg-gradient-to-br from-slate-200 to-slate-400', text: 'text-slate-500' },
              { border: 'border-orange-300', bg: 'bg-gradient-to-br from-orange-200 to-orange-500', text: 'text-orange-600' }
            ];
            
            return (
              <div 
                key={player.id}
                onClick={() => onNavigate('profile', player)}
                className={`flex items-center justify-between p-4 bg-white rounded-3xl border transition-all duration-300 group cursor-pointer animate-slide-up premium-shadow active:scale-[0.98] ${isTop3 ? rankStyles[idx].border : 'border-slate-100'}`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                   <div className="relative shrink-0">
                     <div className="size-16 rounded-2xl overflow-hidden border-2 border-slate-50 p-1 bg-slate-100 transition-all duration-300 group-hover:border-primary">
                        <img src={player.avatar} className="size-full object-cover rounded-xl" alt={player.name} />
                     </div>
                     <div className={`absolute -top-2.5 -left-2.5 size-8 rounded-xl flex items-center justify-center text-[12px] font-black border-2 border-white text-white shadow-xl z-10 ${isTop3 ? rankStyles[idx].bg : 'bg-secondary'}`}>
                       {idx + 1}
                     </div>
                   </div>
                   <div className="flex flex-col min-w-0">
                     <h4 className="text-[15px] font-black text-secondary uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors truncate">{player.name}</h4>
                     <div className="flex items-center gap-2 mt-2">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{player.position}</span>
                       <div className="size-1 bg-slate-200 rounded-full"></div>
                       <span className="text-[8px] font-black text-primary uppercase tracking-widest italic">{player.rating} OVR</span>
                     </div>
                   </div>
                </div>
                <div className="text-right pl-4">
                   <p className="text-3xl font-black italic tracking-tighter leading-none text-secondary group-hover:scale-110 transition-transform">{player.goals}</p>
                   <p className="text-[7px] font-black text-slate-300 uppercase tracking-[0.3em] mt-1">Gols</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ScoutScreen;
