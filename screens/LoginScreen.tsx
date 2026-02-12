
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
        message: err.message || "Failed to sign in. Please try again."
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
      alert("Domínio copiado!");
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-surface-gray px-8 relative overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #ed1d23 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}></div>

      <div className="w-full max-w-sm bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 flex flex-col items-center gap-10 relative z-10 animate-fade-in-up border border-white/40">
        
        {/* Animated Logo Container */}
        <div className="w-32 h-32 bg-navy rounded-[2.2rem] flex items-center justify-center shadow-2xl animate-float relative overflow-hidden group">
           <div className="absolute inset-0 premium-shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="w-16 h-16 text-primary flex items-center justify-center border-2 border-primary/30 rounded-2xl p-2 relative z-10">
              <span className="material-symbols-outlined text-[48px]" style={{fontVariationSettings: "'FILL' 1"}}>sports_soccer</span>
           </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-black italic tracking-tighter text-navy uppercase leading-none">
            O&A <span className="text-primary">Elite Pro</span>
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-3">
            Football Management System
          </p>
        </div>

        <div className="w-full space-y-4">
          {error && error.code === 'auth/unauthorized-domain' ? (
            <div className="p-5 bg-navy/5 border border-navy/10 rounded-3xl space-y-3 animate-fade-in-up">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[20px]">warning</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Configuração Necessária</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                Adicione este domínio no Firebase Console:
              </p>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-100">
                <code className="text-[10px] font-bold text-navy truncate mr-2">{error.domain}</code>
                <button onClick={copyDomain} className="size-8 bg-gray-50 rounded-lg flex items-center justify-center hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                </button>
              </div>
              <p className="text-[9px] text-gray-400 italic">
                Authentication > Settings > Authorized Domains
              </p>
            </div>
          ) : error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[10px] font-bold text-red-500 text-center animate-shake">
              {error.message}
            </div>
          )}

          <button 
            onClick={handleGoogleLogin}
            disabled={isAuthenticating}
            className={`w-full h-15 bg-navy text-white shadow-[0_10px_20px_rgba(9,18,44,0.2)] rounded-2xl flex items-center justify-center gap-3 hover:bg-navy/90 transition-all active:scale-95 group ${isAuthenticating ? 'opacity-70 cursor-wait' : ''}`}
          >
             {isAuthenticating ? (
               <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
             ) : (
               <div className="size-6 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white"/>
                     <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="rgba(255,255,255,0.8)"/>
                     <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="rgba(255,255,255,0.8)"/>
                     <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="rgba(255,255,255,0.8)"/>
                  </svg>
               </div>
             )}
             <span className="font-bold text-white tracking-wide">{isAuthenticating ? 'Autenticando...' : 'Entrar com Google'}</span>
          </button>
          
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">ou</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <button 
            onClick={onDemoMode}
            className="w-full h-15 bg-white border-2 border-primary/20 text-primary rounded-2xl flex items-center justify-center gap-2 font-black italic tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95 group overflow-hidden relative"
          >
            <div className="absolute inset-0 premium-shimmer opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <span className="material-symbols-outlined text-[20px]">visibility</span>
            <span>ENTRAR COMO VISITANTE</span>
          </button>
        </div>

        <div className="text-[9px] text-gray-400/60 text-center leading-relaxed font-medium">
           v2.5.0 Premium Edition <br/>
           <div className="mt-1 flex items-center justify-center gap-3">
             <a href="#" className="hover:text-primary transition-colors">Suporte</a>
             <span className="size-1 bg-gray-200 rounded-full"></span>
             <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
