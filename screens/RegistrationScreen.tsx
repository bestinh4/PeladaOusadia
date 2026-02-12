
import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { playerService } from '../services/playerService';

interface RegistrationScreenProps {
  user: User;
  onComplete: () => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ user, onComplete }) => {
  const [name, setName] = useState(user.displayName || '');
  const [position, setPosition] = useState<'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward'>('Midfielder');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Por favor, informe seu nome.");
    
    setLoading(true);
    try {
      await playerService.createPlayerProfile(user, name, position);
      onComplete();
    } catch (err: any) {
      alert("Erro ao criar perfil: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col items-center justify-center px-8 py-12 relative overflow-y-auto no-scrollbar">
      <div className="absolute inset-0 opacity-[0.03] checkerboard-pattern pointer-events-none"></div>
      
      <div className="w-full max-w-[360px] text-center animate-scale-in">
        <div className="size-24 bg-primary rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-8 rotate-3">
          <span className="material-symbols-outlined text-[48px] text-white">person_add</span>
        </div>
        
        <h1 className="text-3xl font-black text-secondary italic uppercase tracking-tighter mb-2">Quase lá!</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10 leading-relaxed">Complete seu perfil de atleta para entrar em campo.</p>

        <form onSubmit={handleRegister} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome de Guerra</label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Diogo Camargo"
              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold text-secondary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Posição Principal</label>
            <div className="grid grid-cols-2 gap-3">
              {(['Goalkeeper', 'Defender', 'Midfielder', 'Forward'] as const).map(pos => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setPosition(pos)}
                  className={`h-12 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                    position === pos ? 'bg-secondary text-white border-secondary shadow-lg' : 'bg-white text-slate-400 border-slate-100'
                  }`}
                >
                  {pos === 'Goalkeeper' ? 'Goleiro' : pos === 'Defender' ? 'Zagueiro' : pos === 'Midfielder' ? 'Meio' : 'Atacante'}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
          >
            {loading ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
              <>
                <span>Entrar no Elenco</span>
                <span className="material-symbols-outlined text-[20px]">stadium</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationScreen;
