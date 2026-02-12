
import React, { memo } from 'react';
import { Screen } from '../types';

interface NavItem {
  id: Screen;
  icon: string;
  label: string;
  position: 'left' | 'center' | 'right';
}

interface BottomNavProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  const navItems: NavItem[] = [
    { id: 'home', icon: 'home', label: 'Início', position: 'left' },
    { id: 'players', icon: 'groups', label: 'Elenco', position: 'left' },
    { id: 'draw', icon: 'shuffle', label: 'Sorteio', position: 'center' },
    { id: 'scout', icon: 'leaderboard', label: 'Scout', position: 'right' },
    { id: 'profile', icon: 'person', label: 'Perfil', position: 'right' },
  ];

  const renderTab = (item: NavItem) => {
    const isActive = activeScreen === item.id;
    return (
      <li key={item.id} className="flex-1 max-w-[120px] mx-auto">
        <button
          onClick={() => onNavigate(item.id)}
          className={`w-full h-full flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative py-2 ${
            isActive ? 'text-primary' : 'text-slate-400 hover:text-secondary'
          }`}
          aria-label={item.label}
        >
          <span 
            className={`material-symbols-outlined text-[26px] sm:text-[30px] ${isActive ? 'font-bold scale-110' : ''}`} 
            style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
          >
            {item.icon}
          </span>
          <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap hidden sm:block ${isActive ? 'opacity-100' : 'opacity-60'}`}>
            {item.label}
          </span>
          {isActive && (
            <div className="absolute bottom-1 size-1.5 bg-primary rounded-full shadow-[0_0_10px_#E30613] animate-pulse"></div>
          )}
        </button>
      </li>
    );
  };

  const leftItems = navItems.filter(item => item.position === 'left');
  const rightItems = navItems.filter(item => item.position === 'right');
  const centerItem = navItems.find(item => item.position === 'center');

  return (
    <nav className="w-full px-4 sm:px-12 bg-white">
      <ul className="flex justify-between items-center h-16 sm:h-20 relative">
        <div className="flex flex-1 justify-around items-center">
          {leftItems.map(renderTab)}
        </div>

        {centerItem && (
          <li className="relative flex-shrink-0 mx-6 sm:mx-16">
            <div className="relative -top-6 sm:-top-8">
              <button 
                onClick={() => onNavigate(centerItem.id)}
                className={`size-16 sm:size-20 rounded-[1.8rem] flex items-center justify-center shadow-[0_12px_30px_rgba(227,6,19,0.3)] border-[6px] border-white active:scale-90 transition-all hover:rotate-6 hover:scale-105 ${
                  activeScreen === centerItem.id ? 'bg-secondary text-white' : 'bg-primary text-white'
                }`}
                title={centerItem.label}
                aria-label={centerItem.label}
              >
                <span className="material-symbols-outlined text-[32px] sm:text-[38px] font-black">
                  {centerItem.icon}
                </span>
              </button>
            </div>
          </li>
        )}

        <div className="flex flex-1 justify-around items-center">
          {rightItems.map(renderTab)}
        </div>
      </ul>
    </nav>
  );
};

export default memo(BottomNav);
