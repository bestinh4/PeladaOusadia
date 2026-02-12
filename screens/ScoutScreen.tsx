
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
  const CROATIA_LOGO = "https://upload.wikimedia.org/wikipedia/pt/c/cf/Croatia_football_federation.png";

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
             <img src={CROATIA_LOGO} alt="HNS" className="size-10 object-contain mb-1" />
             <p className="text-[7px] font-black text-white/40 uppercase tracking-[0.2em]">Elite Ranking</p>
           </div>
           <div className="size-11"></div>
        </div>

        <div className="relative z-10 text-center animate-slide-up">
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none mb-3 leading-tight">Ranking <span className="text-primary">Geral</span></h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Hall of Fame Croata</p>
        </div>
      </header>

      <div className="flex gap-3 px-6 py-4 overflow-x-auto no-scrollbar bg-background/80 backdrop-blur-xl sticky top-[184px] z-30 border-b border-slate-100 shadow-sm">
        {filters.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 h-10 rounded-xl whitespace-nowrap text-[9px] font-black uppercase tracking-widest transition-all border ${
              filter === f ? 'bg-secondary text-white border-secondary shadow-lg' : 'bg-white text-slate-400 border-slate-100'
            }`}
          >
            {f === 'Goalkeeper' ? 'Goleiros' : f === 'Defender' ? 'Defesa' : f === 'Midfielder' ? 'Meio' : f === 'Forward' ? 'Ataque' : 'Todos'}
          </button>
        ))}
      </div>

      <div className="px-6 py-8 space-y-4">
        {filteredPlayers.map((player, idx) => {
          const isTop3 = idx < 3;
          return (
            <div 
              key={player.id}
              onClick={() => onNavigate('profile', player)}
              className={`flex items-center justify-between p-5 bg-white rounded-[2rem] border transition-all duration-300 group cursor-pointer animate-slide-up pro-shadow active:scale-[0.98] ${isTop3 ? 'border-primary border-2 shadow-primary/5' : 'border-slate-100'}`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex items-center gap-4">
                 <div className="relative shrink-0">
                   <img src={player.avatar} className="size-16 rounded-[1.2rem] border-2 border-slate-50 object-cover" alt={player.name} />
                   <div className={`absolute -top-2 -left-2 size-8 rounded-xl flex items-center justify-center text-[12px] font-black border-2 border-white text-white shadow-xl z-10 ${isTop3 ? 'bg-primary' : 'bg-secondary'}`}>
                     {idx + 1}
                   </div>
                 </div>
                 <div className="flex flex-col min-w-0">
                   <h4 className="text-[16px] font-black text-secondary uppercase italic tracking-tighter truncate mb-1 leading-none">{player.name}</h4>
                   <div className="flex items-center gap-2">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{player.position}</span>
                     <div className="size-1 bg-slate-100 rounded-full"></div>
                     <span className="text-[9px] font-black uppercase tracking-widest italic text-primary">{player.rating} OVR</span>
                   </div>
                 </div>
              </div>
              <div className="text-right pl-4 shrink-0">
                 <p className="text-4xl font-black italic tracking-tighter leading-none text-secondary">{player.goals}</p>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Gols</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScoutScreen;
