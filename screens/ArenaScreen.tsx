
import React from 'react';
import { Screen } from '../types';

interface ArenaScreenProps {
  onNavigate: (screen: Screen) => void;
}

const ArenaScreen: React.FC<ArenaScreenProps> = ({ onNavigate }) => {
  return (
    <div className="h-full bg-surface-gray overflow-y-auto no-scrollbar pb-32">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 bg-white sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#1a0a0b]">ARENA</h2>
        </div>
        <div className="flex gap-2">
          <button className="size-10 rounded-full bg-surface-gray flex items-center justify-center text-gray-600">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>
          <button className="size-10 rounded-full bg-surface-gray flex items-center justify-center text-gray-600">
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </button>
        </div>
      </header>

      {/* Decorative Strip */}
      <div className="w-full h-1.5 bg-gradient-to-r from-primary via-white to-secondary opacity-60"></div>

      {/* Countdown Section */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { val: '00', label: 'Days' },
            { val: '01', label: 'Hours' },
            { val: '30', label: 'Mins' },
            { val: '00', label: 'Secs', highlight: true }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="w-full aspect-[4/5] bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                <span className={`text-2xl font-bold ${item.highlight ? 'text-primary animate-pulse' : 'text-gray-900'}`}>
                  {item.val}
                </span>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button className="flex-1 h-14 bg-primary text-white rounded-full flex items-center justify-center gap-2 font-bold shadow-lg shadow-primary/25 active:scale-95 transition-transform">
             <span className="material-symbols-outlined">play_arrow</span>
             START MATCH
          </button>
          <button className="size-14 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-600 active:rotate-180 transition-all">
             <span className="material-symbols-outlined">restart_alt</span>
          </button>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className="px-6 space-y-6">
        <h3 className="text-2xl font-black italic flex items-center gap-3 text-[#1a0a0b]">
          <span className="w-1.5 h-6 bg-primary rounded-full"></span>
          Dashboard
        </h3>

        {/* Card 1 */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50 flex flex-col gap-4 relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <div className="p-3 bg-primary/5 rounded-2xl text-primary">
              <span className="material-symbols-outlined">directions_run</span>
            </div>
            <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +2
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Atletas Confirmados</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl font-black text-[#1a0a0b]">14</span>
              <span className="text-gray-300 font-bold">/ 22</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
             <div className="h-full bg-primary" style={{width: '63%'}}></div>
          </div>
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform">groups</span>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50 flex flex-col gap-4 relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +5%
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Caixa Financeiro</p>
            <p className="text-3xl font-black text-[#1a0a0b] mt-1">R$ 2.450,00</p>
          </div>
          <p className="text-[10px] text-gray-300 font-bold">Updated just now</p>
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-[0.03] -rotate-12 group-hover:rotate-0 transition-transform">payments</span>
        </div>
      </div>
    </div>
  );
};

export default ArenaScreen;
