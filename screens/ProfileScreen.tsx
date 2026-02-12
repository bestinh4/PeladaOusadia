
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
  const [isUploading, setIsUploading] = useState(false); 
  const [isImageLoading, setIsImageLoading] = useState(true); 
  const [editData, setEditData] = useState({
    name: player.name,
    position: player.position,
    club: player.club || '',
    number: player.number || 0,
    stats: { ...player.stats }
  });

  // Reseta o estado de carregamento e dados de edição quando o jogador visualizado muda
  useEffect(() => {
    setIsImageLoading(true);
    setEditData({
      name: player.name,
      position: player.position,
      club: player.club || '',
      number: player.number || 0,
      stats: { ...player.stats }
    });
  }, [player.id, player.avatar]);

  const isOwnProfile = currentPlayer?.id === player.id;
  const isAdmin = currentPlayer?.role === 'admin';

  const handleAvatarClick = () => {
    if (!isOwnProfile || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setIsImageLoading(true); // Força shimmer ao trocar imagem
      try {
        await onUpdateAvatar(player.id, file);
      } catch (err) {
        console.error("Erro no upload:", err);
        alert("Erro ao enviar imagem.");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleSaveProfile = async () => {
    setIsUploading(true);
    try {
      const s = editData.stats;
      const overall = Math.round((s.pac + s.sho + s.pas + s.dri + s.def + s.phy) / 6);
      await playerService.updateProfile(player.id, { ...editData, rating: overall });
      setIsEditing(false);
    } catch (err: any) {
      alert("Erro ao salvar perfil.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleAdmin = async () => {
    const newRole = player.role === 'admin' ? 'player' : 'admin';
    const confirmMsg = player.role === 'admin' 
      ? `Remover privilégios de Admin de ${player.name}?` 
      : `Tornar ${player.name} um Administrador?`;
    
    if (window.confirm(confirmMsg)) {
      try {
        await playerService.setPlayerRole(player.id, newRole);
      } catch (err) {
        alert("Erro ao alterar cargo.");
      }
    }
  };

  const handleDeletePlayer = async () => {
    if (window.confirm(`AVISO CRÍTICO: Excluir ${player.name} definitivamente do elenco? Esta ação não pode ser desfeita.`)) {
      try {
        await playerService.deletePlayer(player.id);
        onNavigate('players');
      } catch (err) {
        alert("Erro ao excluir atleta.");
      }
    }
  };

  const handleImageLoad = () => setIsImageLoading(false);
  const handleImageError = () => setIsImageLoading(false);

  const displayRating = (player.rating / 20).toFixed(1);

  return (
    <div className="h-full bg-background flex flex-col relative overflow-hidden">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

      <header className="flex items-center justify-between px-6 py-6 sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <button onClick={() => onNavigate('home')} className="size-10 bg-slate-50 text-secondary rounded-xl flex items-center justify-center active:scale-90 border border-slate-100 transition-transform">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="text-center">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-0.5 leading-none">Elite Identity</h2>
          <p className="text-sm font-black text-secondary italic uppercase tracking-tighter">Perfil Pro</p>
        </div>
        <div className="flex items-center gap-2">
          {isOwnProfile && (
             <button onClick={onLogout} className="size-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center active:scale-90 border border-slate-100">
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
          )}
          {(isOwnProfile || isAdmin) ? (
            <button 
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              disabled={isUploading}
              className={`size-10 rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-lg ${isEditing ? 'bg-primary text-white shadow-primary/20' : 'bg-white border border-slate-100 text-secondary'}`}
            >
              {isUploading ? <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <span className="material-symbols-outlined text-[20px]">{isEditing ? 'done' : 'settings'}</span>}
            </button>
          ) : <div className="size-10"></div>}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-36">
        <div className="relative pt-12 pb-16 px-6 overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none"></div>
          
          <div className="flex flex-col items-center relative z-10">
            <div 
              className={`relative mb-8 group ${isOwnProfile && !isUploading ? 'cursor-pointer active:scale-95' : ''} transition-all`} 
              onClick={handleAvatarClick}
            >
              <div className="size-40 rounded-full border-8 border-white shadow-xl relative bg-slate-100 overflow-hidden flex items-center justify-center transition-all duration-300">
                 
                 {/* Shimmer Placeholder Animado */}
                 {isImageLoading && (
                   <div className="absolute inset-0 shimmer-bg animate-shimmer z-0"></div>
                 )}

                 {/* Imagem com Lazy Loading e Transição Suave */}
                 <img 
                   key={player.avatar}
                   src={player.avatar} 
                   loading="lazy"
                   className={`size-full object-cover transition-all duration-500 ease-in-out ${isImageLoading ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`} 
                   alt={player.name}
                   onLoad={handleImageLoad}
                   onError={handleImageError}
                 />
                 
                 {/* Feedback de Upload em tempo real */}
                 {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-sm z-20 animate-fade-in">
                      <div className="size-8 border-4 border-white/30 border-t-white rounded-full animate-spin mb-2"></div>
                      <span className="text-[8px] font-black uppercase tracking-widest animate-pulse">Enviando...</span>
                    </div>
                 )}

                 {isOwnProfile && !isUploading && !isImageLoading && (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[2px]">
                      <span className="material-symbols-outlined text-2xl">photo_camera</span>
                    </div>
                 )}
              </div>

              <div className="absolute -bottom-2 -right-2 size-14 bg-secondary text-white rounded-2xl border-4 border-white flex flex-col items-center justify-center shadow-xl rotate-6 animate-scale-in">
                 <span className="text-xl font-black italic leading-none">{player.rating}</span>
                 <span className="text-[8px] font-black uppercase tracking-tighter opacity-50">OVR</span>
              </div>
            </div>
            
            {isEditing ? (
              <div className="w-full max-w-[300px] animate-scale-in">
                <input value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="w-full h-12 bg-white border border-slate-200 rounded-2xl px-6 text-center text-xl font-black text-secondary focus:border-primary shadow-sm mb-4" placeholder="Nome" />
                <select value={editData.position} onChange={(e) => setEditData({...editData, position: e.target.value as any})} className="w-full h-12 bg-white border border-slate-200 rounded-2xl px-6 text-center text-sm font-black text-secondary focus:border-primary shadow-sm">
                  <option value="Goalkeeper">Goleiro</option>
                  <option value="Defender">Defesa</option>
                  <option value="Midfielder">Meio</option>
                  <option value="Forward">Ataque</option>
                </select>
              </div>
            ) : (
              <div className="animate-slide-up">
                <h1 className="text-3xl font-black text-secondary uppercase italic tracking-tighter mb-1 leading-tight">{player.name}</h1>
                <div className="flex items-center justify-center gap-2">
                  <span className="bg-secondary text-white px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{player.position}</span>
                  {player.role === 'admin' && <span className="bg-primary text-white px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1"><span className="material-symbols-outlined text-[12px] font-bold">verified</span> ADM</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ADMIN TOOLS PANEL */}
        {isAdmin && !isOwnProfile && (
          <div className="px-6 mb-12 animate-slide-up">
            <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 size-32 bg-primary/10 rounded-bl-full pointer-events-none"></div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Painel Administrativo</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleToggleAdmin}
                  className="w-full h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-between px-5 transition-all active:scale-95 border border-white/5"
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest">
                    {player.role === 'admin' ? 'Rebaixar para Jogador' : 'Promover a Administrador'}
                  </span>
                  <span className="material-symbols-outlined text-primary">{player.role === 'admin' ? 'person_off' : 'verified_user'}</span>
                </button>
                <button 
                  onClick={handleDeletePlayer}
                  className="w-full h-12 bg-primary/10 hover:bg-primary/20 rounded-xl flex items-center justify-between px-5 transition-all active:scale-95 border border-primary/20"
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest text-primary">Excluir Atleta do Elenco</span>
                  <span className="material-symbols-outlined text-primary">delete_forever</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="px-6 grid grid-cols-3 gap-4 mb-12 -mt-8 relative z-20">
          {[
            { val: player.goals, label: 'Gols', color: 'bg-primary text-white shadow-primary/20' },
            { val: player.assists, label: 'Assists', color: 'bg-white text-secondary border border-slate-100' },
            { val: player.matches, label: 'Partidas', color: 'bg-secondary text-white shadow-secondary/20' }
          ].map((s, idx) => (
            <div key={s.label} className={`rounded-[1.8rem] p-5 flex flex-col items-center justify-center shadow-xl animate-scale-in ${s.color}`} style={{ animationDelay: `${idx * 0.05}s` }}>
              <span className="text-2xl font-black italic mb-1 leading-none">{s.val}</span>
              <span className="text-[8px] font-black uppercase tracking-widest opacity-60 text-center leading-none">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="px-6 space-y-8 animate-slide-up delay-200">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-secondary italic uppercase tracking-tighter">Atributos Técnicos</h3>
            <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-1.5 rounded-lg border border-amber-500/20">
              <span className="material-symbols-outlined text-amber-500 text-[16px] fill-current">star</span>
              <span className="text-[10px] font-black text-amber-600 tracking-tighter">{displayRating} Rank</span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-6 pro-shadow">
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
                <div key={skill.key} className="space-y-3" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{skill.label}</span>
                    <span className="text-xl font-black text-secondary italic leading-none">{value}</span>
                  </div>
                  {isEditing ? (
                    <input type="range" min="0" max="100" value={value} onChange={(e) => setEditData({...editData, stats: { ...editData.stats, [skill.key]: parseInt(e.target.value) }})} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary" />
                  ) : (
                    <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
                      <div className={`h-full ${skill.color} rounded-full transition-all duration-1000 shadow-sm`} style={{ width: `${value}%` }}></div>
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
