
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
      <header className="flex items-center justify-between px-6 py-6 sticky top-0 bg-white/90 backdrop-blur-md z-30 animate-fade-in border-b border-slate-100">
        <button onClick={() => onNavigate('home')} className="size-10 flex items-center justify-center rounded-xl bg-slate-50 text-secondary hover:text-primary transition-all active:scale-90 hover:bg-slate-100">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-xl font-black text-secondary italic tracking-tighter">Lista de Chamada</h2>
        <button className="size-10 flex items-center justify-center rounded-xl bg-slate-50 text-secondary hover:text-primary transition-all active:scale-90 hover:bg-slate-100">
          <span className="material-symbols-outlined">share</span>
        </button>
      </header>

      <div className="px-6 mt-8 mb-8 flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-black text-secondary mb-2 italic tracking-tighter">Vatreni Manager</h1>
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg">
              <span className="material-symbols-outlined text-[14px] text-primary">calendar_today</span>
              Quarta, 20:00h
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg">
              <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
              Arena Society
            </div>
          </div>
        </div>
        <div className="size-16 bg-white rounded-[1.5rem] flex items-center justify-center text-primary border border-slate-100 animate-float shadow-xl shadow-slate-200/50">
          <span className="material-symbols-outlined text-[36px] transition-transform hover:scale-125 duration-500">sports_soccer</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 flex gap-4 border-b border-slate-100 mb-6 animate-slide-up delay-100">
        {[
          { id: 'confirmados', label: 'Confirmados', count: 14, icon: 'check_circle', color: 'text-primary' },
          { id: 'espera', label: 'Espera', count: 3, icon: 'schedule', color: 'text-amber-500' },
          { id: 'nao-vao', label: 'Não Vão', count: 5, icon: 'cancel', color: 'text-slate-400' }
        ].map(t => (
          <button 
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 pb-4 flex flex-col items-center gap-1.5 relative transition-all duration-300 ${tab === t.id ? 'opacity-100 scale-105' : 'opacity-40 grayscale hover:opacity-70 hover:scale-105'}`}
          >
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-[20px] ${t.color}`}>{t.icon}</span>
              <span className="text-[10px] font-black uppercase text-secondary tracking-widest">{t.label}</span>
            </div>
            <div className={`px-3 py-0.5 rounded-full text-[10px] font-black transition-all ${tab === t.id ? 'bg-primary/10 text-primary shadow-sm' : 'bg-slate-50 text-slate-400'}`}>
              {t.count}
            </div>
            {tab === t.id && <div className="absolute bottom-0 w-full h-1 bg-primary rounded-full animate-fade-in shadow-[0_0_8px_rgba(255,0,0,0.5)]"></div>}
          </button>
        ))}
      </div>

      <div className="px-6 mb-6 flex justify-between items-center animate-slide-up delay-200">
        <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">Jogadores Confirmados</h3>
        <button className="px-3 py-1.5 bg-slate-50 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:bg-primary/5 transition-all border border-slate-100">
          <span className="material-symbols-outlined text-[16px]">sort</span>
          Ranking
        </button>
      </div>

      <div className="px-6 space-y-3">
        {(tab === 'confirmados' ? confirmedPlayers : []).map((player, idx) => (
          <div 
            key={player.id}
            onClick={() => onNavigate('profile', player)}
            className="flex items-center gap-4 p-3 rounded-2xl list-item-hover group cursor-pointer bg-white border border-slate-100 shadow-sm animate-slide-in-right"
            style={{ animationDelay: `${idx * 80 + 300}ms` }}
          >
            <div className="relative">
              <div className="size-14 rounded-full p-0.5 border-2 border-slate-100 group-hover:border-primary/40 transition-all overflow-hidden bg-slate-50">
                <img src={player.avatar} className="size-full rounded-full object-cover transition-transform group-hover:scale-110" />
              </div>
              <div className="absolute -bottom-1 -right-1 size-6 bg-secondary border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-md">
                10
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-[15px] font-black text-secondary uppercase group-hover:text-primary transition-colors tracking-tight">{player.name}</h4>
                <span className="material-symbols-outlined text-amber-500 text-[16px]">verified</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className={`material-symbols-outlined text-[12px] ${i <= 4 ? 'text-primary' : 'text-slate-200'}`}>star</span>
                  ))}
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">{player.position}</span>
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
               <span className="material-symbols-outlined text-primary/60">chevron_right</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-32 left-0 w-full px-6 flex gap-3 z-40 animate-slide-up">
        <button className="flex-1 h-15 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-secondary font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all hover:bg-slate-50">
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Convidar
        </button>
        <button className="flex-[1.8] h-15 btn-primary rounded-2xl flex items-center justify-center gap-3 text-xs tracking-widest">
          <span className="material-symbols-outlined font-black">check</span>
          Confirmar Presença
        </button>
      </div>
    </div>
  );
};

export default PlayerListScreen;
