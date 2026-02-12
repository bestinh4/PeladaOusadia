
import React, { useMemo, useReducer } from 'react';
import { Player, Screen } from '../types';

interface DrawScreenProps {
  players: Player[];
  onNavigate: (screen: Screen) => void;
}

// --- Reducer Types & Initial State ---
interface TeamResult {
  name: string;
  players: Player[];
  average: number;
}

interface DrawState {
  numTeams: number;
  balanceLevels: boolean;
  teams: TeamResult[];
}

type DrawAction =
  | { type: 'SET_NUM_TEAMS'; count: number }
  | { type: 'TOGGLE_BALANCE' }
  | { type: 'SET_TEAMS'; teams: TeamResult[] };

const initialDrawState: DrawState = {
  numTeams: 2,
  balanceLevels: true,
  teams: [],
};

function drawReducer(state: DrawState, action: DrawAction): DrawState {
  switch (action.type) {
    case 'SET_NUM_TEAMS':
      return { ...state, numTeams: action.count };
    case 'TOGGLE_BALANCE':
      return { ...state, balanceLevels: !state.balanceLevels };
    case 'SET_TEAMS':
      return { ...state, teams: action.teams };
    default:
      return state;
  }
}

const DrawScreen: React.FC<DrawScreenProps> = ({ players, onNavigate }) => {
  const [state, dispatch] = useReducer(drawReducer, initialDrawState);
  const { numTeams, balanceLevels, teams } = state;

  const confirmedPlayers = useMemo(() => players.filter(p => p.confirmed), [players]);

  const handleDraw = () => {
    let pool = [...confirmedPlayers];
    if (pool.length === 0) return;

    pool = pool.sort(() => Math.random() - 0.5);

    const newTeams: TeamResult[] = Array.from({ length: numTeams }, (_, i) => ({
      name: `Time ${String.fromCharCode(65 + i)}`,
      players: [],
      average: 0,
    }));

    if (balanceLevels) {
      pool.sort((a, b) => b.rating - a.rating);
      pool.forEach((player, index) => {
        const cycle = Math.floor(index / numTeams);
        const position = index % numTeams;
        const teamIndex = cycle % 2 === 0 ? position : (numTeams - 1) - position;
        newTeams[teamIndex].players.push(player);
      });
    } else {
      pool.forEach((player, index) => {
        newTeams[index % numTeams].players.push(player);
      });
    }

    newTeams.forEach(team => {
      const sum = team.players.reduce((acc, p) => acc + p.rating, 0);
      team.average = team.players.length > 0 ? Number((sum / (team.players.length * 20)).toFixed(1)) : 0;
    });

    dispatch({ type: 'SET_TEAMS', teams: newTeams });
  };

  return (
    <div className="h-full bg-background flex flex-col relative">
      <header className="flex items-center justify-between px-6 py-6 sticky top-0 bg-white/90 backdrop-blur-md z-30 border-b border-slate-100 shrink-0">
        <button onClick={() => onNavigate('home')} className="size-10 bg-slate-50 text-secondary rounded-xl flex items-center justify-center hover:bg-slate-100 active:scale-90 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-xl font-black text-secondary italic">Sorteio de Times</h2>
        <button className="size-10 bg-slate-50 text-secondary rounded-xl flex items-center justify-center hover:bg-slate-100 active:scale-90 transition-all">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
        <div className="px-6 py-8 animate-slide-up">
          <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-4">Configuração</h3>
          
          <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-secondary">Número de Times</p>
                <p className="text-[10px] text-slate-400">{confirmedPlayers.length > 0 ? Math.floor(confirmedPlayers.length / numTeams) : 0} p/ time</p>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                <button onClick={() => dispatch({ type: 'SET_NUM_TEAMS', count: Math.max(2, numTeams - 1) })} className="size-8 bg-white border border-slate-200 rounded-xl text-secondary font-bold hover:bg-slate-50 transition-colors">-</button>
                <span className="text-lg font-black text-secondary w-4 text-center">{numTeams}</span>
                <button onClick={() => dispatch({ type: 'SET_NUM_TEAMS', count: Math.min(4, numTeams + 1) })} className="size-8 bg-secondary text-white rounded-xl font-bold hover:brightness-110 transition-all">+</button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-secondary flex items-center gap-2">
                  Equilibrar Nível
                  <span className="material-symbols-outlined text-amber-500 text-[14px]">star</span>
                </p>
                <p className="text-[10px] text-slate-400">Usar média técnica</p>
              </div>
              <button onClick={() => dispatch({ type: 'TOGGLE_BALANCE' })} className={`w-12 h-6 rounded-full relative transition-colors ${balanceLevels ? 'bg-primary' : 'bg-slate-200'}`}>
                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all shadow-sm ${balanceLevels ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-6 animate-slide-up delay-100">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Times Gerados</h3>
            <button className="text-[10px] font-black text-secondary/60 flex items-center gap-1 uppercase tracking-widest hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[14px]">share</span>
              WhatsApp
            </button>
          </div>

          {teams.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center shadow-inner">
              <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                <span className="material-symbols-outlined text-[32px]">shuffle</span>
              </div>
              <p className="text-xs text-slate-300 font-bold uppercase tracking-widest leading-relaxed">Prepare a lista e clique no <br/> botão abaixo para sortear</p>
            </div>
          ) : (
            <div className="space-y-6">
              {teams.map((team, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden animate-scale-in shadow-md hover:border-primary transition-all">
                  <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-secondary text-white rounded-xl flex items-center justify-center font-black italic shadow-lg shadow-secondary/20">{team.name.charAt(team.name.length-1)}</div>
                      <span className="text-sm font-black text-secondary uppercase italic">{team.name}</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-black text-secondary">{team.average}</span>
                      <span className="material-symbols-outlined text-amber-500 text-[12px]">star</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    {team.players.map(p => (
                      <div key={p.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={p.avatar} className="size-9 rounded-full bg-slate-100 border border-slate-200 object-cover" />
                          <span className="text-xs font-bold text-secondary uppercase tracking-tight">{p.name}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(i => (
                            <span key={i} className={`material-symbols-outlined text-[10px] ${i <= Math.round(p.rating/20) ? 'text-primary' : 'text-slate-100'}`}>star</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-10 left-0 w-full px-6 z-40 animate-slide-up pointer-events-none">
        <button 
          onClick={handleDraw}
          disabled={confirmedPlayers.length < numTeams}
          className="w-full h-15 btn-primary rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale shadow-2xl pointer-events-auto"
        >
          <span className="material-symbols-outlined font-black">shuffle</span>
          Gerar Times Equilibrados
        </button>
      </div>
    </div>
  );
};

export default DrawScreen;
