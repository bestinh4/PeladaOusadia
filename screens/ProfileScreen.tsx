
import React, { useRef, useState, useEffect } from 'react';
import { Player, Screen } from '../types';
import { playerService } from '../services/playerService';

interface ProfileScreenProps {
  player: Player;
  players: Player[];
  currentPlayer: Player | null;
  onNavigate: (screen: Screen, data?: any) => void;
  onUpdateAvatar: (id: string, file: File | string) => Promise<void>;
  onLogout: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ player, currentPlayer, onNavigate, onUpdateAvatar, onLogout }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [editData, setEditData] = useState({
    name: player.name,
    position: player.position,
    club: player.club || '',
    number: player.number || 0,
    stats: { ...player.stats }
  });

  useEffect(() => {
    setImageLoaded(false);
  }, [player.avatar]);

  const isOwnProfile = currentPlayer?.id === player.id;
  const isAdmin = currentPlayer?.role === 'admin';

  const handleAvatarClick = () => {
    if (!isOwnProfile) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      setImageLoaded(false);
      try {
        await onUpdateAvatar(player.id, file);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const s = editData.stats;
      const overall = Math.round((s.pac + s.sho + s.pas + s.dri + s.def + s.phy) / 6);
      await playerService.updateProfile(player.id, { ...editData, rating: overall });
      setIsEditing(false);
    } catch (err: any) {
      alert("Erro ao salvar perfil: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const displayRating = (player.rating / 20).toFixed(1);

  return (
    <div className="h-full bg-background flex flex-col relative overflow-hidden">
      <header className="flex items-center justify-between px-8 py-10 sticky top-0 z-40 bg-white/90 backdrop-blur-2xl border-b border-slate-100">
        <button 
          onClick={() => onNavigate('home')} 
          className="size-14 bg-slate-50 text-secondary rounded-2xl flex items-center justify-center active:scale-90 transition-all border border-slate-100 shadow-sm"
        >
          <span className="material-symbols-outlined text-[30px]">arrow_back</span>
        </button>
        <div className="text-center">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mb-1 leading-none">O<span className="text-primary">&</span>A Manager</h2>
          <p className="text-lg font-black text-secondary italic uppercase tracking-tighter">Pro Identity</p>
        </div>
        <div className="flex items-center gap-3">
          {isOwnProfile && (
             <button 
                onClick={onLogout}
                className="size-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center active:scale-90 border border-slate-100"
              >
                <span className="material-symbols-outlined text-[28px]">logout</span>
              </button>
          )}
          {(isOwnProfile || isAdmin) ? (
            <button 
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              disabled={loading}
              className={`size-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-2xl ${
                isEditing ? 'bg-primary text-white' : 'bg-white border border-slate-100 text-secondary'
              }`}
            >
              {loading ? (
                <div className="size-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined text-[28px]">{isEditing ? 'done' : 'settings'}</span>
              )}
            </button>
          ) : <div className="size-14"></div>}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
        <div className="relative pt-16 pb-24 px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none"></div>
          
          <div className="flex flex-col items-center relative z-10">
            <div className={`relative mb-10 group ${isOwnProfile ? 'cursor-pointer' : ''}`} onClick={handleAvatarClick}>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              <div className="size-52 rounded-full border-[10px] border-white shadow-2xl relative transition-transform group-hover:scale-105 active:scale-95 bg-slate-100 overflow-hidden">
                 {!imageLoaded && (
                   <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
                     <span className="material-symbols-outlined text-slate-400 text-6xl">person</span>
                   </div>
                 )}
                 <img 
                   src={player.avatar} 
                   className={`size-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} 
                   alt={player.name}
                   loading="lazy"
                   onLoad={() => setImageLoaded(true)}
                 />
                 {isOwnProfile && (
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[3px]">
                      <span className="material-symbols-outlined text-4xl">photo_camera</span>
                    </div>
                 )}
              </div>
              <div className="absolute -bottom-3 -right-3 size-20 bg-secondary text-white rounded-[1.8rem] border-4 border-white flex flex-col items-center justify-center shadow-2xl rotate-6">
                 <span className="text-3xl font-black italic leading-none">{player.rating}</span>
                 <span className="text-[9px] font-black uppercase tracking-tighter opacity-50">OVR</span>
              </div>
            </div>
            
            {isEditing ? (
              <div className="w-full max-w-[400px] space-y-6 animate-scale-in px-4">
                <input 
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full h-18 bg-white border border-slate-200 rounded-3xl px-8 text-center text-2xl font-black text-secondary focus:border-primary shadow-sm"
                  placeholder="Nome"
                />
              </div>
            ) : (
              <div className="text-center animate-slide-up">
                <h1 className="text-5xl font-black text-secondary uppercase italic tracking-tighter mb-4 leading-none">{player.name}</h1>
                <div className="flex items-center justify-center gap-4">
                  <span className="bg-secondary text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl">{player.position}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-8 grid grid-cols-3 gap-6 mb-16 -mt-12 relative z-20">
          {[
            { val: player.goals, label: 'Gols', color: 'bg-primary text-white shadow-primary/30' },
            { val: player.assists, label: 'Assists', color: 'bg-white text-secondary border border-slate-100' },
            { val: player.matches, label: 'Partidas', color: 'bg-secondary text-white shadow-secondary/30' }
          ].map((s, idx) => (
            <div 
              key={s.label} 
              className={`rounded-[2.5rem] p-8 flex flex-col items-center justify-center shadow-2xl animate-scale-in ${s.color}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <span className="text-4xl font-black italic mb-2 leading-none">{s.val}</span>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-60 text-center">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="px-8 space-y-10 animate-slide-up delay-300">
          <div className="flex items-center justify-between px-3">
            <h3 className="text-2xl font-black text-secondary italic uppercase">Skills O<span className="text-primary">&</span>A</h3>
            <div className="flex items-center gap-3 bg-amber-500/10 px-6 py-3 rounded-2xl border border-amber-500/20">
              <span className="material-symbols-outlined text-amber-500 text-[24px] fill-current">star</span>
              <span className="text-[12px] font-black text-amber-600 tracking-tighter">{displayRating} Rank</span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[4rem] p-10 space-y-10 premium-shadow relative overflow-hidden">
            {[
              { key: 'pac', label: 'Ritmo (PAC)', color: 'bg-primary' },
              { key: 'sho', label: 'Chute (SHO)', color: 'bg-rose-600' },
              { key: 'pas', label: 'Passe (PAS)', color: 'bg-success' },
              { key: 'dri', label: 'Drible (DRI)', color: 'bg-indigo-500' },
              { key: 'def', label: 'Defesa (DEF)', color: 'bg-slate-700' },
              { key: 'phy', label: 'Físico (PHY)', color: 'bg-orange-500' }
            ].map((skill, idx) => {
              const value = isEditing ? (editData.stats as any)[skill.key] : (player.stats as any)[skill.key];
              return (
                <div key={skill.key} className="space-y-5 relative z-10 animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="flex justify-between items-end">
                    <span className="text-[12px] font-black text-secondary uppercase tracking-[0.3em]">{skill.label}</span>
                    <span className="text-3xl font-black text-secondary italic leading-none">{value}</span>
                  </div>
                  {isEditing ? (
                    <input 
                      type="range" min="0" max="100" value={value}
                      onChange={(e) => setEditData({...editData, stats: { ...editData.stats, [skill.key]: parseInt(e.target.value) }})}
                      className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary border border-slate-200"
                    />
                  ) : (
                    <div className="w-full h-5 bg-slate-50 rounded-full overflow-hidden p-1 border border-slate-100 shadow-inner">
                      <div className={`h-full ${skill.color} rounded-full transition-all duration-1000 ease-out shadow-lg`} style={{ width: `${value}%` }}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
