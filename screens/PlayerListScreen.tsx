
import React from 'react';
import { Player, Screen } from '../types';

interface PlayerListScreenProps {
  players: Player[];
  onToggleConfirm: (id: string) => void;
  onNavigate: (screen: Screen, data?: any) => void;
}

const PlayerListScreen: React.FC<PlayerListScreenProps> = ({ players, onToggleConfirm, onNavigate }) => {
  const confirmedCount = players.filter(p => p.confirmed).length;

  return (
    <div className="h-full bg-surface-gray overflow-y-auto no-scrollbar pb-32">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 bg-white sticky top-0 z-20 border-b border-gray-50">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">O&A ELITE PRO</span>
          <div className="flex items-center gap-2 text-[#1a0a0b]">
             <span className="material-symbols-outlined text-primary fill-current">sports_soccer</span>
             <h2 className="text-xl font-black italic">CHEGA+</h2>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="size-10 rounded-full bg-surface-gray flex items-center justify-center text-gray-500">
             <span className="material-symbols-outlined text-[20px]">notifications</span>
           </button>
           <button className="size-10 rounded-full bg-surface-gray flex items-center justify-center text-gray-500">
             <span className="material-symbols-outlined text-[20px]">menu</span>
           </button>
        </div>
      </header>

      {/* Main Action Section */}
      <div className="px-6 py-8 bg-white space-y-6">
        <button className="w-full h-14 bg-secondary text-white rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest shadow-xl shadow-secondary/20 active:scale-95 transition-all">
          <span className="material-symbols-outlined">groups</span>
          Sortear Times
        </button>

        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
             <span>{confirmedCount} confirmed</span>
             <span>{players.length} total</span>
          </div>
          <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
             <div 
              className="h-full bg-primary transition-all duration-500" 
              style={{ width: `${(confirmedCount / players.length) * 100}%` }}
             ></div>
          </div>
        </div>
      </div>

      {/* Players List */}
      <div className="px-6 py-6 space-y-3">
        {players.map((player) => (
          <div 
            key={player.id}
            onClick={() => onNavigate('profile', player)}
            className={`flex items-center gap-4 p-3 bg-white rounded-2xl shadow-sm border-l-4 transition-all hover:shadow-md cursor-pointer ${
              player.confirmed ? 'border-primary' : 'border-transparent opacity-60'
            }`}
          >
            <div className="relative shrink-0">
               <img src={player.avatar} className="size-12 rounded-full object-cover border border-gray-100" />
               {player.number && (
                 <div className={`absolute -bottom-1 -right-1 size-5 rounded-full flex items-center justify-center text-[8px] font-black border-2 border-white text-white ${idxToColor(parseInt(player.id))}`}>
                   {player.number}
                 </div>
               )}
            </div>
            <div className="flex-1 min-w-0">
               <h4 className={`text-base font-bold truncate ${player.confirmed ? 'text-[#1a0a0b]' : 'text-gray-400 font-medium'}`}>
                {player.name}
               </h4>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                 {player.position} {player.level && `• ${player.level}`}
               </p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleConfirm(player.id);
              }}
              className={`size-6 rounded-full flex items-center justify-center transition-all ${
                player.confirmed 
                  ? 'bg-primary text-white' 
                  : 'border-2 border-gray-100 text-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
            </button>
          </div>
        ))}
      </div>
      
      {/* FAB Placeholder */}
      <button className="fixed bottom-28 right-6 size-12 bg-white rounded-full flex items-center justify-center text-primary shadow-xl border border-gray-50 active:scale-90 transition-transform">
         <span className="material-symbols-outlined">person_add</span>
      </button>
    </div>
  );
};

const idxToColor = (idx: number) => {
  const colors = ['bg-primary', 'bg-secondary', 'bg-[#1a0a0b]', 'bg-green-600', 'bg-orange-500'];
  return colors[idx % colors.length];
};

export default PlayerListScreen;
