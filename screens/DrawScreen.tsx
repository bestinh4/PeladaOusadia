
import React, { useMemo, useReducer, useEffect } from 'react';
import { Player, Screen } from '../types';

interface DrawScreenProps {
  players: Player[];
  onNavigate: (screen: Screen) => void;
}

interface TeamResult {
  name: string;
  players: Player[];
  average: number;
}

interface DrawState {
  numTeams: number;
  teams: TeamResult[];
}

type DrawAction =
  | { type: 'SET_NUM_TEAMS'; count: number }
  | { type: 'SET_TEAMS'; teams: TeamResult[] };

const initialDrawState: DrawState = {
  numTeams: 2,
  teams: [],
};

function drawReducer(state: DrawState, action: DrawAction): DrawState {
  switch (action.type) {
    case 'SET_NUM_TEAMS':
      return { ...state, numTeams: action.count };
    case 'SET_TEAMS':
      return { ...state, teams: action.teams };
    default:
      return state;
  }
}

const DrawScreen: React.FC<DrawScreenProps> = ({ players, onNavigate }) => {
  const [state, dispatch] = useReducer(drawReducer, initialDrawState);
  const { numTeams, teams } = state;

  const confirmedPlayers = useMemo(() => players.filter(p => p.confirmed), [players]);

  // Sugere automaticamente o número de times baseado no mini campo 7x7
  useEffect(() => {
    if (confirmedPlayers.length > 0) {
      const suggested = Math.max(2, Math.floor(confirmedPlayers.length / 7));
      dispatch({ type: 'SET_NUM_TEAMS', count: suggested });
    }
  }, [confirmedPlayers.length]);

  const handleDraw = () => {
    let pool = [...confirmedPlayers];
    if (pool.length < numTeams * 6) { // Pelo menos 6 jogadores por time (permitindo time sem goleiro)
      alert(`Poucos jogadores para ${numTeams} times. Cada time deve ter pelo menos 6 jogadores de linha.`);
      return;
    }

    // Separa goleiros dos jogadores de linha
    const gks = pool.filter(p => p.position === 'Goalkeeper').sort(() => Math.random() - 0.5);
    const outfield = pool.filter(p => p.position !== 'Goalkeeper').sort((a, b) => b.rating - a.rating);

    const newTeams: TeamResult[] = Array.from({ length: numTeams }, (_, i) => ({
      name: `Time ${String.fromCharCode(65 + i)}`,
      players: [],
      average: 0,
    }));

    // Distribui goleiros primeiro (um por time até acabarem)
    gks.forEach((gk, index) => {
      if (index < numTeams) {
        newTeams[index].players.push(gk);
      } else {
        // Se sobrarem goleiros, viram jogadores de linha no sorteio (fallback)
        outfield.push(gk);
      }
    });

    // Sorteio equilibrado dos jogadores de linha (Serpente / Snake draft)
    outfield.sort((a, b) => b.rating - a.rating).forEach((player, index) => {
      const cycle = Math.floor(index / numTeams);
      const position = index % numTeams;
      const teamIndex = cycle % 2 === 0 ? position : (numTeams - 1) - position;
      
      // Limite de 7 por time (Regra do Mini Campo)
      if (newTeams[teamIndex].players.length < 7) {
        newTeams[teamIndex].players.push(player);
      } else {
        // Se transbordar (excesso de jogadores), tenta colocar em outro time que tenha vaga
        const availableTeam = newTeams.find(t => t.players.length < 7);
        if (availableTeam) availableTeam.players.push(player);
      }
    });

    newTeams.forEach(team => {
      const sum = team.players.reduce((acc, p) => acc + p.rating, 0);
      team.average = team.players.length > 0 ? Number((sum / (team.players.length * 20)).toFixed(1)) : 0;
    });

    dispatch({ type: 'SET_TEAMS', teams: newTeams });
  };

  const handleShare = () => {
    if (teams.length === 0) return;
    
    let text = "*⚽ ESCALAÇÃO MINI CAMPO (7x7) *\n\n";
    teams.forEach(t => {
      const hasGk = t.players.some(p => p.position === 'Goalkeeper');
      text += `*${t.name.toUpperCase()}* ${!hasGk ? '_(Sem Goleiro)_' : ''}\n`;
      t.players.forEach(p => {
        text += `- ${p.name} (${p.position === 'Goalkeeper' ? 'Goleiro' : 'Linha'})\n`;
      });
      text += "\n";
    });
    text += "_Gerado via Vatreni App_";

    navigator.clipboard.writeText(text);
    alert("Escalação copiada! Agora é só colar no WhatsApp do grupo. 🚀");
  };

  return (
    <div className="h-full bg-background flex flex-col relative">
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 sticky top-0 bg-white/90 backdrop-blur-md z-30 border-b border-slate-100 shrink-0">
        <button onClick={() => onNavigate('home')} className="size-9 sm:size-10 bg-slate-50 text-secondary rounded-xl flex items-center justify-center active:scale-90 transition-all">
          <span className="material-symbols-outlined text-[20px] sm:text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-lg sm:text-xl font-black text-secondary italic tracking-tighter">Sorteio 7x7</h2>
        <div className="size-9 sm:size-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-36">
        <div className="px-4 sm:px-6 py-6 sm:py-8 animate-slide-up">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-black text-secondary uppercase">Quantidade de Times</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">{confirmedPlayers.length} Atletas • Mini Campo</p>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 bg-slate-50 p-1.5 sm:p-2 rounded-2xl border border-slate-100">
                <button onClick={() => dispatch({ type: 'SET_NUM_TEAMS', count: Math.max(2, numTeams - 1) })} className="size-8 bg-white border border-slate-200 rounded-xl text-secondary font-black active:scale-90 transition-all">-</button>
                <span className="text-base sm:text-lg font-black text-secondary w-4 text-center">{numTeams}</span>
                <button onClick={() => dispatch({ type: 'SET_NUM_TEAMS', count: Math.min(6, numTeams + 1) })} className="size-8 bg-secondary text-white rounded-xl font-black active:scale-90 transition-all">+</button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 space-y-6 animate-slide-up delay-100">
          {teams.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center shadow-inner">
              <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                <span className="material-symbols-outlined text-[32px]">shuffle</span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-300 font-black uppercase tracking-widest leading-relaxed">O sorteio prioriza goleiros.<br/>Se faltar, o time fica com 6 jogadores.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button onClick={handleShare} className="text-[10px] font-black text-success flex items-center gap-2 bg-success/5 px-4 py-2 rounded-xl">
                  <span className="material-symbols-outlined text-[18px]">share</span> Compartilhar
                </button>
              </div>
              {teams.map((team, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-[2.2rem] overflow-hidden animate-scale-in shadow-md">
                  <div className="px-6 py-4 flex items-center justify-between bg-slate-50/50">
                    <span className="text-sm font-black text-secondary uppercase italic tracking-tight">{team.name}</span>
                    {!team.players.some(p => p.position === 'Goalkeeper') && (
                      <span className="text-[8px] font-black bg-primary text-white px-2 py-0.5 rounded">SEM GOLEIRO</span>
                    )}
                  </div>
                  <div className="p-5 space-y-3">
                    {team.players.map(p => (
                      <div key={p.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={p.avatar} className="size-8 rounded-full border border-slate-100" />
                          <span className={`text-xs font-bold ${p.position === 'Goalkeeper' ? 'text-primary' : 'text-secondary'}`}>{p.name}</span>
                        </div>
                        <span className="text-[8px] font-black text-slate-300 uppercase">{p.position === 'Goalkeeper' ? 'GK' : 'Linha'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-0 w-full px-4 sm:px-6 z-40 pointer-events-none">
        <button 
          onClick={handleDraw}
          className="w-full h-16 bg-primary text-white rounded-2xl flex items-center justify-center gap-3 shadow-2xl pointer-events-auto active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined font-black">shuffle</span>
          <span className="text-sm uppercase tracking-widest font-black">Gerar Escalação</span>
        </button>
      </div>
    </div>
  );
};

export default DrawScreen;
