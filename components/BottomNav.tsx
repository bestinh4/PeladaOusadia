
import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  // Mapping screens to navigation items as per user request
  const navItems = [
    { id: 'home', icon: 'home', label: 'Início' },
    { id: 'players', icon: 'groups', label: 'Elenco' },
    { id: 'scout', icon: 'leaderboard', label: 'Scout' },
    { id: 'profile', icon: 'person', label: 'Perfil' },
  ];

  return (
    <nav className="absolute bottom-0 w-full bg-[#16211c] border-t border-white/5 pb-8 pt-3 px-6 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <ul className="flex justify-between items-end relative h-14">
        {/* Left Side Items */}
        {navItems.slice(0, 2).map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <li key={item.id} className="flex-1">
              <button
                onClick={() => onNavigate(item.id as Screen)}
                className={`w-full flex flex-col items-center gap-1 transition-all duration-300 ${
                  isActive ? 'text-[#00ff84] scale-110' : 'text-gray-500'
                }`}
              >
                <span className={`material-symbols-outlined text-[26px] ${isActive ? 'font-bold' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-2 w-1 h-1 bg-[#00ff84] rounded-full shadow-[0_0_8px_#00ff84]"></div>
                )}
              </button>
            </li>
          );
        })}

        {/* Floating Action Button (Center) */}
        <li className="relative flex-1 flex justify-center">
          <button 
            onClick={() => onNavigate('draw')}
            className="absolute -top-10 size-15 bg-[#00ff84] text-[#0d1310] rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(0,255,132,0.4)] border-[6px] border-[#0d1310] active:scale-90 transition-all hover:rotate-90"
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
                  isActive ? 'text-[#00ff84] scale-110' : 'text-gray-500'
                }`}
              >
                <span className={`material-symbols-outlined text-[26px] ${isActive ? 'font-bold' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-2 w-1 h-1 bg-[#00ff84] rounded-full shadow-[0_0_8px_#00ff84]"></div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
