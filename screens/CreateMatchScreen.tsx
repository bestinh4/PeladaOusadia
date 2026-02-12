
import React, { useState } from 'react';
import { Screen } from '../types';

interface CreateMatchScreenProps {
  onNavigate: (screen: Screen) => void;
}

const CreateMatchScreen: React.FC<CreateMatchScreenProps> = ({ onNavigate }) => {
  const [matchType, setMatchType] = useState('Society');
  
  return (
    <div className="h-full bg-surface-gray overflow-y-auto no-scrollbar pb-32">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 sticky top-0 bg-surface-gray z-20">
        <button onClick={() => onNavigate('home')} className="size-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-900 active:scale-90 transition-transform">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-black italic text-[#1a0a0b]">Criar Partida</h1>
        <button className="size-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-900 relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2.5 size-2 bg-primary rounded-full border border-white"></span>
        </button>
      </header>

      <main className="px-6 space-y-8">
        {/* Type Selector */}
        <div className="flex p-1.5 bg-[#e8e2e2] rounded-2xl">
          {['Futsal', 'Society', 'Campo'].map(type => (
            <button
              key={type}
              onClick={() => setMatchType(type)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                matchType === type ? 'bg-white text-primary shadow-sm' : 'text-gray-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
           <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 ml-2 uppercase tracking-widest">Local da Partida</label>
              <div className="flex items-center bg-white rounded-2xl px-5 h-14 shadow-sm border border-transparent focus-within:border-primary/20 transition-all">
                <input className="flex-1 bg-transparent border-none focus:ring-0 text-base font-medium placeholder:text-gray-300" placeholder="Selecione o local (ex: Arena O&A)" />
                <span className="material-symbols-outlined text-primary">location_on</span>
              </div>
           </div>

           <div className="flex gap-4">
             <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-gray-900 ml-2 uppercase tracking-widest">Data</label>
                <div className="flex items-center bg-white rounded-2xl px-5 h-14 shadow-sm">
                  <input className="flex-1 bg-transparent border-none focus:ring-0 text-base font-medium placeholder:text-gray-300" placeholder="DD/MM" />
                  <span className="material-symbols-outlined text-gray-300">calendar_today</span>
                </div>
             </div>
             <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-gray-900 ml-2 uppercase tracking-widest">Horário</label>
                <div className="flex items-center bg-white rounded-2xl px-5 h-14 shadow-sm">
                  <input className="flex-1 bg-transparent border-none focus:ring-0 text-base font-medium placeholder:text-gray-300" placeholder="00:00" />
                  <span className="material-symbols-outlined text-gray-300">schedule</span>
                </div>
             </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 ml-2 uppercase tracking-widest">Tempo de Jogo</label>
              <div className="flex items-center bg-white rounded-2xl px-5 h-14 shadow-sm">
                <input className="flex-1 bg-transparent border-none focus:ring-0 text-base font-medium placeholder:text-gray-300" placeholder="ex: 60 min" />
                <span className="material-symbols-outlined text-gray-300">timer</span>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 ml-2 uppercase tracking-widest">Preço por Atleta</label>
              <div className="flex items-center bg-white rounded-2xl px-5 h-14 shadow-sm">
                <span className="text-gray-300 font-bold mr-1">R$</span>
                <input className="flex-1 bg-transparent border-none focus:ring-0 text-base font-medium placeholder:text-gray-300" placeholder="0,00" />
                <span className="material-symbols-outlined text-green-600">attach_money</span>
              </div>
           </div>

           <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="size-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                   <span className="material-symbols-outlined">sports_soccer</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-sm font-bold text-[#1a0a0b]">Trazer Colete?</span>
                   <span className="text-[10px] font-bold text-gray-400">Solicitar coletes ao local</span>
                 </div>
              </div>
              <div className="w-12 h-6 bg-gray-100 rounded-full relative p-1 cursor-pointer">
                 <div className="size-4 bg-white rounded-full shadow-sm transition-transform"></div>
              </div>
           </div>

           <button 
            onClick={() => onNavigate('home')}
            className="w-full h-14 bg-primary text-white rounded-2xl font-black italic tracking-wider shadow-lg shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-all mt-4"
           >
              Agendar Partida
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
           </button>
        </div>
      </main>
    </div>
  );
};

export default CreateMatchScreen;
