
import React, { useRef, useState } from 'react';
import { Player, Screen } from '../types';

interface ProfileScreenProps {
  player: Player;
  players: Player[];
  onNavigate: (screen: Screen, data?: any) => void;
  onUpdateAvatar: (id: string, avatarUrl: string) => Promise<void>;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ player, players, onNavigate, onUpdateAvatar }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const similarPlayers = players
    .filter((p) => p.id !== player.id && p.position === player.position)
    .slice(0, 5);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        await onUpdateAvatar(player.id, base64String);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-full bg-surface-gray overflow-y-auto no-scrollbar pb-32">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 bg-white sticky top-0 z-30 shadow-sm border-b border-gray-50">
        <button onClick={() => onNavigate('players')} className="size-10 bg-gray-50 rounded-xl flex items-center justify-center text-navy active:scale-90 transition-transform">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Athlete Registry</span>
          <h2 className="text-sm font-black italic tracking-tighter text-navy uppercase">Profile Details</h2>
        </div>
        <button className="size-10 bg-gray-50 rounded-xl flex items-center justify-center text-navy active:scale-90 transition-transform">
          <span className="material-symbols-outlined">share</span>
        </button>
      </header>

      {/* Hero Section - FUT CARD ELITE */}
      <div className="p-8 flex justify-center animate-fade-in-up">
        <div className="w-full max-w-[320px] aspect-[3/4.2] rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.25)] relative croatia-pattern group border-4 border-navy/20">
           {/* Card Overlays */}
           <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent"></div>
           <div className="absolute inset-0 premium-shimmer opacity-30"></div>
           
           {/* Top Stats - FUT Style */}
           <div className="absolute top-10 left-8 flex flex-col items-center gap-1 z-20">
              <span className="text-white text-6xl font-black italic leading-none drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] tracking-tighter">{player.rating}</span>
              <span className="text-primary text-xl font-black italic tracking-widest drop-shadow-md uppercase">PRO</span>
              <div className="w-12 h-0.5 bg-primary/60 my-3"></div>
              <span className="material-symbols-outlined text-white/60 text-[20px]">flag</span>
              <span className="material-symbols-outlined text-white/60 text-[20px] mt-1">shield</span>
           </div>

           {/* Edit Avatar Button */}
           <button 
             onClick={handleAvatarClick}
             disabled={isUploading}
             className="absolute top-8 right-8 z-30 size-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white/80 hover:bg-white/20 active:scale-90 transition-all border border-white/10 group/edit"
           >
              {isUploading ? (
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined text-[20px] group-hover/edit:text-primary transition-colors">photo_camera</span>
              )}
           </button>

           {/* Player Image with advanced masking */}
           <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-full h-full flex items-end justify-center pointer-events-none z-10">
              <img 
                src={player.avatar} 
                className={`w-[120%] h-[85%] object-cover object-top mask-image-gradient brightness-[1.1] contrast-[1.05] transition-opacity duration-500 ${isUploading ? 'opacity-50' : 'opacity-100'}`} 
              />
           </div>

           {/* Name Banner - Glassmorphic */}
           <div className="absolute bottom-0 w-full p-8 flex flex-col items-center bg-gradient-to-t from-navy to-transparent pt-32 z-20">
              <h1 className="text-white text-3xl font-black italic uppercase tracking-tighter text-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">{player.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                 <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">{player.club || 'Free Agent'}</span>
                 <div className="size-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(237,29,35,0.8)]"></div>
                 <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">CROATIA</span>
              </div>
           </div>
        </div>
      </div>

      {/* Statistics Section - Refined Grid */}
      <div className="px-6 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between px-1">
           <h3 className="text-xl font-black italic text-navy uppercase tracking-tighter">Season Stats</h3>
           <div className="flex items-center gap-2">
              <div className="size-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-primary/60 text-[9px] font-black px-3 py-1 bg-primary/5 rounded-full uppercase tracking-widest">Active Form</span>
           </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
           {(Object.entries(player.stats) as [string, number][]).map(([key, val], idx) => {
             const isHigh = val > 80;
             return (
               <div 
                key={key} 
                className={`flex flex-col items-center justify-center p-5 rounded-[1.8rem] border shadow-sm transition-all hover:scale-105 hover:shadow-md animate-fade-in-up ${
                  isHigh ? 'border-primary/20 bg-white' : 'border-gray-50 bg-white'
                }`}
                style={{ animationDelay: `${0.2 + idx * 0.05}s` }}
               >
                 <span className={`text-2xl font-black tracking-tighter ${isHigh ? 'text-primary' : 'text-navy'}`}>{val}</span>
                 <span className={`text-[9px] font-black uppercase tracking-widest mt-1.5 ${isHigh ? 'text-primary/60' : 'text-gray-300'}`}>{key}</span>
               </div>
             );
           })}
        </div>
      </div>

      {/* Similar Players - Premium Scroll */}
      {similarPlayers.length > 0 && (
        <div className="px-6 mt-12 space-y-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-black italic text-navy uppercase tracking-tighter">Scout Matches</h3>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Recommended</span>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pt-1">
            {similarPlayers.map((similar) => (
              <div
                key={similar.id}
                onClick={() => onNavigate('profile', similar)}
                className="flex-shrink-0 w-36 bg-white p-4 rounded-[2rem] shadow-sm border border-white flex flex-col items-center gap-3 hover:border-primary/30 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="size-16 rounded-2xl overflow-hidden border-2 border-gray-50 shadow-inner p-0.5 group-hover:border-primary/20 transition-all">
                   <img src={similar.avatar} className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-black text-navy uppercase italic truncate w-28">
                    {similar.name.split(' ').pop()}
                  </p>
                  <p className="text-[9px] font-black text-primary mt-1 tracking-widest">
                    {similar.rating} OVR
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fan Rating Section - Polished Feedback */}
      <div className="px-6 mt-10 space-y-5 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-xl font-black italic text-navy uppercase tracking-tighter">Fan Performance Index</h3>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white space-y-8">
           <div className="flex justify-between items-center">
              <div className="flex flex-col">
                 <span className="text-5xl font-black text-navy italic tracking-tighter">4.8</span>
                 <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mt-1">Verified Votes</span>
              </div>
              <div className="flex gap-1 text-primary">
                 {[1,2,3,4].map(i => <span key={i} className="material-symbols-outlined fill-current text-[20px]">star</span>)}
                 <span className="material-symbols-outlined text-[20px]">star_half</span>
              </div>
           </div>
           
           <div className="w-full h-px bg-gray-50"></div>

           <div className="space-y-4">
              {[88, 12, 0].map((w, i) => (
                <div key={i} className="flex items-center gap-5">
                   <span className="text-[9px] font-black text-gray-300 w-4">{5 - i} ST</span>
                   <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden p-0.5">
                      <div className={`h-full bg-primary rounded-full transition-all duration-1000 ease-out`} style={{ width: `${w}%`, opacity: 1 - (i * 0.3) }}></div>
                   </div>
                   <span className="text-[9px] font-black text-navy w-6 text-right">{w}%</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
