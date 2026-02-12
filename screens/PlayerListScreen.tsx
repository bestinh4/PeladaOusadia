
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
      <header className="flex items-center justify-between px-6 py-6 bg-white sticky top-0 z-30 border-b border-gray-100 shadow-sm">
        <div className="flex flex-col animate-fade-in-up">
          <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Matchday Registry</span>
          <div className="flex items-center gap-2 text-navy">
             <span className="material-symbols-outlined text-primary fill-current text-[20px]">sports_soccer</span>
             <h2 className="text-xl font-black italic tracking-tight">CONFIRMADOS</h2>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="size-10 rounded-full bg-surface-gray border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary transition-colors active:scale-90">
             <span className="material-symbols-outlined text-[22px]">search</span>
           </button>
           <button className="size-10 rounded-full bg-surface-gray border border-gray-100 flex items-center justify-center text-gray-400 hover:text-navy transition-colors active:scale-90">
             <span className="material-symbols-outlined text-[22px]">tune</span>
           </button>
        </div>
      </header>

      {/* Main Stats Action Section */}
      <div className="px-6 py-8 bg-white border-b border-gray-50 space-y-7 shadow-sm animate-fade-in-up">
        <button className="w-full h-15 bg-navy text-white rounded-[1.2rem] flex items-center justify-center gap-3 font-black uppercase tracking-widest shadow-xl shadow-navy/20 active:scale-95 transition-all overflow-hidden relative group">
          <div className="absolute inset-0 premium-shimmer opacity-10 group-hover:opacity-25 transition-opacity"></div>
          <span className="material-symbols-outlined">shuffle</span>
          DRAW TEAMS
        </button>

        <div className="space-y-4">
          <div className="flex justify-between items-end px-1">
             <div className="flex flex-col">
                <span className="text-[18px] font-black text-navy">{confirmedCount}</span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Confirmed</span>
             </div>
             <div className="text-right">
                <span className="text-xs font-black text-navy">{Math.round((confirmedCount / players.length) * 100)}%</span>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Availability</p>
             </div>
          </div>
          <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-0.5">
             <div 
              className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(237,29,35,0.3)]" 
              style={{ width: `${(confirmedCount / players.length) * 100}%` }}
             ></div>
          </div>
        </div>
      </div>

      {/* Players List */}
      <div className="px-6 py-6 space-y-3">
        {players.map((player, idx) => (
          <div 
            key={player.id}
            onClick={() => onNavigate('profile', player)}
            className={`flex items-center gap-4 p-4 bg-white rounded-[1.5rem] shadow-sm border border-white transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group animate-fade-in-up`}
            style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
          >
            <div className="relative shrink-0">
               <div className="size-14 rounded-2xl overflow-hidden border-2 border-gray-50 shadow-inner group-hover:border-primary/20 transition-colors">
                  <img src={player.avatar} className="w-full h-full object-cover" />
               </div>
               {player.number && (
                 <div className={`absolute -bottom-1.5 -right-1.5 size-6 rounded-lg flex items-center justify-center text-[10px] font-black border-2 border-white text-white shadow-md ${idxToColor(parseInt(player.id))}`}>
                   {player.number}
                 </div>
               )}
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2">
                 <h4 className={`text-[15px] font-black tracking-tight truncate ${player.confirmed ? 'text-navy uppercase italic' : 'text-gray-400 font-bold italic'}`}>
                  {player.name}
                 </h4>
                 {player.confirmed && (
                   <div className="size-1.5 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                 )}
               </div>
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                 {player.position} <span className="mx-1 text-gray-200">•</span> {player.level}
               </p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleConfirm(player.id);
              }}
              className={`size-7 rounded-xl flex items-center justify-center transition-all duration-300 ${
                player.confirmed 
                  ? 'bg-primary text-white shadow-[0_5px_15px_rgba(237,29,35,0.3)] scale-110' 
                  : 'bg-gray-50 border border-gray-100 text-transparent hover:border-primary/30'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] font-bold">check</span>
            </button>
          </div>
        ))}
      </div>
      
      {/* Floating Action Button */}
      <button className="fixed bottom-28 right-6 size-14 bg-navy text-white rounded-[1.4rem] flex items-center justify-center shadow-[0_15px_30px_rgba(9,18,44,0.3)] border-2 border-white active:scale-90 transition-all hover:bg-primary group overflow-hidden">
         <div className="absolute inset-0 premium-shimmer opacity-20"></div>
         <span className="material-symbols-outlined text-[28px] relative z-10">person_add</span>
      </button>
    </div>
  );
};

const idxToColor = (idx: number) => {
  const colors = ['bg-primary', 'bg-secondary', 'bg-navy', 'bg-green-600', 'bg-orange-500'];
  return colors[idx % colors.length];
};

export default PlayerListScreen;
