
import React, { useRef } from 'react';
import { Player, Screen } from '../types';

interface ProfileScreenProps {
  player: Player;
  players: Player[];
  onNavigate: (screen: Screen, data?: any) => void;
  onUpdateAvatar: (id: string, file: File | string) => Promise<void>;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ player, onNavigate, onUpdateAvatar }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUpdateAvatar(player.id, file);
    }
  };

  // Convert rating to a 0-5 scale for display
  const displayRating = (player.rating / 20).toFixed(1);

  return (
    <div className="h-full bg-background flex flex-col relative">
      <header className="flex items-center justify-between px-6 py-6 sticky top-0 bg-white/90 backdrop-blur-md z-30 border-b border-slate-100 shrink-0">
        <button onClick={() => onNavigate('home')} className="size-10 bg-slate-50 text-secondary rounded-xl flex items-center justify-center active:scale-90 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-black text-secondary italic uppercase tracking-tighter">Ficha Técnica</h2>
        <div className="size-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
        <div className="flex flex-col items-center pt-8 mb-8 bg-white pb-12 rounded-b-[4rem] shadow-sm border-b border-slate-100 relative">
          <div className="absolute inset-0 opacity-[0.03] checkerboard-pattern pointer-events-none rounded-b-[4rem]"></div>
          
          <div className="relative mb-6 group cursor-pointer" onClick={handleAvatarClick}>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            <div className="size-36 rounded-full border-4 border-slate-100 p-1.5 shadow-xl relative transition-transform group-hover:scale-105 active:scale-95 bg-white">
               <img src={player.avatar} className="size-full rounded-full object-cover relative z-10" />
               <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                 <span className="material-symbols-outlined text-white">photo_camera</span>
               </div>
            </div>
            {player.rating > 80 && (
              <div className="absolute bottom-1 right-1 size-10 bg-secondary rounded-full border-4 border-white flex items-center justify-center shadow-lg z-30">
                <span className="material-symbols-outlined text-white text-[18px] font-bold">verified</span>
              </div>
            )}
          </div>
          
          <h1 className="text-3xl font-black text-secondary uppercase italic tracking-tighter mb-1 relative z-10">{player.name}</h1>
          <div className="flex items-center gap-3 relative z-10">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">{player.position}</span>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Rank: {player.level || 'Atleta'}</span>
          </div>
        </div>

        {/* Real Stats from Database */}
        <div className="px-6 grid grid-cols-3 gap-4 mb-10 -mt-12 relative z-20">
          {[
            { val: player.goals || 0, label: 'Gols', color: 'bg-primary shadow-primary/20' },
            { val: player.assists || 0, label: 'Assists', color: 'bg-secondary shadow-secondary/20' },
            { val: player.matches || 0, label: 'Partidas', color: 'bg-white border border-slate-100' }
          ].map(s => (
            <div key={s.label} className={`rounded-[2.5rem] p-6 flex flex-col items-center justify-center shadow-lg ${s.color}`}>
              <span className={`text-3xl font-black mb-1 ${s.color.includes('white') ? 'text-secondary' : 'text-white'}`}>{s.val}</span>
              <span className={`text-[9px] font-black uppercase tracking-widest ${s.color.includes('white') ? 'text-slate-400' : 'text-white/60'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="px-6 mb-10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-secondary italic">Atributos</h3>
            <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <span className="text-[10px] font-black text-amber-600">{displayRating}</span>
              <span className="material-symbols-outlined text-amber-500 text-[14px]">star</span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
            {[
              { label: 'Ritmo', val: player.stats.pac, icon: 'bolt', color: 'bg-primary' },
              { label: 'Finalização', val: player.stats.sho, icon: 'sports_soccer', color: 'bg-secondary' },
              { label: 'Passe', val: player.stats.pas, icon: 'swap_calls', color: 'bg-success' }
            ].map(skill => (
              <div key={skill.label} className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-lg ${skill.color} flex items-center justify-center text-white shadow-lg`}>
                      <span className="material-symbols-outlined text-[18px]">{skill.icon}</span>
                    </div>
                    <span className="text-sm font-black text-secondary uppercase">{skill.label}</span>
                  </div>
                  <span className="text-sm font-black text-secondary italic">{skill.val}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
                  <div className={`h-full ${skill.color} rounded-full transition-all duration-1000`} style={{ width: `${skill.val}%` }}></div>
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
