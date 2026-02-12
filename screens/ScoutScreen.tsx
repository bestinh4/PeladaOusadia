
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
    <div className="h-full bg-slate-50 overflow-y-auto no-scrollbar pb-32">
      {/* High-Performance Header */}
      <header className="px-8 pt-12 pb-16 bg-secondary relative overflow-hidden sticky top-0 z-40">
        <div className="absolute inset-0 opacity-10 checker-bg pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/90"></div>
        
        <div className="flex items-center justify-between mb-10 relative z-10">
           <button onClick={() => onNavigate('home')} className="size-11 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all border border-white/10">
             <span className="material-symbols-outlined">chevron_left</span>
           </button>
           <div className="text-center">
             <h2 className="text-[10px] font-black tracking-[0.4em] text-primary uppercase italic leading-none mb-1">Vatreni</h2>
             <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">Scouting Dept.</p>
           </div>
           <div className="size-11"></div>
        </div>

        <div className="relative z-10 text-center animate-slide-up">
          <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none mb-3">Hall of <span className="text-primary">Fame</span></h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Season 2024 • Elite Rankings</p>
        </div>
      </header>

      {/* Modern Horizontal Navigation */}
      <div className="flex gap-3 px-6 py-6 overflow-x-auto no-scrollbar bg-slate-50/80 backdrop-blur-xl sticky top-[188px] z-30 border-b border-slate-100 shadow-sm">
        {filters.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-7 h-11 rounded-2xl whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
              filter === f 
                ? 'bg-secondary text-white border-secondary shadow-xl shadow-secondary/20' 
                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Prestige Ranking List */}
      <div className="px-6 py-10 space-y-5">
        {filteredPlayers.length === 0 ? (
          <div className="py-24 text-center text-slate-300 text-[11px] font-black uppercase tracking-widest italic animate-fade-in">Aguardando início dos jogos</div>
        ) : (
          filteredPlayers.map((player, idx) => {
            const isTop3 = idx < 3;
            const medalColors = ['from-gold/20 to-gold/40 border-gold/40', 'from-silver/20 to-silver/40 border-silver/40', 'from-bronze/20 to-bronze/40 border-bronze/40'];
            const medalText = ['text-gold', 'text-slate-500', 'text-bronze'];
            
            return (
              <div 
                key={player.id}
                onClick={() => onNavigate('profile', player)}
                className={`flex items-center justify-between p-5 bg-white rounded-[2.5rem] border transition-all duration-300 group cursor-pointer animate-slide-up pro-shadow active:scale-[0.98] ${isTop3 ? medalColors[idx] + ' border-2' : 'border-slate-100'}`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-center gap-5">
                   <div className="relative shrink-0">
                     <div className="size-20 rounded-[1.8rem] overflow-hidden border-4 border-slate-50 p-1 bg-slate-100 transition-all duration-300 group-hover:border-primary">
                        <img src={player.avatar} className="size-full object-cover rounded-[1.2rem]" alt={player.name} />
                     </div>
                     <div className={`absolute -top-3 -left-3 size-10 rounded-2xl flex items-center justify-center text-[14px] font-black border-4 border-white text-white shadow-2xl z-10 ${isTop3 ? (idx === 0 ? 'bg-gold' : idx === 1 ? 'bg-silver' : 'bg-bronze') : 'bg-secondary'}`}>
                       {idx + 1}
                     </div>
                   </div>
                   <div className="flex flex-col min-w-0">
                     <h4 className="text-[17px] font-black text-secondary uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors truncate mb-2">{player.name}</h4>
                     <div className="flex items-center gap-2.5">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{player.position}</span>
                       <div className="size-1.5 bg-slate-200 rounded-full"></div>
                       <span className={`text-[9px] font-black uppercase tracking-widest italic ${isTop3 ? medalText[idx] : 'text-primary'}`}>{player.rating} OVR</span>
                     </div>
                   </div>
                </div>
                <div className="text-right pl-6 shrink-0">
                   <p className="text-4xl font-black italic tracking-tighter leading-none text-secondary group-hover:scale-110 transition-transform">{player.goals}</p>
                   <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] mt-2">Gols</p>
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
