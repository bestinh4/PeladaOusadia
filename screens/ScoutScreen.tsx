
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
    <div className="h-full bg-surface-gray overflow-y-auto no-scrollbar pb-32">
      {/* Dynamic Header */}
      <header className="px-6 pt-10 pb-6 bg-navy relative overflow-hidden sticky top-0 z-30 shadow-xl">
        <div className="absolute inset-0 opacity-[0.05] croatia-pattern scale-150 rotate-12"></div>
        
        <div className="flex items-center justify-between mb-8 relative z-10">
           <button onClick={() => onNavigate('home')} className="size-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white active:scale-90 transition-transform">
             <span className="material-symbols-outlined">chevron_left</span>
           </button>
           <h2 className="text-xs font-black tracking-[0.3em] text-white/40 uppercase italic">Elite Scouting</h2>
           <button className="size-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white relative active:scale-90 transition-transform">
             <span className="material-symbols-outlined text-[20px]">leaderboard</span>
             <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border border-navy animate-pulse"></span>
           </button>
        </div>

        <div className="relative z-10 animate-fade-in-up">
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">Scout <span className="text-primary">Hall</span></h1>
          <div className="flex items-center gap-3 mt-3">
             <div className="h-0.5 w-10 bg-primary shadow-[0_0_10px_rgba(237,29,35,0.8)]"></div>
             <p className="text-primary text-[9px] font-black uppercase tracking-[0.2em]">Season 2024/25 Records</p>
          </div>
        </div>
      </header>

      {/* Filter Tabs - Premium Styling */}
      <div className="flex gap-3 px-6 py-6 overflow-x-auto no-scrollbar bg-white shadow-sm sticky top-[164px] z-20 border-b border-gray-100">
        {filters.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 h-11 rounded-xl whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
              filter === f 
                ? 'bg-navy text-white shadow-lg shadow-navy/20 border-navy' 
                : 'bg-surface-gray text-gray-400 border-gray-100 hover:border-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Ranking List - Prestigious Design */}
      <div className="px-6 py-8 space-y-4">
        {filteredPlayers.map((player, idx) => {
          const isTop3 = idx < 3;
          const metalColor = idx === 0 ? 'border-amber-400' : idx === 1 ? 'border-slate-300' : idx === 2 ? 'border-orange-300' : 'border-white';
          
          return (
            <div 
              key={player.id}
              onClick={() => onNavigate('profile', player)}
              className={`flex items-center justify-between p-4 bg-white rounded-[2rem] shadow-[0_4px_15px_rgba(0,0,0,0.02)] border-2 transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer group animate-fade-in-up ${metalColor}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center gap-5">
                 <div className="relative shrink-0">
                   <div className="size-16 rounded-[1.4rem] overflow-hidden border-2 border-gray-50 p-0.5 group-hover:border-primary/20 transition-all">
                      <img src={player.avatar} className="w-full h-full object-cover rounded-[1.2rem]" />
                   </div>
                   <div className={`absolute -top-2 -left-2 size-8 rounded-xl flex items-center justify-center text-[12px] font-black border-2 border-white text-white shadow-lg transition-transform group-hover:scale-110 ${idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-slate-300' : idx === 2 ? 'bg-orange-300' : 'bg-navy'}`}>
                     {idx + 1}
                   </div>
                 </div>
                 <div className="flex flex-col">
                   <h4 className="text-[15px] font-black text-navy uppercase italic tracking-tight leading-none">{player.name}</h4>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                     {player.position} 
                     <span className="size-1 bg-gray-200 rounded-full"></span>
                     {player.club}
                   </p>
                 </div>
              </div>
              <div className="text-right pr-2">
                 <p className={`text-3xl font-black italic tracking-tighter leading-none ${idx === 0 ? 'text-amber-500' : 'text-navy'}`}>{player.goals}</p>
                 <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-1">Goals Scored</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScoutScreen;
