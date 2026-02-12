
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
    <div className="h-full bg-background overflow-y-auto no-scrollbar pb-48">
      <header className="px-12 pt-20 pb-24 bg-secondary relative overflow-hidden sticky top-0 z-40">
        <div className="absolute inset-0 opacity-[0.1] kockasti-pattern pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/95"></div>
        
        <div className="flex items-center justify-between mb-16 relative z-10">
           <button onClick={() => onNavigate('home')} className="size-18 bg-white/10 backdrop-blur-3xl rounded-[1.8rem] flex items-center justify-center text-white active:scale-90 transition-all border border-white/20">
             <span className="material-symbols-outlined text-[36px] font-bold">chevron_left</span>
           </button>
           <div className="flex flex-col items-center">
             <img src={CROATIA_LOGO} alt="HNS" className="size-16 object-contain mb-3 drop-shadow-xl" />
             <p className="text-[11px] font-black text-white/50 uppercase tracking-[0.5em]">Elite Ranking</p>
           </div>
           <div className="size-18"></div>
        </div>

        <div className="relative z-10 text-center animate-slide-up">
          <h1 className="text-7xl font-black italic tracking-tighter text-white uppercase leading-none mb-6">Ranking <span className="text-primary">Geral</span></h1>
          <p className="text-white/40 text-[14px] font-black uppercase tracking-[0.5em]">Hall of Fame Croata</p>
        </div>
      </header>

      <div className="flex gap-5 px-10 py-10 overflow-x-auto no-scrollbar bg-background/95 backdrop-blur-3xl sticky top-[284px] z-30 border-b border-slate-100 shadow-sm">
        {filters.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-12 h-18 rounded-[1.8rem] whitespace-nowrap text-[13px] font-black uppercase tracking-widest transition-all border ${
              filter === f ? 'bg-secondary text-white border-secondary shadow-[0_15px_40px_rgba(0,81,158,0.2)]' : 'bg-white text-slate-400 border-slate-100'
            }`}
          >
            {f === 'Goalkeeper' ? 'Goleiros' : f === 'Defender' ? 'Defesa' : f === 'Midfielder' ? 'Meio' : f === 'Forward' ? 'Ataque' : 'Todos'}
          </button>
        ))}
      </div>

      <div className="px-10 py-16 space-y-8">
        {filteredPlayers.map((player, idx) => {
          const isTop3 = idx < 3;
          return (
            <div 
              key={player.id}
              onClick={() => onNavigate('profile', player)}
              className={`flex items-center justify-between p-9 bg-white rounded-[4.5rem] border transition-all duration-300 group cursor-pointer animate-slide-up pro-shadow active:scale-[0.98] ${isTop3 ? 'border-primary border-[6px] shadow-[0_25px_60px_-15px_rgba(227,6,19,0.15)]' : 'border-slate-100'}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center gap-10">
                 <div className="relative shrink-0">
                   <img src={player.avatar} className="size-32 rounded-[2.8rem] border-[6px] border-slate-50 object-cover shadow-xl" alt={player.name} />
                   <div className={`absolute -top-5 -left-5 size-16 rounded-[1.5rem] flex items-center justify-center text-[22px] font-black border-[5px] border-white text-white shadow-2xl z-10 ${isTop3 ? 'bg-primary' : 'bg-secondary'}`}>
                     {idx + 1}
                   </div>
                 </div>
                 <div className="flex flex-col min-w-0">
                   <h4 className="text-[26px] font-black text-secondary uppercase italic tracking-tighter truncate mb-4 leading-none">{player.name}</h4>
                   <div className="flex items-center gap-4">
                     <span className="text-[13px] font-black text-slate-400 uppercase tracking-widest">{player.position}</span>
                     <div className="size-2.5 bg-slate-100 rounded-full"></div>
                     <span className="text-[13px] font-black uppercase tracking-widest italic text-primary">{player.rating} OVR</span>
                   </div>
                 </div>
              </div>
              <div className="text-right pl-10 shrink-0">
                 <p className="text-7xl font-black italic tracking-tighter leading-none text-secondary drop-shadow-sm">{player.goals}</p>
                 <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] mt-4">Gols</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScoutScreen;
