
import React, { useRef, useState } from 'react';
import { Screen, Player, Match } from '../types';
import { matchService } from '../services/matchService';

interface ArenaScreenProps {
  players: Player[];
  activeMatch: Match | null;
  currentPlayer: Player | null;
  featuredImageUrl: string | null;
  onToggleConfirm: (id: string) => void;
  onNavigate: (screen: Screen) => void;
}

const ArenaScreen: React.FC<ArenaScreenProps> = ({ 
  players, 
  activeMatch, 
  currentPlayer, 
  featuredImageUrl,
  onToggleConfirm, 
  onNavigate 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const confirmedPlayers = players.filter(p => p.confirmed);
  const confirmedGKs = confirmedPlayers.filter(p => p.position === 'Goalkeeper').length;
  const confirmedField = confirmedPlayers.filter(p => p.position !== 'Goalkeeper').length;
  
  const isConfirmed = currentPlayer?.confirmed || false;
  const isAdmin = currentPlayer?.role === 'admin';
  
  const GAME_FEE = activeMatch?.price || 0;
  const userBalance = currentPlayer?.paid ? 0 : (isConfirmed ? GAME_FEE : 0);
  const CROATIA_LOGO = "https://upload.wikimedia.org/wikipedia/pt/c/cf/Croatia_football_federation.png";

  const GK_LIMIT = 5;
  const FIELD_LIMIT = activeMatch ? activeMatch.limit - GK_LIMIT : 0;

  const handleFeaturedImageClick = () => {
    if (isAdmin && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isAdmin) {
      setIsUploading(true);
      try {
        await matchService.updateFeaturedImage(file);
      } catch (err: any) {
        alert("Erro no upload: " + err.message);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="h-full bg-background overflow-y-auto no-scrollbar pb-36 px-5">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

      {/* Header */}
      <header className="flex items-center justify-between pt-8 pb-4 sticky top-0 z-40 bg-background/90 backdrop-blur-md -mx-5 px-5">
        <div className="flex items-center gap-2.5">
          <div className="size-9 flex items-center justify-center">
            <img src={CROATIA_LOGO} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black text-secondary italic tracking-tighter leading-none">
              O<span className="text-primary">&</span>A
            </h1>
            <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Elite Manager</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button 
              onClick={() => onNavigate('create-match')}
              className="size-10 bg-primary text-white rounded-xl flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-[20px] font-bold">add</span>
            </button>
          )}
          <button 
            onClick={() => onNavigate('profile')}
            className="size-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-secondary shadow-sm active:scale-90"
          >
            <span className="material-symbols-outlined text-[20px]">account_circle</span>
          </button>
        </div>
      </header>

      <div className="mt-4 space-y-6">
        
        {/* CAPA DA SEMANA */}
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Capa da Semana</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gold/10 rounded-full border border-gold/20">
              <span className="material-symbols-outlined text-gold text-[12px] font-black">emoji_events</span>
              <span className="text-[7px] font-black text-gold uppercase tracking-widest">Campeões do Domingo</span>
            </div>
          </div>

          <div 
            onClick={handleFeaturedImageClick}
            className={`relative w-full h-72 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all ${isAdmin ? 'cursor-pointer active:scale-[0.98]' : ''}`}
          >
            {featuredImageUrl ? (
              <>
                <img 
                  src={featuredImageUrl} 
                  className="w-full h-full object-cover" 
                  alt="Equipe da Semana"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/20 to-transparent"></div>
              </>
            ) : (
              <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center gap-4">
                <span className="material-symbols-outlined text-slate-300 text-5xl">photo_library</span>
                <p className="text-[10px] font-black text-slate-300 uppercase">Aguardando registro dos campeões</p>
              </div>
            )}

            {isAdmin && (
              <div className="absolute top-4 right-4 z-20">
                <div className="size-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white shadow-lg">
                  {isUploading ? (
                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                  )}
                </div>
              </div>
            )}

            {featuredImageUrl && (
              <div className="absolute bottom-8 left-8 right-8 z-10">
                <h3 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none mb-1">Elite Team <span className="text-primary">O&A</span></h3>
                <p className="text-[10px] font-bold text-white/60 tracking-[0.3em] uppercase">Vencedores do Último Encontro</p>
              </div>
            )}
          </div>
        </section>

        {/* PRÓXIMA CONVOCAÇÃO */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Próxima Convocação</h2>
            {activeMatch && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 rounded-full border border-primary/10">
                <span className="size-1.5 bg-primary rounded-full animate-pulse"></span>
                <span className="text-[7px] font-black text-primary uppercase tracking-widest">Inscrições Abertas</span>
              </div>
            )}
          </div>

          {activeMatch ? (
            <div className="stadium-overlay rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-2xl animate-scale-in">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[8px] font-bold uppercase tracking-widest border border-white/10">
                    {activeMatch.type} (7x7)
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-white/60 uppercase tracking-widest mb-0.5">Taxa de Arena</p>
                    <p className="text-xs font-black italic">R$ {activeMatch.price}</p>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-6xl font-black italic tracking-tighter leading-none mb-1">{activeMatch.time}</h3>
                  <p className="text-[10px] font-bold text-white/70 tracking-[0.3em] uppercase">{activeMatch.date}</p>
                </div>

                {/* VAGAS SEGMENTADAS */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/60">Goleiros</span>
                      <span className="text-[10px] font-black">{confirmedGKs} / {GK_LIMIT}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-700" 
                        style={{ width: `${(confirmedGKs / GK_LIMIT) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/60">Linha</span>
                      <span className="text-[10px] font-black">{confirmedField} / {FIELD_LIMIT}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-success transition-all duration-700" 
                        style={{ width: `${(confirmedField / FIELD_LIMIT) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/40 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white/10">
                  <div className="size-8 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-white text-[18px]">location_on</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">Localização</p>
                    <p className="text-[11px] font-black truncate">{activeMatch.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-[40px] text-slate-200 mb-4">sports_soccer</span>
              <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Aguardando nova pelada...</p>
            </div>
          )}
        </section>

        {activeMatch && (
          <button 
            onClick={() => currentPlayer && onToggleConfirm(currentPlayer.id)}
            className="w-full h-14 bg-white border border-slate-50 rounded-2xl flex items-center justify-center gap-3 shadow-sm active:scale-95 transition-all group"
          >
            <span className="material-symbols-outlined text-slate-400 group-active:text-primary transition-colors">
              {isConfirmed ? 'cancel' : 'check_circle'}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
              {isConfirmed ? 'Retirar Presença' : 'Confirmar Presença'}
            </span>
          </button>
        )}

        <section>
          <div className="bg-white rounded-[1.8rem] p-5 flex items-center justify-between shadow-sm border border-slate-50">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={currentPlayer?.avatar} className="size-14 rounded-full border-4 border-slate-50 object-cover shadow-sm" alt="Profile" />
                {isConfirmed && (
                  <div className="absolute -bottom-1 -right-1 size-5 bg-success rounded-full border-2 border-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[10px] font-black">done</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Meu Status</p>
                <p className={`text-[11px] font-black uppercase italic ${isConfirmed ? 'text-secondary' : 'text-slate-300'}`}>
                  {isConfirmed ? "Convocado ✅" : "Pendente ⏳"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Taxa</p>
              <p className={`text-sm font-black italic ${userBalance > 0 ? 'text-primary' : 'text-success'}`}>
                {userBalance > 0 ? `R$ ${userBalance}` : 'Pago'}
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4 pb-10">
          <div onClick={() => onNavigate('players')} className="bg-white rounded-[1.8rem] p-6 space-y-4 border border-slate-50 shadow-sm active:scale-95 transition-all cursor-pointer">
            <div className="size-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px] font-bold">groups</span>
            </div>
            <div>
              <p className="text-3xl font-black text-secondary italic leading-none">
                {activeMatch ? Math.max((GK_LIMIT - confirmedGKs) + (FIELD_LIMIT - confirmedField), 0) : '0'}
              </p>
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.1em] mt-1">Total Vagas Livres</p>
            </div>
          </div>
          <div onClick={() => onNavigate('scout')} className="bg-white rounded-[1.8rem] p-6 space-y-4 border border-slate-50 shadow-sm active:scale-95 transition-all cursor-pointer">
            <div className="size-10 bg-secondary/5 rounded-xl flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px] font-bold">leaderboard</span>
            </div>
            <div>
              <p className="text-3xl font-black text-secondary italic leading-none">
                #{players.findIndex(p => p.id === currentPlayer?.id) + 1 || '1'}
              </p>
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.1em] mt-1">Meu Ranking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArenaScreen;
