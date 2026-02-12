
import React, { useRef, useState } from 'react';
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
  const [editData, setEditData] = useState({
    name: player.name,
    position: player.position,
    level: player.level,
    club: player.club || '',
    number: player.number || 0,
    stats: { ...player.stats }
  });

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
      <header className="flex items-center justify-between px-6 py-6 sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <button 
          onClick={() => onNavigate('home')} 
          className="size-10 bg-slate-50 text-secondary rounded-xl flex items-center justify-center active:scale-90 transition-all border border-slate-100"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="text-center">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-0.5 leading-none">Vatreni</h2>
          <p className="text-sm font-black text-secondary italic uppercase tracking-tighter">Pro Identity</p>
        </div>
        <div className="flex items-center gap-2">
          {isOwnProfile && (
             <button 
                onClick={onLogout}
                className="size-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center active:scale-90 transition-all border border-slate-100"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
          )}
          {(isOwnProfile || isAdmin) ? (
            <button 
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              disabled={loading}
              className={`size-10 rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-sm ${
                isEditing ? 'bg-primary text-white' : 'bg-white border border-slate-100 text-secondary'
              }`}
            >
              {loading ? (
                <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined text-[20px]">{isEditing ? 'done' : 'settings'}</span>
              )}
            </button>
          ) : <div className="size-10"></div>}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <div className="relative pt-12 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 size-64 opacity-[0.03] checkerboard-pattern -rotate-12 pointer-events-none"></div>
          
          <div className="flex flex-col items-center relative z-10">
            <div className={`relative mb-8 group ${isOwnProfile ? 'cursor-pointer' : ''}`} onClick={handleAvatarClick}>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              <div className="size-40 rounded-full border-[8px] border-white shadow-2xl relative transition-transform group-hover:scale-105 active:scale-95 bg-slate-100 overflow-hidden">
                 <img src={player.avatar} className="size-full object-cover" alt={player.name} />
                 {isOwnProfile && (
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
                     <span className="material-symbols-outlined">photo_camera</span>
                   </div>
                 )}
              </div>
              <div className="absolute -bottom-2 -right-2 size-14 bg-secondary text-white rounded-2xl border-4 border-white flex flex-col items-center justify-center shadow-xl rotate-6">
                 <span className="text-xl font-black italic leading-none">{player.rating}</span>
                 <span className="text-[7px] font-black uppercase tracking-tighter opacity-50">OVR</span>
              </div>
            </div>
            
            {isEditing ? (
              <div className="w-full max-w-[320px] space-y-4 animate-scale-in">
                <input 
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-6 text-center text-lg font-black text-secondary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                  placeholder="Nome Completo"
                />
                <div className="flex gap-2">
                  <select 
                    value={editData.position}
                    onChange={(e) => setEditData({...editData, position: e.target.value})}
                    className="flex-1 h-12 bg-white border border-slate-200 rounded-2xl px-4 text-[10px] font-black uppercase tracking-widest text-secondary"
                  >
                    <option>Forward</option><option>Midfielder</option><option>Defender</option><option>Goalkeeper</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="text-center animate-slide-up">
                <h1 className="text-4xl font-black text-secondary uppercase italic tracking-tighter mb-2 leading-none">{player.name}</h1>
                <div className="flex items-center justify-center gap-3">
                  <span className="bg-secondary text-white px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-secondary/20">{player.position}</span>
                  <div className="h-5 w-px bg-slate-200"></div>
                  <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{player.level}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 grid grid-cols-3 gap-4 mb-12 -mt-10 relative z-20">
          {[
            { val: player.goals, label: 'Gols', color: 'bg-primary text-white shadow-primary/20' },
            { val: player.assists, label: 'Assists', color: 'bg-white text-secondary border border-slate-100' },
            { val: player.matches, label: 'Partidas', color: 'bg-secondary text-white shadow-secondary/20' }
          ].map((s, idx) => (
            <div 
              key={s.label} 
              className={`rounded-[2rem] p-6 flex flex-col items-center justify-center shadow-xl animate-scale-in transition-transform hover:scale-105 active:scale-95 ${s.color}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <span className="text-3xl font-black italic mb-1 leading-none">{s.val}</span>
              <span className="text-[7px] font-black uppercase tracking-[0.3em] opacity-60 text-center">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="px-6 space-y-8 animate-slide-up delay-300">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-secondary italic uppercase">Technical Core</h3>
            <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-500/20">
              <span className="material-symbols-outlined text-amber-500 text-[18px] fill-current">star</span>
              <span className="text-[10px] font-black text-amber-600 tracking-tighter">{displayRating} Elite Rank</span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[3rem] p-8 space-y-8 premium-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full opacity-50 -z-0 pointer-events-none"></div>
            
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
                <div key={skill.key} className="space-y-4 relative z-10 animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{skill.label}</span>
                    <span className="text-2xl font-black text-secondary italic leading-none">{value}</span>
                  </div>
                  
                  {isEditing ? (
                    <input 
                      type="range" min="0" max="100" value={value}
                      onChange={(e) => setEditData({...editData, stats: { ...editData.stats, [skill.key]: parseInt(e.target.value) }})}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary border border-slate-200"
                    />
                  ) : (
                    <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100 shadow-inner">
                      <div className={`h-full ${skill.color} rounded-full transition-all duration-1000 ease-out shadow-sm`} style={{ width: `${value}%` }}></div>
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
