
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
      <li key={item.id} className="flex-1 max-w-[100px] mx-auto">
        <button
          onClick={() => onNavigate(item.id)}
          className={`w-full h-full flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative py-2 ${
            isActive ? 'text-primary' : 'text-slate-400 hover:text-secondary'
          }`}
          aria-label={item.label}
        >
          <span 
            className={`material-symbols-outlined text-[24px] sm:text-[28px] ${isActive ? 'font-bold scale-110' : ''}`} 
            style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
          >
            {item.icon}
          </span>
          <span className={`text-[8px] font-black uppercase tracking-[0.1em] whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-60'}`}>
            {item.label}
          </span>
          {isActive && (
            <div className="absolute bottom-0 size-1 bg-primary rounded-full shadow-[0_0_8px_#E30613] animate-pulse"></div>
          )}
        </button>
      </li>
    );
  };

  const leftItems = navItems.filter(item => item.position === 'left');
  const rightItems = navItems.filter(item => item.position === 'right');
  const centerItem = navItems.find(item => item.position === 'center');

  return (
    <nav className="w-full px-4 sm:px-10 bg-white shadow-[0_-5px_30px_rgba(0,0,0,0.05)]">
      <ul className="flex justify-between items-center h-16 sm:h-20 relative">
        <div className="flex flex-1 justify-around items-center">
          {leftItems.map(renderTab)}
        </div>

        {centerItem && (
          <li className="relative flex-shrink-0 mx-4 sm:mx-10">
            <div className="relative -top-6 sm:-top-8">
              <button 
                onClick={() => onNavigate(centerItem.id)}
                className={`size-14 sm:size-18 rounded-2xl flex items-center justify-center shadow-xl border-[4px] border-white active:scale-90 transition-all hover:scale-105 ${
                  activeScreen === centerItem.id ? 'bg-secondary text-white' : 'bg-primary text-white'
                }`}
                title={centerItem.label}
                aria-label={centerItem.label}
              >
                <span className="material-symbols-outlined text-[28px] sm:text-[32px] font-black">
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
