
import React, { useState } from 'react';
import { Screen } from '../types';
import { matchService } from '../services/matchService';

interface CreateMatchScreenProps {
  onNavigate: (screen: Screen) => void;
}

const CreateMatchScreen: React.FC<CreateMatchScreenProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: 'Arena Central',
    date: '',
    time: '',
    type: 'Society',
    price: 30,
    limit: 18
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time) {
      alert("Preencha data e hora!");
      return;
    }

    setLoading(true);
    try {
      await matchService.createMatch(formData);
      onNavigate('home');
    } catch (err: any) {
      alert("Erro ao criar partida: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="h-full bg-background overflow-y-auto no-scrollbar pb-32">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 sticky top-0 bg-white/90 backdrop-blur-md z-20 border-b border-slate-100">
        <button onClick={() => onNavigate('home')} className="size-10 bg-slate-50 rounded-xl flex items-center justify-center text-secondary active:scale-90 transition-transform">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-black italic text-secondary uppercase tracking-tighter">Criar Pelada</h1>
        <div className="size-10"></div>
      </header>

      <form onSubmit={handleSubmit} className="px-6 mt-8 space-y-8 animate-slide-up">
        {/* Type Selector */}
        <div className="flex p-1.5 bg-slate-100 rounded-2xl">
          {['Society', 'Futsal', 'Campo'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({...formData, type})}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                formData.type === type ? 'bg-white text-primary shadow-sm' : 'text-slate-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-[0.2em]">Local da Partida</label>
              <div className="flex items-center bg-white rounded-2xl px-5 h-14 shadow-sm border border-slate-100 focus-within:border-primary/20 transition-all">
                <input 
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-secondary placeholder:text-slate-300" 
                  placeholder="Arena Central" 
                />
                <span className="material-symbols-outlined text-primary">location_on</span>
              </div>
           </div>

           <div className="flex gap-4">
             <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-[0.2em]">Data</label>
                <div className="flex items-center bg-white rounded-2xl px-5 h-14 shadow-sm border border-slate-100">
                  <input 
                    required
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-secondary" 
                  />
                </div>
             </div>
             <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-[0.2em]">Horário</label>
                <div className="flex items-center bg-white rounded-2xl px-5 h-14 shadow-sm border border-slate-100">
                  <input 
                    required
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-secondary" 
                  />
                </div>
             </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-[0.2em]">Limite de Atletas</label>
              <div className="flex items-center bg-white rounded-2xl px-5 h-14 shadow-sm border border-slate-100">
                <input 
                  type="number"
                  value={formData.limit}
                  onChange={(e) => setFormData({...formData, limit: parseInt(e.target.value)})}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-secondary" 
                  placeholder="18" 
                />
                <span className="material-symbols-outlined text-slate-300">groups</span>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-[0.2em]">Preço por Atleta</label>
              <div className="flex items-center bg-white rounded-2xl px-5 h-14 shadow-sm border border-slate-100">
                <span className="text-slate-300 font-bold mr-1 text-sm">R$</span>
                <input 
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-secondary" 
                  placeholder="30" 
                />
                <span className="material-symbols-outlined text-success">payments</span>
              </div>
           </div>

           <button 
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-primary text-white rounded-[2rem] font-black italic tracking-wider shadow-xl shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all mt-6 disabled:opacity-50"
           >
              {loading ? 'Processando...' : 'Lançar Nova Pelada'}
              {!loading && <span className="material-symbols-outlined text-[20px]">send</span>}
           </button>
           <p className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-widest px-8">
             * Ao criar, as confirmações e pagamentos da partida anterior serão resetados.
           </p>
        </div>
      </form>
    </div>
  );
};

export default CreateMatchScreen;
