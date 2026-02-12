
import React, { useState } from 'react';
import { Player, Screen } from '../types';

interface ScoutScreenProps {
  players: Player[];
  onNavigate: (screen: Screen, data?: any) => void;
}

const ScoutScreen: React.FC<ScoutScreenProps> = ({ players, onNavigate }) => {
  const [filter, setFilter] = useState('Todos');
  const sortedPlayers = [...players].sort((a, b) => b.goals - a.goals);
  const filteredPlayers = filter === 'Todos' ? sortedPlayers : sortedPlayers.filter(p => p.position === filter);
  const filters = ['Todos', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'];
  const CROATIA_LOGO = "https://upload.wikimedia.org/wikipedia/en/d/d0/Croatian_Football_Federation_logo.svg";

  return (
    <div className="h-full bg-background overflow-y-auto no-scrollbar pb-32">
      <header className="px-8 pt-12 pb-16 bg-secondary relative overflow-hidden sticky top-0 z-40">
        <div className="absolute inset-0 opacity-[0.05] kockasti-pattern pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/90"></div>
        
        <div className="flex items-center justify-between mb-10 relative z-10">
           <button onClick={() => onNavigate('home')} className="size-11 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all border border-white/10">
             <span className="material-symbols-outlined">chevron_left</span>
           </button>
           <div className="flex flex-col items-center">
             <img src={CROATIA_LOGO} alt="HNS" className="size-8 object-contain mb-1" />
             <p className="text-[7px] font-black text-white/40 uppercase tracking-[0.2em]">Elite Ranking</p>
           </div>
           <div className="size-11"></div>
        </div>

        <div className="relative z-10 text-center animate-slide-up">
          <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none mb-3">Ranking <span className="text-primary">Geral</span></h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Hall of Fame Croata</p>
        </div>
      </header>

      <div className="flex gap-3 px-6 py-6 overflow-x-auto no-scrollbar bg-background/80 backdrop-blur-xl sticky top-[188px] z-30 border-b border-slate-100 shadow-sm">
        {filters.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-7 h-11 rounded-2xl whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all border ${
              filter === f ? 'bg-secondary text-white border-secondary shadow-xl shadow-secondary/20' : 'bg-white text-slate-400 border-slate-100'
            }`}
          >
            {f === 'Goalkeeper' ? 'Goleiros' : f === 'Defender' ? 'Defesa' : f === 'Midfielder' ? 'Meio' : f === 'Forward' ? 'Ataque' : 'Todos'}
          </button>
        ))}
      </div>

      <div className="px-6 py-10 space-y-5">
        {filteredPlayers.map((player, idx) => {
          const isTop3 = idx < 3;
          return (
            <div 
              key={player.id}
              onClick={() => onNavigate('profile', player)}
              className={`flex items-center justify-between p-5 bg-white rounded-[2.5rem] border transition-all duration-300 group cursor-pointer animate-slide-up pro-shadow active:scale-[0.98] ${isTop3 ? 'border-primary border-2 shadow-primary/5' : 'border-slate-100'}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center gap-5">
                 <div className="relative shrink-0">
                   <img src={player.avatar} className="size-20 rounded-[1.8rem] border-4 border-slate-50 object-cover" alt={player.name} />
                   <div className={`absolute -top-3 -left-3 size-10 rounded-2xl flex items-center justify-center text-[14px] font-black border-4 border-white text-white shadow-2xl z-10 ${isTop3 ? 'bg-primary' : 'bg-secondary'}`}>
                     {idx + 1}
                   </div>
                 </div>
                 <div className="flex flex-col min-w-0">
                   <h4 className="text-[17px] font-black text-secondary uppercase italic tracking-tighter truncate mb-2">{player.name}</h4>
                   <div className="flex items-center gap-2.5">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{player.position}</span>
                     <div className="size-1.5 bg-slate-100 rounded-full"></div>
                     <span className="text-[9px] font-black uppercase tracking-widest italic text-primary">{player.rating} OVR</span>
                   </div>
                 </div>
              </div>
              <div className="text-right pl-6 shrink-0">
                 <p className="text-4xl font-black italic tracking-tighter leading-none text-secondary">{player.goals}</p>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Gols</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScoutScreen;
