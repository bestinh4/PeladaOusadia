
import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  const navItems = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'players', icon: 'groups', label: 'Time' },
    { id: 'scout', icon: 'leaderboard', label: 'Scout' },
    { id: 'profile', icon: 'person', label: 'Perfil' },
  ];

  return (
    <nav className="absolute bottom-0 w-full bg-white dark:bg-[#1a0a0b] border-t border-gray-100 dark:border-white/5 pb-8 pt-3 px-6 shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.05)] z-50">
      <ul className="flex justify-between items-center relative">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id as Screen)}
                className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${
                  isActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <span className={`material-symbols-outlined text-[28px] ${isActive ? 'font-bold fill-current' : ''}`}>
                  {item.icon}
                </span>
                <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-3 w-1 h-1 bg-primary rounded-full"></span>
                )}
              </button>
            </li>
          );
        })}
        {/* Centered Floating Action Placeholder for Create Match Screen */}
        <li className="absolute left-1/2 -translate-x-1/2 -top-12">
           <button 
            onClick={() => onNavigate('create-match')}
            className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/40 border-4 border-surface-gray dark:border-gray-900 transition-transform active:scale-90"
           >
             <span className="material-symbols-outlined text-[32px]">add</span>
           </button>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNav;
