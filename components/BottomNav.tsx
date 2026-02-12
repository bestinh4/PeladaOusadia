
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
    <nav className="absolute bottom-0 w-full bg-white border-t border-slate-100 pb-8 pt-3 px-6 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
      <ul className="flex justify-between items-end relative h-14">
        {/* Left Side Items */}
        {navItems.slice(0, 2).map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <li key={item.id} className="flex-1">
              <button
                onClick={() => onNavigate(item.id as Screen)}
                className={`w-full flex flex-col items-center gap-1 transition-all duration-300 ${
                  isActive ? 'text-primary scale-110' : 'text-slate-400 hover:text-secondary'
                }`}
              >
                <span className={`material-symbols-outlined text-[26px] ${isActive ? 'font-bold' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_#ff0000]"></div>
                )}
              </button>
            </li>
          );
        })}

        {/* Floating Action Button (Center) */}
        <li className="relative flex-1 flex justify-center">
          <button 
            onClick={() => onNavigate('draw')}
            className="absolute -top-12 size-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-[0_8px_25px_rgba(255,0,0,0.3)] border-[6px] border-background active:scale-90 transition-all hover:rotate-12 hover:scale-110"
          >
            <span className="material-symbols-outlined text-[32px] font-black">add</span>
          </button>
        </li>

        {/* Right Side Items */}
        {navItems.slice(2).map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <li key={item.id} className="flex-1">
              <button
                onClick={() => onNavigate(item.id as Screen)}
                className={`w-full flex flex-col items-center gap-1 transition-all duration-300 ${
                  isActive ? 'text-primary scale-110' : 'text-slate-400 hover:text-secondary'
                }`}
              >
                <span className={`material-symbols-outlined text-[26px] ${isActive ? 'font-bold' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_#ff0000]"></div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default memo(BottomNav);
