
import React, { useState } from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

interface LoginScreenProps {
  onLogin: () => void;
  onDemoMode: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onDemoMode }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<{ code: string; message: string; domain?: string } | null>(null);

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (err: any) {
      console.error("Auth Error:", err);
      
      let errorData = {
        code: err.code || 'unknown',
        message: err.message || "Falha ao entrar. Tente novamente."
      };

      if (err.code === 'auth/unauthorized-domain') {
        setError({
          ...errorData,
          domain: window.location.hostname,
          message: "Este domínio não está autorizado no Firebase Console."
        });
      } else {
        setError(errorData);
      }
      
      setIsAuthenticating(false);
    }
  };

  const copyDomain = () => {
    if (error?.domain) {
      navigator.clipboard.writeText(error.domain);
      alert("Domínio copiado para a área de transferência!");
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-white relative overflow-hidden">
      {/* Dynamic Checkerboard Background */}
      <div className="absolute inset-0 opacity-[0.05] checkerboard-pattern pointer-events-none"></div>
      
      {/* Croatian Red & Blue Decorative Glows */}
      <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-primary rounded-full blur-[140px] opacity-[0.08]"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-secondary rounded-full blur-[140px] opacity-[0.08]"></div>

      <div className="w-full max-w-[380px] bg-white rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] p-10 flex flex-col items-center gap-10 relative z-10 animate-scale-in border border-slate-100">
        
        {/* Vatreni Shield Logo */}
        <div className="relative group">
          <div className="size-32 bg-secondary rounded-[3rem] flex items-center justify-center shadow-2xl relative overflow-hidden transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
             {/* Subtle Checkerboard pattern inside shield */}
             <div className="absolute inset-0 opacity-20 checkerboard-pattern scale-75"></div>
             <div className="relative z-10 text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[64px] drop-shadow-xl" style={{fontVariationSettings: "'FILL' 1"}}>sports_soccer</span>
             </div>
          </div>
          {/* Champion Star */}
          <div className="absolute -top-3 -right-3 size-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl border-4 border-white animate-float">
            <span className="material-symbols-outlined text-white text-[24px] font-bold">star</span>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-black italic tracking-tighter text-secondary uppercase leading-none">
            Vatreni <span className="text-primary italic">Manager</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3 flex items-center justify-center gap-2">
            <span className="w-4 h-px bg-slate-100"></span>
            Professional Edition 2024
            <span className="w-4 h-px bg-slate-100"></span>
          </p>
        </div>

        <div className="w-full space-y-4">
          {error && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl text-[10px] font-bold text-primary text-center animate-shake">
              {error.message}
            </div>
          )}

          <button 
            onClick={handleGoogleLogin}
            disabled={isAuthenticating}
            className={`w-full h-16 bg-secondary text-white shadow-xl rounded-[1.5rem] flex items-center justify-center gap-4 hover:brightness-110 transition-all active:scale-95 group relative overflow-hidden ${isAuthenticating ? 'opacity-70 cursor-wait' : ''}`}
          >
             {isAuthenticating ? (
               <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
             ) : (
               <div className="size-6 flex items-center justify-center bg-white rounded-lg p-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                     <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                     <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                     <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
               </div>
             )}
             <span className="font-bold text-white tracking-wide">
               {isAuthenticating ? 'Entrando...' : 'Acessar via Google'}
             </span>
          </button>
          
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-slate-100"></div>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">ou</span>
            <div className="flex-1 h-px bg-slate-100"></div>
          </div>

          <button 
            onClick={onDemoMode}
            className="w-full h-16 bg-white border-2 border-slate-100 text-secondary rounded-[1.5rem] flex items-center justify-center gap-3 font-black italic tracking-widest shadow-sm hover:bg-slate-50 hover:border-primary/20 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">flash_on</span>
            <span>MODO VISITANTE</span>
          </button>
        </div>

        <div className="text-[9px] text-slate-300 text-center leading-relaxed font-bold">
           VARENTS EDITION 2024 <br/>
           <div className="mt-3 flex items-center justify-center gap-4">
             <a href="#" className="hover:text-primary transition-colors">Termos</a>
             <div className="size-1 bg-slate-200 rounded-full"></div>
             <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
