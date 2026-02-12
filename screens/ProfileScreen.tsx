
import React from 'react';
import { Player, Screen } from '../types';

interface ProfileScreenProps {
  player: Player;
  players: Player[];
  onNavigate: (screen: Screen, data?: any) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ player, players, onNavigate }) => {
  // Find similar players based on position, excluding the current player
  const similarPlayers = players
    .filter((p) => p.id !== player.id && p.position === player.position)
    .slice(0, 5);

  return (
    <div className="h-full bg-surface-gray overflow-y-auto no-scrollbar pb-32">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 bg-white sticky top-0 z-10 shadow-sm">
        <button onClick={() => onNavigate('players')} className="text-[#1a0a0b]">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-black italic tracking-tight text-[#1a0a0b]">Athlete Profile</h2>
        <button className="text-[#1a0a0b]">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      {/* Hero Section - FUT CARD */}
      <div className="p-5 flex justify-center">
        <div className="w-full aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl relative croatia-pattern group animate-pulse-soft">
           {/* Card Overlays */}
           <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent"></div>
           
           {/* Top Stats */}
           <div className="absolute top-8 left-8 flex flex-col items-center gap-1 z-10">
              <span className="text-white text-5xl font-black italic leading-none drop-shadow-lg tracking-tighter">{player.rating}</span>
              <span className="text-primary text-xl font-black italic tracking-wider drop-shadow-md">MC</span>
              <div className="w-10 h-0.5 bg-primary/40 my-2"></div>
              <span className="material-symbols-outlined text-white/80">flag</span>
              <span className="material-symbols-outlined text-white/80">sports_soccer</span>
           </div>

           {/* Player Image Simulation */}
           <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full h-full flex items-end justify-center pointer-events-none">
              <img 
                src={player.avatar} 
                className="w-[120%] h-[80%] object-cover object-top mask-image-gradient grayscale-[0.2] contrast-[1.1]" 
                style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }} 
              />
           </div>

           {/* Name Banner */}
           <div className="absolute bottom-0 w-full p-8 flex flex-col items-center bg-gradient-to-t from-navy to-transparent pt-20">
              <h1 className="text-white text-3xl font-black italic uppercase tracking-tighter text-center drop-shadow-xl">{player.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{player.club || 'Free Agent'}</span>
                 <div className="size-1 bg-primary rounded-full"></div>
                 <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Croatia</span>
              </div>
           </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="px-6 space-y-4">
        <div className="flex items-center justify-between">
           <h3 className="text-lg font-black italic text-[#1a0a0b]">Season Stats</h3>
           <span className="bg-primary/5 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">2023-24</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
           {(Object.entries(player.stats) as [string, number][]).map(([key, val]) => {
             const isHigh = val > 80;
             return (
               <div 
                key={key} 
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border shadow-sm transition-all hover:scale-105 ${
                  isHigh ? 'border-l-4 border-primary bg-white' : 'border-gray-50 bg-white'
                }`}
               >
                 <span className={`text-xl font-black ${isHigh ? 'text-primary' : 'text-[#1a0a0b]'}`}>{val}</span>
                 <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isHigh ? 'text-primary/60' : 'text-gray-300'}`}>{key}</span>
               </div>
             );
           })}
        </div>
      </div>

      {/* Similar Players Section */}
      {similarPlayers.length > 0 && (
        <div className="px-6 mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black italic text-[#1a0a0b]">Similar Players</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Suggested</span>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {similarPlayers.map((similar) => (
              <div
                key={similar.id}
                onClick={() => onNavigate('profile', similar)}
                className="flex-shrink-0 w-32 bg-white p-3 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center gap-2 hover:border-primary/20 transition-all cursor-pointer"
              >
                <img
                  src={similar.avatar}
                  className="size-14 rounded-full object-cover border-2 border-primary/10"
                  alt={similar.name}
                />
                <div className="text-center">
                  <p className="text-[11px] font-black text-[#1a0a0b] uppercase truncate w-24">
                    {similar.name.split(' ').pop()}
                  </p>
                  <p className="text-[9px] font-bold text-primary mt-1">
                    {similar.rating} OVR
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fan Rating Section */}
      <div className="px-6 mt-8 space-y-4">
        <h3 className="text-lg font-black italic text-[#1a0a0b]">Fan Rating & Form</h3>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 space-y-6">
           <div className="flex justify-between items-center">
              <div className="flex flex-col">
                 <span className="text-4xl font-black text-[#1a0a0b] italic">4.8</span>
                 <span className="text-[10px] font-bold text-gray-300 uppercase">120 Votes</span>
              </div>
              <div className="flex gap-1 text-primary">
                 {[1,2,3,4].map(i => <span key={i} className="material-symbols-outlined fill-current">star</span>)}
                 <span className="material-symbols-outlined">star_half</span>
              </div>
           </div>
           
           <div className="w-full h-px bg-gray-50"></div>

           <div className="space-y-3">
              {[77, 15, 5].map((w, i) => (
                <div key={i} className="flex items-center gap-4">
                   <span className="text-[10px] font-bold text-gray-300 w-3">{5 - i}</span>
                   <div className="flex-1 h-1.5 bg-gray-50 rounded-full overflow-hidden">
                      <div className={`h-full bg-primary rounded-full transition-all duration-1000`} style={{ width: `${w}%`, opacity: 1 - (i * 0.2) }}></div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
