
import React, { useState } from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState<{ code: string; message: string; domain?: string } | null>(null);

  const handleGoogleLogin = async () => {
    if (isAuthenticating || loginSuccess) return;
    
    setIsAuthenticating(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setLoginSuccess(true);
      setTimeout(() => {
        onLogin();
      }, 500);
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError({
        code: err.code || 'unknown',
        message: "Falha na autenticação. Tente novamente."
      });
      setIsAuthenticating(false);
    }
  };

  return (
    <div className={`h-full flex flex-col items-center justify-center bg-white relative overflow-y-auto no-scrollbar py-10 px-6 transition-all duration-500 ${loginSuccess ? 'animate-fade-out scale-105' : ''}`}>
      <div className="absolute inset-0 opacity-[0.03] kockasti-pattern pointer-events-none"></div>
      
      <div className="w-full max-w-[380px] bg-white rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,81,158,0.15)] p-10 flex flex-col items-center gap-8 relative z-10 animate-scale-in border border-slate-100">
        
        <div className="relative group">
          <div className="size-28 bg-secondary rounded-[2.5rem] flex items-center justify-center shadow-2xl relative overflow-hidden transition-all duration-500 group-hover:rotate-6">
             <div className="absolute inset-0 opacity-10 kockasti-pattern scale-75"></div>
             <span className="material-symbols-outlined text-[56px] text-white z-10">sports_soccer</span>
          </div>
          {loginSuccess && (
            <div className="absolute -top-2 -right-2 size-10 bg-success rounded-full flex items-center justify-center border-4 border-white animate-scale-in shadow-lg">
              <span className="material-symbols-outlined text-white text-[24px] font-black">check</span>
            </div>
          )}
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-black italic tracking-tighter text-secondary uppercase leading-none">
            Ousadia <span className="text-primary">&</span> Alegria
          </h1>
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mt-3">Elite Manager • Croácia Edition</p>
        </div>

        <div className="w-full space-y-4">
          {error && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl text-[10px] font-bold text-primary text-center">
              {error.message}
            </div>
          )}

          <button 
            onClick={handleGoogleLogin}
            disabled={isAuthenticating || loginSuccess}
            className={`w-full h-16 bg-secondary text-white shadow-xl rounded-2xl flex items-center justify-center gap-4 active:scale-95 transition-all ${isAuthenticating ? 'opacity-50' : ''} ${loginSuccess ? 'bg-success shadow-success/20' : ''}`}
          >
             {isAuthenticating && !loginSuccess ? (
               <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
             ) : loginSuccess ? (
               <span className="material-symbols-outlined font-black">check_circle</span>
             ) : (
               <span className="material-symbols-outlined">login</span>
             )}
             <span className="font-bold text-sm tracking-wide">
               {loginSuccess ? 'Acesso Concedido' : 'Entrar com Google'}
             </span>
          </button>
          
          <p className="text-[9px] text-slate-300 text-center font-bold px-4 leading-relaxed">
             Entre para gerenciar seu elenco com a precisão dos craques croatas.
          </p>
        </div>

        <div className="text-[8px] text-slate-300 font-bold uppercase tracking-widest text-center mt-4">
           © 2024 O&A Sports Management
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
