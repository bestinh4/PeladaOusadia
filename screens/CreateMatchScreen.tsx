
import React, { useState } from 'react';
import { Screen } from '../types';
import { matchService } from '../services/matchService';

interface CreateMatchScreenProps {
  onNavigate: (screen: Screen) => void;
}

const CreateMatchScreen: React.FC<CreateMatchScreenProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    location: 'Arena Central',
    date: '',
    time: '',
    type: 'Society',
    price: 30,
    limit: 14 // Atualizado para o padrão 7x7 (2 times)
  });

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time) {
      alert("Preencha data e hora!");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmCreate = async () => {
    setLoading(true);
    setShowConfirm(false);
    try {
      await matchService.createMatch(formData);
      onNavigate('home');
    } catch (err: any) {
      alert("Erro ao criar partida: " + err.message);
      setLoading(false);
    }
  };
  
  return (
    <div className="h-full bg-background overflow-y-auto no-scrollbar pb-32">
      {/* Header Optimized */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 sticky top-0 bg-white/90 backdrop-blur-md z-30 border-b border-slate-100 shrink-0">
        <button onClick={() => onNavigate('home')} className="size-9 sm:size-10 bg-slate-50 rounded-xl flex items-center justify-center text-secondary active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-[20px] sm:text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-lg sm:text-xl font-black italic text-secondary uppercase tracking-tighter">Criar Pelada</h1>
        <div className="size-9 sm:size-10"></div>
      </header>

      <form onSubmit={handleOpenConfirm} className="px-4 sm:px-6 mt-6 sm:mt-8 space-y-6 sm:space-y-8 animate-slide-up">
        {/* Type Selector Balanced */}
        <div className="flex p-1.5 bg-slate-100 rounded-2xl shadow-inner">
          {['Society', 'Futsal', 'Campo'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({...formData, type})}
              className={`flex-1 py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                formData.type === type ? 'bg-white text-primary shadow-sm border border-slate-50' : 'text-slate-400 hover:text-secondary'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Form Fields Pixel-Perfect */}
        <div className="space-y-5 sm:space-y-6">
           <div className="space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 ml-2 uppercase tracking-[0.2em]">Local da Partida</label>
              <div className="flex items-center bg-white rounded-2xl px-5 h-12 sm:h-14 shadow-sm border border-slate-100 focus-within:border-primary/40 focus-within:shadow-md transition-all">
                <input 
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-secondary placeholder:text-slate-300" 
                  placeholder="Arena Central" 
                />
                <span className="material-symbols-outlined text-primary text-[20px] sm:text-[24px]">location_on</span>
              </div>
           </div>

           <div className="flex gap-4">
             <div className="flex-1 space-y-2">
                <label className="text-[9px] sm:text-[10px] font-black text-slate-400 ml-2 uppercase tracking-[0.2em]">Data</label>
                <div className="flex items-center bg-white rounded-2xl px-4 sm:px-5 h-12 sm:h-14 shadow-sm border border-slate-100 focus-within:border-primary/40 transition-all">
                  <input 
                    required
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-xs sm:text-sm font-bold text-secondary" 
                  />
                </div>
             </div>
             <div className="flex-1 space-y-2">
                <label className="text-[9px] sm:text-[10px] font-black text-slate-400 ml-2 uppercase tracking-[0.2em]">Horário</label>
                <div className="flex items-center bg-white rounded-2xl px-4 sm:px-5 h-12 sm:h-14 shadow-sm border border-slate-100 focus-within:border-primary/40 transition-all">
                  <input 
                    required
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-xs sm:text-sm font-bold text-secondary" 
                  />
                </div>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] font-black text-slate-400 ml-2 uppercase tracking-[0.2em]">Limite de Atletas</label>
                <div className="flex items-center bg-white rounded-2xl px-5 h-12 sm:h-14 shadow-sm border border-slate-100 focus-within:border-primary/40 transition-all">
                  <input 
                    type="number"
                    value={formData.limit}
                    onChange={(e) => setFormData({...formData, limit: parseInt(e.target.value) || 0})}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-secondary" 
                    placeholder="14" 
                  />
                  <span className="material-symbols-outlined text-slate-300 text-[20px] sm:text-[22px]">groups</span>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] font-black text-slate-400 ml-2 uppercase tracking-[0.2em]">Preço (R$)</label>
                <div className="flex items-center bg-white rounded-2xl px-5 h-12 sm:h-14 shadow-sm border border-slate-100 focus-within:border-primary/40 transition-all">
                  <input 
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-secondary" 
                    placeholder="30" 
                  />
                  <span className="material-symbols-outlined text-success text-[20px] sm:text-[22px]">payments</span>
                </div>
             </div>
           </div>

           <div className="pt-4">
             <button 
              type="submit"
              disabled={loading}
              className="w-full h-14 sm:h-16 bg-primary text-white rounded-2xl sm:rounded-[2rem] font-black italic tracking-wider shadow-xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 hover:brightness-110 transition-all disabled:opacity-50 disabled:grayscale"
             >
                {loading ? (
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="text-sm sm:text-base uppercase">Lançar Nova Pelada</span>
                    <span className="material-symbols-outlined text-[20px] sm:text-[22px]">send</span>
                  </>
                )}
             </button>
           </div>
           
           <p className="text-[8px] sm:text-[9px] text-center font-bold text-slate-400 uppercase tracking-[0.15em] px-4 sm:px-8 leading-relaxed">
             * Atenção: Criar uma nova partida encerrará a anterior e resetará todas as presenças.
           </p>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowConfirm(false)}></div>
          <div className="bg-white w-full max-w-[360px] rounded-[2.5rem] p-8 relative z-10 shadow-2xl animate-scale-in border border-slate-100">
            <div className="size-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[32px] font-black">sports_soccer</span>
            </div>
            
            <h2 className="text-xl font-black text-secondary uppercase italic text-center mb-6 leading-tight">Confirmar Lançamento?</h2>
            
            <div className="space-y-4 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Local</span>
                <span className="text-secondary">{formData.location}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Data e Hora</span>
                <span className="text-secondary">{formData.date} às {formData.time}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Capacidade</span>
                <span className="text-secondary">{formData.limit} Atletas</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Valor</span>
                <span className="text-success font-black">R$ {formData.price},00</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowConfirm(false)}
                className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmCreate}
                className="h-12 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                Lançar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateMatchScreen;
