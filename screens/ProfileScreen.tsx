
import React, { useRef, useState } from 'react';
import { Player, Screen } from '../types';
import { playerService } from '../services/playerService';

interface ProfileScreenProps {
  player: Player;
  players: Player[];
  currentPlayer: Player | null;
  onNavigate: (screen: Screen, data?: any) => void;
  onUpdateAvatar: (id: string, file: File | string) => Promise<void>;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ player, currentPlayer, onNavigate, onUpdateAvatar }) => {
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
      // Calculate Overall Rating based on stats average
      const s = editData.stats;
      const overall = Math.round((s.pac + s.sho + s.pas + s.dri + s.def + s.phy) / 6);
      
      await playerService.updateProfile(player.id, { 
        ...editData, 
        rating: overall 
      });
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
      {/* Header Premium */}
      <header className="flex items-center justify-between px-6 py-5 sticky top-0 bg-white/80 backdrop-blur-xl z-30 border-b border-slate-100 shrink-0">
        <button 
          onClick={() => onNavigate('home')} 
          className="size-10 bg-slate-50 text-secondary rounded-xl flex items-center justify-center active:scale-90 transition-all border border-slate-100"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="text-center">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-0.5">Player Card</h2>
          <p className="text-sm font-black text-secondary italic uppercase tracking-tighter">Ficha Técnica</p>
        </div>
        {(isOwnProfile || isAdmin) ? (
          <button 
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            disabled={loading}
            className={`size-10 rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-sm ${
              isEditing ? 'bg-primary text-white shadow-primary/20' : 'bg-white border border-slate-100 text-secondary'
            }`}
          >
            {loading ? (
              <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="material-symbols-outlined text-[20px]">{isEditing ? 'check' : 'edit_square'}</span>
            )}
          </button>
        ) : <div className="size-10"></div>}
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Profile Hero section with Mesh Gradient Effect */}
        <div className="relative pt-10 pb-16 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] checkerboard-pattern pointer-events-none"></div>
          
          <div className="flex flex-col items-center relative z-10">
            <div className={`relative mb-6 group ${isOwnProfile ? 'cursor-pointer' : ''}`} onClick={handleAvatarClick}>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              <div className="size-36 sm:size-40 rounded-full border-[6px] border-white shadow-2xl relative transition-transform group-hover:scale-105 active:scale-95 bg-slate-100 overflow-hidden">
                 <img src={player.avatar} className="size-full object-cover" alt={player.name} />
                 {isOwnProfile && (
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
                     <span className="material-symbols-outlined">photo_camera</span>
                     <span className="text-[8px] font-black uppercase tracking-widest">Alterar</span>
                   </div>
                 )}
              </div>
              {/* Overall Badge Overlay */}
              <div className="absolute -bottom-2 -right-2 size-12 sm:size-14 bg-secondary rounded-2xl border-4 border-white flex flex-col items-center justify-center shadow-xl transform rotate-3">
                 <span className="text-white text-lg sm:text-xl font-black italic leading-none">{player.rating}</span>
                 <span className="text-white/50 text-[7px] font-black uppercase tracking-tighter">OVR</span>
              </div>
            </div>
            
            {isEditing ? (
              <div className="w-full max-w-[300px] space-y-3 animate-fade-in">
                <input 
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full h-12 bg-white/80 border border-slate-200 rounded-2xl px-4 text-center text-lg font-black text-secondary focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all"
                  placeholder="Nome do Atleta"
                />
                <div className="flex gap-2">
                  <select 
                    value={editData.position}
                    onChange={(e) => setEditData({...editData, position: e.target.value})}
                    className="flex-1 h-10 bg-white border border-slate-200 rounded-xl px-2 text-[9px] font-black uppercase tracking-widest text-secondary focus:border-primary/40"
                  >
                    <option>Forward</option>
                    <option>Midfielder</option>
                    <option>Defender</option>
                    <option>Goalkeeper</option>
                  </select>
                  <select 
                    value={editData.level}
                    onChange={(e) => setEditData({...editData, level: e.target.value})}
                    className="flex-1 h-10 bg-white border border-slate-200 rounded-xl px-2 text-[9px] font-black uppercase tracking-widest text-secondary focus:border-primary/40"
                  >
                    <option>Amador</option>
                    <option>Semi-Pro</option>
                    <option>Profissional</option>
                    <option>Lenda</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="text-center animate-slide-up">
                <h1 className="text-3xl sm:text-4xl font-black text-secondary uppercase italic tracking-tighter mb-1 leading-tight">{player.name}</h1>
                <div className="flex items-center justify-center gap-3">
                  <span className="bg-secondary text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] shadow-lg shadow-secondary/20">{player.position}</span>
                  <div className="h-4 w-px bg-slate-200"></div>
                  <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{player.level}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Career Summary Stats Cards */}
        <div className="px-6 grid grid-cols-3 gap-3 sm:gap-4 mb-10 -mt-6 relative z-20">
          {[
            { val: player.goals, label: 'Gols', icon: 'ads_click', color: 'bg-primary text-white shadow-primary/20' },
            { val: player.assists, label: 'Assists', icon: 'share', color: 'bg-white text-secondary border border-slate-100' },
            { val: player.matches, label: 'Jogos', icon: 'sports_soccer', color: 'bg-secondary text-white shadow-secondary/20' }
          ].map((s, idx) => (
            <div 
              key={s.label} 
              className={`rounded-3xl p-5 flex flex-col items-center justify-center shadow-xl animate-scale-in transition-transform hover:scale-105`}
              style={{ backgroundColor: s.color.includes('bg-white') ? '#ffffff' : '', animationDelay: `${idx * 0.1}s` }}
            >
              <div className={`mb-2 opacity-40`}>
                <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
              </div>
              <span className={`text-2xl font-black italic mb-0.5 ${s.color.includes('text-white') ? 'text-white' : 'text-secondary'}`}>{s.val}</span>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${s.color.includes('text-white') ? 'text-white/60' : 'text-slate-400'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tactical Attributes Section */}
        <div className="px-6 space-y-6 animate-slide-up delay-300">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-secondary italic uppercase tracking-tight">Atributos Técnicos</h3>
            <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 shadow-sm">
              <span className="material-symbols-outlined text-amber-500 text-[16px] fill-current">star</span>
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-tighter">Skill Rank: {displayRating}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 sm:p-8 space-y-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full opacity-50 -z-0 pointer-events-none"></div>
            
            {[
              { key: 'pac', label: 'Ritmo (PAC)', icon: 'bolt', color: 'from-orange-500 to-primary' },
              { key: 'sho', label: 'Chute (SHO)', icon: 'target', color: 'from-primary to-rose-700' },
              { key: 'pas', label: 'Passe (PAS)', icon: 'conversion_path', color: 'from-emerald-400 to-success' },
              { key: 'dri', label: 'Drible (DRI)', icon: 'cyclone', color: 'from-indigo-400 to-secondary' },
              { key: 'def', label: 'Defesa (DEF)', icon: 'shield', color: 'from-slate-400 to-slate-700' },
              { key: 'phy', label: 'Físico (PHY)', icon: 'fitness_center', color: 'from-amber-400 to-orange-600' }
            ].map((skill, idx) => {
              const value = isEditing ? (editData.stats as any)[skill.key] : (player.stats as any)[skill.key];
              return (
                <div key={skill.key} className="space-y-3 relative z-10 animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <div className={`size-8 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center text-white shadow-lg`}>
                        <span className="material-symbols-outlined text-[18px]">{skill.icon}</span>
                      </div>
                      <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{skill.label}</span>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xl font-black text-secondary italic leading-none">{value}</span>
                      <span className="text-[8px] font-bold text-slate-300 uppercase">/100</span>
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <div className="relative h-6 flex items-center">
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => setEditData({
                          ...editData, 
                          stats: { ...editData.stats, [skill.key]: parseInt(e.target.value) }
                        })}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary border border-slate-200"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100 shadow-inner">
                      <div 
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out shadow-sm`} 
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-widest px-8 leading-relaxed opacity-60 italic">
            * O Rating Geral (OVR) é calculado automaticamente baseado na média ponderada dos atributos técnicos acima.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
