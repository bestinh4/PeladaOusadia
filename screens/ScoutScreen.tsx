
import React, { useState } from 'react';
import { Player, Screen } from '../types';

interface ScoutScreenProps {
  players: Player[];
  onNavigate: (screen: Screen, data?: any) => void;
}

const ScoutScreen: React.FC<ScoutScreenProps> = ({ players, onNavigate }) => {
  const [filter, setFilter] = useState('All Players');
  
  const sortedPlayers = [...players].sort((a, b) => b.goals - a.goals);
  const filteredPlayers = filter === 'All Players' 
    ? sortedPlayers 
    : sortedPlayers.filter(p => p.position === filter.slice(0, -1));

  const filters = ['All Players', 'Forwards', 'Midfielders'];

  return (
    <div className="h-full bg-surface-gray overflow-y-auto no-scrollbar pb-32">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 bg-surface-gray sticky top-0 z-10">
        <div className="flex items-center justify-between mb-8">
           <button onClick={() => onNavigate('home')} className="p-2 -ml-2 text-gray-900">
             <span className="material-symbols-outlined">arrow_back</span>
           </button>
           <h2 className="text-lg font-black tracking-tight text-gray-900 uppercase italic">O&A Elite Pro</h2>
           <button className="p-2 -mr-2 text-gray-900 relative">
             <span className="material-symbols-outlined">notifications</span>
             <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-surface-gray"></span>
           </button>
        </div>

        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-[#1a0a0b] uppercase">Scout Ranking</h1>
          <div className="flex items-center gap-2 mt-1">
             <div className="h-1.5 w-6 bg-primary rounded-full"></div>
             <p className="text-primary text-[10px] font-bold uppercase tracking-widest">Top Scorers Season 24/25</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-3 px-6 py-4 overflow-x-auto no-scrollbar">
        {filters.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 h-10 rounded-full whitespace-nowrap text-xs font-bold transition-all ${
              filter === f 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Ranking List */}
      <div className="px-6 py-2 space-y-3">
        {filteredPlayers.map((player, idx) => (
          <div 
            key={player.id}
            onClick={() => onNavigate('profile', player)}
            className="flex items-center justify-between p-3 bg-white rounded-[1.5rem] shadow-sm border border-gray-50 transition-all hover:border-primary/20 cursor-pointer"
          >
            <div className="flex items-center gap-4">
               <div className="relative">
                 <img src={player.avatar} className="size-14 rounded-full object-cover border-2 border-white shadow-md" />
                 <div className={`absolute -bottom-1 -right-1 size-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white text-white ${idx === 0 ? 'bg-primary' : 'bg-navy'}`}>
                   {idx + 1}
                 </div>
               </div>
               <div className="flex flex-col">
                 <h4 className="text-base font-bold text-[#1a0a0b] uppercase tracking-wide">{player.name}</h4>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{player.position} {player.club && `• ${player.club}`}</p>
               </div>
            </div>
            <div className="text-right pr-2">
               <p className="text-xl font-black text-primary leading-none">{player.goals}</p>
               <p className="text-[10px] font-bold text-gray-300 uppercase mt-1">Goals</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoutScreen;
