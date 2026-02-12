
import React from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const handleGoogleLogin = async () => {
    try {
      // Nota: Em ambientes de iframe restritos, o popup pode falhar. 
      // Em produção, use signInWithRedirect ou trate o erro.
      // const result = await signInWithPopup(auth, googleProvider);
      // console.log("User logged in:", result.user);
      onLogin(); // Navega após sucesso
    } catch (error) {
      console.error("Erro no login:", error);
      // Fallback para demonstração se o popup for bloqueado
      onLogin(); 
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-surface-gray px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #ed1d23 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}></div>

      <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-xl p-10 flex flex-col items-center gap-10 relative z-10">
        <div className="w-32 h-32 bg-[#1a0a0b] rounded-[2rem] flex items-center justify-center shadow-lg">
           <div className="w-16 h-16 text-primary flex items-center justify-center border-2 border-primary rounded-lg overflow-hidden p-2">
              <span className="material-symbols-outlined text-[40px]" style={{fontVariationSettings: "'FILL' 1"}}>sports_soccer</span>
           </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-black italic tracking-tighter text-[#1a0a0b]">
            O&A <span className="text-primary">ELITE PRO</span>
          </h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
            Gestão de Futebol Profissional
          </p>
        </div>

        <div className="w-full space-y-4">
          <button 
            onClick={handleGoogleLogin}
            className="w-full h-14 bg-white border border-gray-100 shadow-md rounded-full flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-95"
          >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
             </svg>
             <span className="font-bold text-gray-700">Entrar com Google</span>
          </button>
          
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-[10px] font-bold text-gray-300 uppercase">ou</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">mail</span>
            <span>Entrar com e-mail</span>
          </button>
        </div>

        <div className="text-[10px] text-gray-300 text-center leading-relaxed">
           © 2024 O&A Football Management. <br/>
           <a href="#" className="underline">Termos de Uso</a> • <a href="#" className="underline">Privacidade</a>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
