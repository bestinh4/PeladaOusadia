
import React, { useState } from 'react';
import { Player, Screen } from '../types';

interface PlayerListScreenProps {
  players: Player[];
  onToggleConfirm: (id: string) => void;
  onNavigate: (screen: Screen, data?: any) => void;
}

const PlayerListScreen: React.FC<PlayerListScreenProps> = ({ players, onToggleConfirm, onNavigate }) => {
  const [tab, setTab] = useState('confirmados');
  const confirmedPlayers = players.filter(p => p.confirmed);

  return (
    <div className="h-full bg-background overflow-y-auto no-scrollbar pb-32">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 sticky top-0 bg-background/80 backdrop-blur-xl z-30 animate-fade-in">
        <button onClick={() => onNavigate('home')} className="text-white hover:text-primary transition-colors active:scale-90">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-xl font-black text-white">Lista de Chamada</h2>
        <button className="text-white hover:text-primary transition-colors active:scale-90">
          <span className="material-symbols-outlined">share</span>
        </button>
      </header>

      <div className="px-6 mb-8 flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 italic">Pelada dos Amigos</h1>
          <div className="flex items-center gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              Quarta, 20:00h
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              Arena Society
            </div>
          </div>
        </div>
        <div className="size-14 bg-surface rounded-2xl flex items-center justify-center text-primary border border-white/5 animate-float shadow-lg shadow-primary/5">
          <span className="material-symbols-outlined text-[32px]">sports_soccer</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 flex gap-4 border-b border-white/5 mb-6 animate-slide-up delay-100">
        {[
          { id: 'confirmados', label: 'Confirmados', count: 14, icon: 'check_circle', color: 'text-primary' },
          { id: 'espera', label: 'Espera', count: 3, icon: 'schedule', color: 'text-amber-400' },
          { id: 'nao-vao', label: 'Não Vão', count: 5, icon: 'cancel', color: 'text-accent' }
        ].map(t => (
          <button 
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 pb-4 flex flex-col items-center gap-1 relative transition-all duration-300 ${tab === t.id ? 'opacity-100 scale-105' : 'opacity-40 grayscale hover:opacity-60'}`}
          >
            <div className="flex items-center gap-1">
              <span className={`material-symbols-outlined text-[18px] ${t.color}`}>{t.icon}</span>
              <span className="text-[10px] font-black uppercase text-white">{t.label}</span>
            </div>
            <div className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-colors ${tab === t.id ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/40'}`}>
              {t.count}
            </div>
            {tab === t.id && <div className="absolute bottom-0 w-full h-1 bg-primary rounded-full neon-glow animate-fade-in"></div>}
          </button>
        ))}
      </div>

      <div className="px-6 mb-4 flex justify-between items-center animate-slide-up delay-200">
        <h3 className="text-[11px] font-black text-white/40 uppercase tracking-widest">Jogadores Confirmados</h3>
        <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-[14px]">sort</span>
          Ordenar por Nível
        </button>
      </div>

      <div className="px-6 space-y-4">
        {confirmedPlayers.map((player, idx) => (
          <div 
            key={player.id}
            onClick={() => onNavigate('profile', player)}
            className="flex items-center gap-4 group cursor-pointer animate-slide-in-right hover:translate-x-2 transition-all"
            style={{ animationDelay: `${idx * 100 + 300}ms` }}
          >
            <div className="relative group-hover:scale-110 transition-transform">
              <img src={player.avatar} className="size-14 rounded-full border-2 border-primary/20 p-0.5 object-cover bg-white/5" />
              <div className="absolute -bottom-1 -right-1 size-6 bg-surface rounded-full border-2 border-background flex items-center justify-center text-[10px] font-black text-primary">
                10
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <h4 className="text-[15px] font-black text-white uppercase group-hover:text-primary transition-colors">{player.name}</h4>
                <span className="material-symbols-outlined text-amber-400 text-[14px]">verified</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className={`material-symbols-outlined text-[12px] ${i <= 4 ? 'text-primary' : 'text-white/10'}`}>star</span>
                  ))}
                </div>
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-2">{player.position}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-32 left-0 w-full px-6 flex gap-3 z-40 animate-slide-up">
        <button className="flex-1 h-15 bg-surface border border-white/5 rounded-2xl flex items-center justify-center gap-2 text-white font-black uppercase text-xs active:scale-95 transition-all hover:bg-surface/80">
          <span className="material-symbols-outlined">person_add</span>
          Convidar
        </button>
        <button className="flex-[1.5] h-15 btn-primary rounded-2xl flex items-center justify-center gap-2 text-xs">
          <span className="material-symbols-outlined font-bold">check</span>
          Confirmar Presença
        </button>
      </div>
    </div>
  );
};

export default PlayerListScreen;
