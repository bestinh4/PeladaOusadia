
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
    <div className="h-full bg-background overflow-y-auto no-scrollbar pb-36">
      <header className="px-10 pt-16 pb-20 bg-secondary relative overflow-hidden sticky top-0 z-40">
        <div className="absolute inset-0 opacity-[0.08] kockasti-pattern pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/95"></div>
        
        <div className="flex items-center justify-between mb-12 relative z-10">
           <button onClick={() => onNavigate('home')} className="size-14 bg-white/5 backdrop-blur-2xl rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all border border-white/10">
             <span className="material-symbols-outlined text-[30px]">chevron_left</span>
           </button>
           <div className="flex flex-col items-center">
             <img src={CROATIA_LOGO} alt="HNS" className="size-12 object-contain mb-2" />
             <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">Elite Ranking</p>
           </div>
           <div className="size-14"></div>
        </div>

        <div className="relative z-10 text-center animate-slide-up">
          <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase leading-none mb-4">Ranking <span className="text-primary">Geral</span></h1>
          <p className="text-white/40 text-[12px] font-black uppercase tracking-[0.4em]">Hall of Fame Croata</p>
        </div>
      </header>

      <div className="flex gap-4 px-8 py-8 overflow-x-auto no-scrollbar bg-background/90 backdrop-blur-2xl sticky top-[236px] z-30 border-b border-slate-100 shadow-sm">
        {filters.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-10 h-14 rounded-2xl whitespace-nowrap text-[11px] font-black uppercase tracking-widest transition-all border ${
              filter === f ? 'bg-secondary text-white border-secondary shadow-2xl shadow-secondary/20' : 'bg-white text-slate-400 border-slate-100'
            }`}
          >
            {f === 'Goalkeeper' ? 'Goleiros' : f === 'Defender' ? 'Defesa' : f === 'Midfielder' ? 'Meio' : f === 'Forward' ? 'Ataque' : 'Todos'}
          </button>
        ))}
      </div>

      <div className="px-8 py-12 space-y-6">
        {filteredPlayers.map((player, idx) => {
          const isTop3 = idx < 3;
          return (
            <div 
              key={player.id}
              onClick={() => onNavigate('profile', player)}
              className={`flex items-center justify-between p-7 bg-white rounded-[3.5rem] border transition-all duration-300 group cursor-pointer animate-slide-up pro-shadow active:scale-[0.98] ${isTop3 ? 'border-primary border-4 shadow-primary/10' : 'border-slate-100'}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center gap-7">
                 <div className="relative shrink-0">
                   <img src={player.avatar} className="size-24 rounded-[2.2rem] border-4 border-slate-50 object-cover shadow-md" alt={player.name} />
                   <div className={`absolute -top-4 -left-4 size-12 rounded-[1.2rem] flex items-center justify-center text-[18px] font-black border-4 border-white text-white shadow-2xl z-10 ${isTop3 ? 'bg-primary' : 'bg-secondary'}`}>
                     {idx + 1}
                   </div>
                 </div>
                 <div className="flex flex-col min-w-0">
                   <h4 className="text-[20px] font-black text-secondary uppercase italic tracking-tighter truncate mb-3">{player.name}</h4>
                   <div className="flex items-center gap-3.5">
                     <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{player.position}</span>
                     <div className="size-2 bg-slate-100 rounded-full"></div>
                     <span className="text-[11px] font-black uppercase tracking-widest italic text-primary">{player.rating} OVR</span>
                   </div>
                 </div>
              </div>
              <div className="text-right pl-8 shrink-0">
                 <p className="text-5xl font-black italic tracking-tighter leading-none text-secondary">{player.goals}</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Gols</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScoutScreen;
