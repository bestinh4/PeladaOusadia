
import React, { memo } from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  const navItems = [
    { id: 'home', icon: 'home', label: 'Início' },
    { id: 'players', icon: 'groups', label: 'Elenco' },
    { id: 'scout', icon: 'leaderboard', label: 'Scout' },
    { id: 'profile', icon: 'person', label: 'Perfil' },
  ];

  return (
    <nav className="w-full bg-white border-t border-slate-100 pb-safe pt-2 px-4 sm:px-6 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
      <ul className="flex justify-between items-center h-16 relative">
        {/* Lado Esquerdo */}
        <div className="flex flex-1 justify-around">
          {navItems.slice(0, 2).map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <li key={item.id} className="flex-1 max-w-[80px]">
                <button
                  onClick={() => onNavigate(item.id as Screen)}
                  className={`w-full flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                    isActive ? 'text-primary scale-105' : 'text-slate-400'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[24px] sm:text-[26px] ${isActive ? 'font-bold' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {item.icon}
                  </span>
                  <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-1 size-1 bg-primary rounded-full shadow-[0_0_8px_#ff0000]"></div>
                  )}
                </button>
              </li>
            );
          })}
        </div>

        {/* Botão de Ação Central (Sorteio) */}
        <li className="relative flex-shrink-0 mx-2">
          <div className="relative -top-6">
            <button 
              onClick={() => onNavigate('draw')}
              className={`size-14 sm:size-16 rounded-2xl flex items-center justify-center shadow-[0_8px_25px_rgba(255,0,0,0.3)] border-[6px] border-background active:scale-90 transition-all hover:rotate-12 hover:scale-105 ${
                activeScreen === 'draw' ? 'bg-secondary text-white' : 'bg-primary text-white'
              }`}
              title="Sortear Times"
            >
              <span className="material-symbols-outlined text-[28px] sm:text-[32px] font-black">shuffle</span>
            </button>
          </div>
        </li>

        {/* Lado Direito */}
        <div className="flex flex-1 justify-around">
          {navItems.slice(2).map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <li key={item.id} className="flex-1 max-w-[80px]">
                <button
                  onClick={() => onNavigate(item.id as Screen)}
                  className={`w-full flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                    isActive ? 'text-primary scale-105' : 'text-slate-400'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[24px] sm:text-[26px] ${isActive ? 'font-bold' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {item.icon}
                  </span>
                  <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-1 size-1 bg-primary rounded-full shadow-[0_0_8px_#ff0000]"></div>
                  )}
                </button>
              </li>
            );
          })}
        </div>
      </ul>
    </nav>
  );
};

export default memo(BottomNav);
