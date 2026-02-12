
import React from 'react';
import { Player, Screen } from '../types';

interface ProfileScreenProps {
  player: Player;
  players: Player[];
  onNavigate: (screen: Screen, data?: any) => void;
  onUpdateAvatar: (id: string, file: File | string) => Promise<void>;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ player, onNavigate }) => {
  return (
    <div className="h-full bg-background overflow-y-auto no-scrollbar pb-40">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 sticky top-0 bg-white/90 backdrop-blur-md z-30 border-b border-slate-100">
        <button onClick={() => onNavigate('home')} className="size-10 bg-slate-50 text-secondary rounded-xl flex items-center justify-center active:scale-90 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-black text-secondary italic">Atleta Elite</h2>
        <button className="size-10 bg-slate-50 text-secondary rounded-xl flex items-center justify-center active:scale-90 transition-all">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      {/* Profile Info */}
      <div className="flex flex-col items-center pt-8 mb-8 bg-white pb-8 rounded-b-[4rem] shadow-sm border-b border-slate-100">
        <div className="relative mb-6">
          <div className="size-36 rounded-full border-4 border-slate-100 p-1.5 shadow-xl relative">
             {/* Checkerboard border ring */}
             <div className="absolute inset-0 rounded-full opacity-10 checkerboard-pattern -m-1"></div>
             <img src={player.avatar} className="size-full rounded-full object-cover relative z-10 border-4 border-white" />
          </div>
          <div className="absolute bottom-1 right-1 size-10 bg-secondary rounded-full border-4 border-white flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white text-[18px] font-bold">verified</span>
          </div>
        </div>
        <h1 className="text-3xl font-black text-secondary uppercase italic tracking-tighter mb-1">{player.name}</h1>
        <div className="flex items-center gap-3">
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">{player.position}</span>
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Nível: Pro</span>
        </div>
      </div>

      {/* Stats Badges */}
      <div className="px-6 grid grid-cols-3 gap-4 mb-10 -mt-12 relative z-20">
        {[
          { val: player.goals || '24', label: 'Gols', color: 'bg-primary shadow-primary/20' },
          { val: '12', label: 'Assists', color: 'bg-secondary shadow-secondary/20' },
          { val: '45', label: 'Partidas', color: 'bg-white border border-slate-100' }
        ].map(s => (
          <div key={s.label} className={`rounded-[2.5rem] p-6 flex flex-col items-center justify-center shadow-lg ${s.color}`}>
            <span className={`text-3xl font-black mb-1 ${s.color.includes('white') ? 'text-secondary' : 'text-white'}`}>{s.val}</span>
            <span className={`text-[9px] font-black uppercase tracking-widest ${s.color.includes('white') ? 'text-slate-400' : 'text-white/60'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Skills Section */}
      <div className="px-6 mb-10 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-secondary italic">Atributos Técnicos</h3>
          <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <span className="text-[10px] font-black text-amber-600">4.9</span>
            <span className="material-symbols-outlined text-amber-500 text-[14px]">star</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
          {[
            { label: 'Velocidade', val: player.stats.pac, icon: 'bolt', color: 'bg-primary' },
            { label: 'Chute', val: player.stats.sho, icon: 'sports_soccer', color: 'bg-secondary' },
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

      {/* Footer Action */}
      <div className="fixed bottom-32 left-0 w-full px-6 z-40">
        <button className="w-full h-15 btn-primary rounded-2xl flex items-center justify-center gap-2 shadow-xl">
          <span className="material-symbols-outlined">edit</span>
          Editar Cadastro de Atleta
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;
