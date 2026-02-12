
import React from 'react';
import { Screen } from '../types';

interface ArenaScreenProps {
  onNavigate: (screen: Screen) => void;
}

const ArenaScreen: React.FC<ArenaScreenProps> = ({ onNavigate }) => {
  return (
    <div className="h-full bg-[#f8f6f6] overflow-y-auto no-scrollbar pb-32">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 bg-white sticky top-0 z-30 shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] border-b border-gray-50">
        <div className="flex items-center gap-3 animate-fade-in-up">
          <div className="size-9 bg-navy rounded-xl flex items-center justify-center text-primary shadow-inner">
            <span className="material-symbols-outlined text-[22px]" style={{fontVariationSettings: "'FILL' 1"}}>grid_view</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-navy italic">ARENA</h2>
        </div>
        <div className="flex gap-2">
          <button className="size-10 rounded-full bg-surface-gray flex items-center justify-center text-gray-400 hover:text-primary transition-colors border border-gray-100 active:scale-90">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>
          <button className="size-10 rounded-full bg-surface-gray flex items-center justify-center text-gray-400 hover:text-navy transition-colors border border-gray-100 active:scale-90">
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </button>
        </div>
      </header>

      {/* Decorative Elite Line */}
      <div className="w-full h-1 bg-gradient-to-r from-primary via-navy to-secondary opacity-80"></div>

      {/* Countdown Section */}
      <div className="px-6 py-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { val: '00', label: 'Days' },
            { val: '01', label: 'Hours' },
            { val: '30', label: 'Mins' },
            { val: '00', label: 'Secs', highlight: true }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="w-full aspect-[4/5] bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-white flex items-center justify-center group overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className={`text-2xl font-black ${item.highlight ? 'text-primary animate-pulse' : 'text-navy'}`}>
                  {item.val}
                </span>
              </div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button className="flex-1 h-14 bg-navy text-white rounded-2xl flex items-center justify-center gap-3 font-black italic tracking-widest shadow-[0_15px_30px_rgba(9,18,44,0.3)] active:scale-95 transition-all group overflow-hidden relative">
             <div className="absolute inset-0 premium-shimmer opacity-20 group-hover:opacity-40 transition-opacity"></div>
             <span className="material-symbols-outlined">play_circle</span>
             START MATCH
          </button>
          <button className="size-14 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-center text-gray-400 hover:text-primary active:rotate-180 transition-all duration-500">
             <span className="material-symbols-outlined">restart_alt</span>
          </button>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className="px-6 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-xl font-black italic flex items-center gap-3 text-navy uppercase tracking-tighter">
          <span className="w-1.5 h-6 bg-primary rounded-full"></span>
          Team Analytics
        </h3>

        {/* Card 1: Attendance */}
        <div className="bg-white rounded-[2.2rem] p-7 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-white flex flex-col gap-5 relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all">
          <div className="flex justify-between items-start relative z-10">
            <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[28px]" style={{fontVariationSettings: "'FILL' 1"}}>groups</span>
            </div>
            <div className="px-3 py-1.5 bg-green-500/10 text-green-600 rounded-xl text-[10px] font-black flex items-center gap-1 border border-green-500/10">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +2 PRO
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Active Roster</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-navy italic">14</span>
              <span className="text-gray-300 font-black text-lg">/ 22</span>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
             <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{width: '63%'}}></div>
          </div>
          <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[140px] opacity-[0.04] rotate-12 group-hover:rotate-0 transition-transform duration-700">stadium</span>
        </div>

        {/* Card 2: Finance */}
        <div className="bg-white rounded-[2.2rem] p-7 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-white flex flex-col gap-5 relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all">
          <div className="flex justify-between items-start relative z-10">
            <div className="size-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[28px]" style={{fontVariationSettings: "'FILL' 1"}}>account_balance_wallet</span>
            </div>
            <div className="px-3 py-1.5 bg-green-500/10 text-green-600 rounded-xl text-[10px] font-black flex items-center gap-1 border border-green-500/10">
              <span className="material-symbols-outlined text-[14px]">bolt</span> STABLE
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Club Treasury</p>
            <p className="text-3xl font-black text-navy mt-1 tracking-tight">R$ 2.450,00</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Live Ledger Syncing</p>
          </div>
          <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[140px] opacity-[0.04] -rotate-12 group-hover:rotate-0 transition-transform duration-700">payments</span>
        </div>
      </div>
    </div>
  );
};

export default ArenaScreen;
