
import React, { useState } from 'react';
import { Player, Screen } from '../types';

interface ScoutScreenProps {
  players: Player[];
  onNavigate: (screen: Screen, data?: any) => void;
}

const ScoutScreen: React.FC<ScoutScreenProps> = ({ players, onNavigate }) => {
  const [filter, setFilter] = useState('All Positions');
  
  const sortedPlayers = [...players].sort((a, b) => b.goals - a.goals);
  const filteredPlayers = filter === 'All Positions' 
    ? sortedPlayers 
    : sortedPlayers.filter(p => p.position === filter.slice(0, -1));

  const filters = ['All Positions', 'Forwards', 'Midfielders', 'Defenders'];

  return (
    <div className="h-full bg-background overflow-y-auto no-scrollbar pb-32">
      {/* Header */}
      <header className="px-6 pt-10 pb-6 bg-secondary relative overflow-hidden sticky top-0 z-30 shadow-xl">
        {/* Subtle checkerboard overlay */}
        <div className="absolute inset-0 opacity-10 checkerboard-pattern pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-8 relative z-10 animate-fade-in">
           <button onClick={() => onNavigate('home')} className="size-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all">
             <span className="material-symbols-outlined">chevron_left</span>
           </button>
           <h2 className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase italic">Vatreni Scouting</h2>
           <button className="size-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white relative active:scale-90 transition-all hover:bg-white/20">
             <span className="material-symbols-outlined text-[22px] interactive-icon">leaderboard</span>
             <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border border-white animate-pulse shadow-lg"></span>
           </button>
        </div>

        <div className="relative z-10 animate-fade-in">
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">Scout <span className="text-primary drop-shadow-md">Hall</span></h1>
          <div className="flex items-center gap-3 mt-4">
             <div className="h-0.5 w-12 bg-primary rounded-full"></div>
             <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.3em]">Temporada 2024</p>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-3 px-6 py-6 overflow-x-auto no-scrollbar bg-white/90 backdrop-blur-md sticky top-[164px] z-20 border-b border-slate-100 shadow-sm">
        {filters.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 h-11 rounded-2xl whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
              filter === f 
                ? 'bg-primary text-white shadow-lg border-primary scale-105' 
                : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100 hover:text-secondary'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Ranking List */}
      <div className="px-6 py-8 space-y-4">
        {filteredPlayers.map((player, idx) => {
          const isTop3 = idx < 3;
          const metalBorder = idx === 0 ? 'border-amber-400' : idx === 1 ? 'border-slate-300' : idx === 2 ? 'border-orange-300' : 'border-slate-100';
          
          return (
            <div 
              key={player.id}
              onClick={() => onNavigate('profile', player)}
              className={`flex items-center justify-between p-5 bg-white rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.03] group cursor-pointer animate-slide-up shadow-sm hover:shadow-md ${metalBorder} hover:border-primary`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center gap-5">
                 <div className="relative shrink-0">
                   <div className="size-16 rounded-[1.8rem] overflow-hidden border-2 border-slate-50 p-1 group-hover:border-primary transition-all duration-500 bg-slate-100">
                      <img src={player.avatar} className="w-full h-full object-cover rounded-[1.4rem] group-hover:scale-110 transition-transform duration-700" />
                   </div>
                   <div className={`absolute -top-2 -left-2 size-8 rounded-xl flex items-center justify-center text-[13px] font-black border-2 border-white text-white shadow-lg transition-all group-hover:rotate-12 group-hover:scale-110 ${idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-orange-400' : 'bg-secondary'}`}>
                     {idx + 1}
                   </div>
                 </div>
                 <div className="flex flex-col">
                   <h4 className="text-[17px] font-black text-secondary uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">{player.name}</h4>
                   <div className="flex items-center gap-2 mt-2">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{player.position}</p>
                     <span className="size-1 bg-slate-100 rounded-full group-hover:bg-primary transition-colors"></span>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic">{player.club}</p>
                   </div>
                 </div>
              </div>
              <div className="text-right pr-2">
                 <p className={`text-4xl font-black italic tracking-tighter leading-none transition-all group-hover:scale-110 ${idx === 0 ? 'text-amber-500' : 'text-primary'}`}>{player.goals}</p>
                 <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] mt-2">GOLS</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScoutScreen;
