
import React, { useState, useMemo } from 'react';
import { Player, Screen } from '../types';

interface ScoutScreenProps {
  players: Player[];
  onNavigate: (screen: Screen, data?: any) => void;
}

type RankingType = 'goals' | 'assists' | 'defense';

const ScoutScreen: React.FC<ScoutScreenProps> = ({ players, onNavigate }) => {
  const [rankingType, setRankingType] = useState<RankingType>('goals');
  const CROATIA_LOGO = "https://upload.wikimedia.org/wikipedia/pt/c/cf/Croatia_football_federation.png";

  const rankedPlayers = useMemo(() => {
    let list = [...players];
    if (rankingType === 'goals') {
      return list.sort((a, b) => b.goals - a.goals);
    } else if (rankingType === 'assists') {
      return list.sort((a, b) => b.assists - a.assists);
    } else {
      // Defesa: Apenas goleiros, ordenado por MENOR número de gols sofridos
      return list
        .filter(p => p.position === 'Goalkeeper')
        .sort((a, b) => a.goalsConceded - b.goalsConceded);
    }
  }, [players, rankingType]);

  const getMetric = (p: Player) => {
    if (rankingType === 'goals') return p.goals;
    if (rankingType === 'assists') return p.assists;
    return p.goalsConceded;
  };

  const getLabel = () => {
    if (rankingType === 'goals') return 'Gols';
    if (rankingType === 'assists') return 'Assists';
    return 'Gols Sofridos';
  };

  return (
    <div className="h-full bg-background overflow-y-auto no-scrollbar pb-32">
      <header className="px-8 pt-12 pb-16 bg-secondary relative overflow-hidden sticky top-0 z-40">
        <div className="absolute inset-0 opacity-[0.05] kockasti-pattern pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/90"></div>
        
        <div className="flex items-center justify-between mb-8 relative z-10">
           <button onClick={() => onNavigate('home')} className="size-11 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white active:scale-90 border border-white/10">
             <span className="material-symbols-outlined">chevron_left</span>
           </button>
           <img src={CROATIA_LOGO} alt="HNS" className="size-10 object-contain" />
           <div className="size-11"></div>
        </div>

        <div className="relative z-10 text-center animate-slide-up">
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-tight mb-2">Hall Of <span className="text-primary">Fame</span></h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Scout Oficial O&A</p>
        </div>
      </header>

      <div className="flex gap-2 px-6 py-4 bg-background/80 backdrop-blur-xl sticky top-[168px] z-30 border-b border-slate-100 shadow-sm">
        {[
          { id: 'goals', label: 'Artilheiros', icon: 'sports_soccer' },
          { id: 'assists', label: 'Garçons', icon: 'assistant' },
          { id: 'defense', label: 'Paredões', icon: 'shield' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setRankingType(tab.id as RankingType)}
            className={`flex-1 h-11 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all border ${
              rankingType === tab.id ? 'bg-secondary text-white border-secondary shadow-lg' : 'bg-white text-slate-400 border-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span className="hidden xs:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="px-6 py-8 space-y-4">
        {rankedPlayers.length === 0 ? (
          <div className="py-20 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest">Sem registros nesta categoria</div>
        ) : (
          rankedPlayers.map((player, idx) => (
            <div 
              key={player.id}
              onClick={() => onNavigate('profile', player)}
              className={`flex items-center justify-between p-5 bg-white rounded-[2rem] border transition-all pro-shadow animate-slide-up ${idx < 3 ? 'border-primary border-2' : 'border-slate-100'}`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex items-center gap-4">
                 <div className="relative shrink-0">
                   <img src={player.avatar} className="size-16 rounded-[1.2rem] border-2 border-slate-50 object-cover" alt={player.name} />
                   <div className={`absolute -top-2 -left-2 size-8 rounded-xl flex items-center justify-center text-[12px] font-black text-white shadow-xl z-10 ${idx < 3 ? 'bg-primary' : 'bg-secondary'}`}>
                     {idx + 1}
                   </div>
                 </div>
                 <div>
                   <h4 className="text-[16px] font-black text-secondary uppercase italic tracking-tighter truncate leading-none mb-1">{player.name}</h4>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{player.position}</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-4xl font-black italic tracking-tighter leading-none text-secondary">{getMetric(player)}</p>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{getLabel()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScoutScreen;
