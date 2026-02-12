
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
    goals: player.goals,
    assists: player.assists,
    matches: player.matches,
    goalsConceded: player.goalsConceded || 0
  });

  useEffect(() => {
    setIsImageLoading(true);
    setEditData({
      name: player.name,
      position: player.position,
      goals: player.goals,
      assists: player.assists,
      matches: player.matches,
      goalsConceded: player.goalsConceded || 0
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
      setIsImageLoading(true);
      try {
        await onUpdateAvatar(player.id, file);
      } catch (err) {
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
      await playerService.updateProfile(player.id, { ...editData });
      setIsEditing(false);
    } catch (err: any) {
      alert("Erro ao salvar perfil.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleAdmin = async () => {
    const newRole = player.role === 'admin' ? 'player' : 'admin';
    if (window.confirm(`Deseja alterar o cargo de ${player.name}?`)) {
      try {
        await playerService.setPlayerRole(player.id, newRole);
      } catch (err) {
        alert("Erro ao alterar cargo.");
      }
    }
  };

  const handleDeletePlayer = async () => {
    if (window.confirm(`Excluir ${player.name} definitivamente?`)) {
      try {
        await playerService.deletePlayer(player.id);
        onNavigate('players');
      } catch (err) {
        alert("Erro ao excluir atleta.");
      }
    }
  };

  return (
    <div className="h-full bg-background flex flex-col relative overflow-hidden">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

      <header className="flex items-center justify-between px-6 py-6 sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <button onClick={() => onNavigate('home')} className="size-10 bg-slate-50 text-secondary rounded-xl flex items-center justify-center active:scale-90 border border-slate-100">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="text-center">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">Elite Identity</h2>
          <p className="text-sm font-black text-secondary italic uppercase tracking-tighter">Ficha do Atleta</p>
        </div>
        <div className="flex items-center gap-2">
          {isOwnProfile && (
             <button onClick={onLogout} className="size-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center active:scale-90 border border-slate-100">
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
          )}
          {(isOwnProfile || isAdmin) && (
            <button 
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              disabled={isUploading}
              className={`size-10 rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-lg ${isEditing ? 'bg-primary text-white' : 'bg-white border border-slate-100 text-secondary'}`}
            >
              {isUploading ? <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <span className="material-symbols-outlined text-[20px]">{isEditing ? 'done' : 'settings'}</span>}
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-36">
        <div className="relative pt-12 pb-12 px-6 overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none"></div>
          
          <div className="flex flex-col items-center relative z-10">
            <div className={`relative mb-6 group ${isOwnProfile && !isUploading ? 'cursor-pointer active:scale-95' : ''} transition-all`} onClick={handleAvatarClick}>
              <div className="size-40 rounded-full border-8 border-white shadow-xl relative bg-slate-100 overflow-hidden flex items-center justify-center">
                 {isImageLoading && <div className="absolute inset-0 shimmer-bg animate-shimmer"></div>}
                 <img key={player.avatar} src={player.avatar} loading="lazy" className={`size-full object-cover transition-all duration-500 ${isImageLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`} alt={player.name} onLoad={() => setIsImageLoading(false)} />
                 {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-sm z-20">
                      <div className="size-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                 )}
                 {isOwnProfile && !isUploading && !isImageLoading && (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[2px]">
                      <span className="material-symbols-outlined text-2xl">photo_camera</span>
                    </div>
                 )}
              </div>
            </div>
            
            {isEditing ? (
              <div className="w-full max-w-[300px] space-y-4 animate-scale-in">
                <input value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="w-full h-12 bg-white border border-slate-200 rounded-2xl px-6 text-center text-xl font-black text-secondary focus:border-primary shadow-sm" placeholder="Nome" />
                <select value={editData.position} onChange={(e) => setEditData({...editData, position: e.target.value as any})} className="w-full h-12 bg-white border border-slate-200 rounded-2xl px-6 text-center text-sm font-black text-secondary focus:border-primary shadow-sm">
                  <option value="Goalkeeper">Goleiro</option>
                  <option value="Defender">Defesa</option>
                  <option value="Midfielder">Meio</option>
                  <option value="Forward">Ataque</option>
                </select>
                {isAdmin && (
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" placeholder="Gols" value={editData.goals} onChange={(e) => setEditData({...editData, goals: parseInt(e.target.value) || 0})} className="h-10 bg-slate-50 border-none rounded-xl text-center font-bold text-secondary" />
                    <input type="number" placeholder="Assists" value={editData.assists} onChange={(e) => setEditData({...editData, assists: parseInt(e.target.value) || 0})} className="h-10 bg-slate-50 border-none rounded-xl text-center font-bold text-secondary" />
                    <input type="number" placeholder="Partidas" value={editData.matches} onChange={(e) => setEditData({...editData, matches: parseInt(e.target.value) || 0})} className="h-10 bg-slate-50 border-none rounded-xl text-center font-bold text-secondary" />
                    <input type="number" placeholder="G. Sofridos" value={editData.goalsConceded} onChange={(e) => setEditData({...editData, goalsConceded: parseInt(e.target.value) || 0})} className="h-10 bg-slate-50 border-none rounded-xl text-center font-bold text-secondary" />
                  </div>
                )}
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

        {isAdmin && !isOwnProfile && !isEditing && (
          <div className="px-6 mb-8 animate-slide-up">
            <div className="bg-slate-900 rounded-[2rem] p-5 text-white flex flex-col gap-3">
              <button onClick={handleToggleAdmin} className="w-full h-11 bg-white/10 rounded-xl flex items-center justify-between px-5 text-[10px] font-bold uppercase tracking-widest">
                <span>Alternar Privilégios</span>
                <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
              </button>
              <button onClick={handleDeletePlayer} className="w-full h-11 bg-primary/20 rounded-xl flex items-center justify-between px-5 text-[10px] font-bold uppercase tracking-widest text-primary">
                <span>Remover do Elenco</span>
                <span className="material-symbols-outlined text-[20px]">delete_forever</span>
              </button>
            </div>
          </div>
        )}

        <div className="px-6 grid grid-cols-2 gap-4">
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col items-center justify-center shadow-sm">
            <span className="text-4xl font-black italic text-primary leading-none mb-2">{player.goals}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Artilharia (Gols)</span>
          </div>
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col items-center justify-center shadow-sm">
            <span className="text-4xl font-black italic text-secondary leading-none mb-2">{player.assists}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Garçom (Assists)</span>
          </div>
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col items-center justify-center shadow-sm">
            <span className="text-4xl font-black italic text-secondary leading-none mb-2">{player.matches}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jogos Realizados</span>
          </div>
          {player.position === 'Goalkeeper' && (
            <div className="bg-slate-900 rounded-[2rem] p-6 flex flex-col items-center justify-center shadow-sm">
              <span className="text-4xl font-black italic text-white leading-none mb-2">{player.goalsConceded || 0}</span>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Gols Sofridos</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
