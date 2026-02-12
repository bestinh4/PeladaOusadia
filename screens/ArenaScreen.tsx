
import React from 'react';
import { Screen } from '../types';

interface ArenaScreenProps {
  onNavigate: (screen: Screen) => void;
}

const ArenaScreen: React.FC<ArenaScreenProps> = ({ onNavigate }) => {
  return (
    <div className="h-full bg-background overflow-y-auto no-scrollbar pb-32 pt-6">
      {/* Header */}
      <header className="flex items-center justify-between px-6 mb-8 animate-fade-in">
        <h1 className="text-xl font-black text-white">Pelada dos Amigos</h1>
        <button className="text-white opacity-80 hover:opacity-100 transition-all hover:scale-110 active:scale-90">
          <span className="material-symbols-outlined text-[24px]">settings</span>
        </button>
      </header>

      {/* Hero Section */}
      <div className="px-6 space-y-4">
        <div className="flex items-center justify-between animate-slide-up">
          <h2 className="text-2xl font-black text-white">Próxima Partida</h2>
          <span className="text-[10px] font-black text-primary tracking-widest uppercase animate-pulse">Em 3 Dias</span>
        </div>

        {/* Match Card */}
        <div className="stadium-bg rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group premium-card animate-slide-up delay-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="size-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Confirmado</span>
          </div>
          <h3 className="text-3xl font-black text-white italic tracking-tighter mb-1">Sábado, 24 Out</h3>
          <p className="text-4xl font-black text-primary italic mb-8">18:00</p>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between group-hover:bg-white/10 transition-all group-hover:scale-[1.02]">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <p className="text-xs font-black text-white">Arena Central</p>
                <p className="text-[9px] font-medium text-white/40">Campo 3 • Sintético</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-white/40 text-[18px]">open_in_new</span>
          </div>

          <div className="mt-8 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span className="text-white/40">Jogadores</span>
              <span className="text-white"><span className="text-primary">14</span> / 18</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary neon-glow transition-all duration-1000 ease-out" style={{ width: '75%' }}></div>
            </div>
            <p className="text-[9px] font-medium text-white/40">Faltam 4 para fechar o time!</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 mt-8 space-y-3 animate-slide-up delay-200">
        <button className="w-full h-15 btn-primary rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined font-bold">check_circle</span>
          Confirmar Presença
        </button>
        <button className="w-full h-15 bg-surface border border-white/5 text-white/60 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs active:scale-95 transition-all hover:bg-surface/80">
          <span className="material-symbols-outlined">cancel</span>
          Desistir
        </button>
      </div>

      {/* Status Card */}
      <div className="px-6 mt-6 animate-slide-up delay-300">
        <div className="bg-surface border border-white/5 rounded-3xl p-6 flex items-center justify-between premium-card">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="size-14 rounded-full bg-white/5 transition-transform group-hover:scale-110" />
              <div className="absolute -bottom-1 -right-1 size-6 bg-primary rounded-full border-4 border-surface flex items-center justify-center animate-scale-in">
                <span className="material-symbols-outlined text-background text-[12px] font-bold">check</span>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Seu Status</p>
              <p className="text-sm font-black text-white">Você está confirmado! ✅</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Saldo</p>
            <p className="text-lg font-black text-primary">R$ 20,00</p>
          </div>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="px-6 mt-6 grid grid-cols-2 gap-4 animate-slide-up delay-400">
        <div className="bg-surface border border-white/5 rounded-3xl p-6 space-y-4 premium-card hover:bg-surface/80">
          <span className="material-symbols-outlined text-primary text-[24px]">groups</span>
          <div>
            <p className="text-2xl font-black text-white">4</p>
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Vagas restantes</p>
          </div>
        </div>
        <div className="bg-surface border border-white/5 rounded-3xl p-6 space-y-4 premium-card hover:bg-surface/80">
          <span className="material-symbols-outlined text-primary text-[24px]">payments</span>
          <div>
            <p className="text-2xl font-black text-white">R$ 30</p>
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Custo por pessoa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArenaScreen;
