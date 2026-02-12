
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
      <li key={item.id} className="flex-1 max-w-[80px] mx-auto">
        <button
          onClick={() => onNavigate(item.id)}
          className={`w-full h-full flex flex-col items-center justify-center gap-1 transition-all duration-300 relative py-2 ${
            isActive ? 'text-primary' : 'text-slate-300'
          }`}
          aria-label={item.label}
        >
          <span 
            className={`material-symbols-outlined text-[22px] ${isActive ? 'font-bold' : ''}`} 
            style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
          >
            {item.icon}
          </span>
          <span className={`text-[7px] font-black uppercase tracking-widest whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-60'}`}>
            {item.label}
          </span>
          {isActive && (
            <div className="mt-0.5 size-1 bg-primary rounded-full shadow-[0_0_5px_#E30613]"></div>
          )}
        </button>
      </li>
    );
  };

  const leftItems = navItems.filter(item => item.position === 'left');
  const rightItems = navItems.filter(item => item.position === 'right');
  const centerItem = navItems.find(item => item.position === 'center');

  return (
    <nav className="w-full px-4 bg-white shadow-[0_-1px_15px_rgba(0,0,0,0.03)] border-t border-slate-50">
      <ul className="flex justify-between items-center h-16 relative">
        <div className="flex flex-1 justify-around items-center">
          {leftItems.map(renderTab)}
        </div>

        {centerItem && (
          <li className="relative flex-shrink-0 mx-2">
            <div className="relative -top-6">
              <button 
                onClick={() => onNavigate(centerItem.id)}
                className={`size-14 rounded-2xl flex items-center justify-center shadow-2xl border-[5px] border-white active:scale-90 transition-all ${
                  activeScreen === centerItem.id ? 'bg-secondary text-white' : 'bg-primary text-white rotate-0'
                }`}
                style={{ transform: activeScreen === centerItem.id ? 'none' : 'rotate(0deg)' }}
                title={centerItem.label}
              >
                {/* Ícone de Sorteio inclinado como no print */}
                <span className="material-symbols-outlined text-[28px] font-black rotate-45">
                  sync_alt
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
