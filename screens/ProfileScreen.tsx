
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
      <header className="flex items-center justify-between px-6 py-6 sticky top-0 bg-background/80 backdrop-blur-xl z-30">
        <button onClick={() => onNavigate('home')} className="text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-black text-white">Perfil</h2>
        <button className="text-white">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      {/* Profile Info */}
      <div className="flex flex-col items-center pt-4 mb-8">
        <div className="relative mb-6">
          <div className="size-32 rounded-full border-4 border-primary/20 p-1.5 neon-glow">
            <img src={player.avatar} className="size-full rounded-full object-cover" />
          </div>
          <div className="absolute bottom-1 right-1 size-8 bg-surface rounded-full border-4 border-background flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[16px] font-bold">verified</span>
          </div>
        </div>
        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-1">{player.name}</h1>
        <div className="flex items-center gap-3">
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Meia-Atacante</span>
          <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Membro desde 2019</span>
        </div>
      </div>

      {/* Stats Badges */}
      <div className="px-6 grid grid-cols-3 gap-3 mb-10">
        {[
          { val: '24', label: 'Gols' },
          { val: '12', label: 'Assist.' },
          { val: '45', label: 'Jogos' }
        ].map(s => (
          <div key={s.label} className="bg-surface border border-white/5 rounded-[2rem] p-6 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white mb-1">{s.val}</span>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Skills Section */}
      <div className="px-6 mb-10 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white">Habilidades</h3>
          <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
            <span className="text-[10px] font-black text-primary">4.5</span>
            <span className="material-symbols-outlined text-primary text-[14px]">star</span>
          </div>
        </div>

        <div className="bg-surface border border-white/5 rounded-3xl p-8 space-y-8">
          {[
            { label: 'Velocidade', val: 85, icon: 'bolt' },
            { label: 'Chute', val: 70, icon: 'sports_soccer' },
            { label: 'Passe', val: 90, icon: 'swap_calls' }
          ].map(skill => (
            <div key={skill.label} className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">{skill.icon}</span>
                  <span className="text-sm font-black text-white">{skill.label}</span>
                </div>
                <span className="text-sm font-black text-white">{skill.val}</span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-primary neon-glow rounded-full" style={{ width: `${skill.val}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Matches */}
      <div className="px-6 space-y-6">
        <h3 className="text-xl font-black text-white">Partidas Recentes</h3>
        <div className="space-y-3">
          {[
            { opponent: 'Time Azul', result: 'Vitória', score: '5 - 3', date: '12 Out, 2023', color: 'text-primary' },
            { opponent: 'Time Branco', result: 'Derrota', score: '2 - 4', date: '05 Out, 2023', color: 'text-accent' },
            { opponent: 'Time Verde', result: 'Empate', score: '3 - 3', date: '28 Set, 2023', color: 'text-amber-400' }
          ].map((m, i) => (
            <div key={i} className="bg-surface border border-white/5 rounded-3xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-background rounded-2xl flex items-center justify-center text-white/20">
                   <span className="material-symbols-outlined">{m.result === 'Vitória' ? 'workspace_premium' : m.result === 'Derrota' ? 'cancel' : 'remove'}</span>
                </div>
                <div>
                  <p className="text-sm font-black text-white">vs. {m.opponent}</p>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{m.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-[11px] font-black uppercase tracking-widest ${m.color}`}>{m.result}</p>
                <p className="text-lg font-black text-white">{m.score}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action */}
      <div className="fixed bottom-32 left-0 w-full px-6 z-40">
        <button className="w-full h-15 btn-primary rounded-2xl flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">edit</span>
          Editar Perfil
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;
