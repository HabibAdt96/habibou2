import React, { useState } from "react";
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import Header from "../components/Header";
import { motion } from "motion/react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] font-sans text-gray-900 dark:text-gray-100 flex flex-col relative overflow-hidden">
      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-30 dark:opacity-20 blur-3xl scale-110"
          alt="background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-gray-50 dark:from-black/20 dark:to-[#050505]"></div>
      </div>

      <Header />

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[480px] bg-white/90 dark:bg-[#111]/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_128px_rgba(0,0,0,0.1)] overflow-hidden border border-white/50 dark:border-white/5"
        >
          
          {/* TAB SWITCHER */}
          <div className="flex bg-gray-100/50 dark:bg-black/40 p-1.5 m-8 mb-10 rounded-2xl border border-gray-100 dark:border-gray-800">
            <button 
              onClick={() => setMode("login")}
              className={`flex-1 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${mode === "login" ? 'bg-white dark:bg-white/10 text-[#00b4d8] shadow-xl shadow-black/5' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
            >
              Connexion
            </button>
            <button 
              onClick={() => setMode("register")}
              className={`flex-1 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${mode === "register" ? 'bg-white dark:bg-white/10 text-[#00b4d8] shadow-xl shadow-black/5' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
            >
              Inscription
            </button>
          </div>

          <div className="px-8 pb-10">
            <div className="text-center mb-10">
               <h2 className="text-3xl font-black mb-2 tracking-tight">
                 {mode === "login" ? "Bon retour 👋" : "Bienvenue parmi nous"}
               </h2>
               <p className="text-gray-500 font-medium">
                 {mode === "login" ? "Accédez à vos alertes et vos favoris." : "Créez votre compte pour comparer et vendre."}
               </p>
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="grid grid-cols-2 gap-4 mb-10">
               <button className="flex items-center justify-center gap-3 py-4 border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-white dark:hover:bg-white/5 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-sm">
                 <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="google" />
                 Google
               </button>
               <button className="flex items-center justify-center gap-3 py-4 border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-white dark:hover:bg-white/5 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-sm">
                 <img src="https://www.svgrepo.com/show/448204/apple.svg" className="w-4 h-4 dark:invert" alt="apple" />
                 Apple
               </button>
            </div>

            <div className="relative mb-10 text-center">
               <hr className="border-gray-100 dark:border-gray-800" />
               <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 dark:bg-[#111]/90 backdrop-blur-md px-4 text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-[0.3em]">ou</span>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {mode === "register" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative col-span-full">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input type="text" placeholder="Prénom + Nom" className="w-full bg-gray-50/50 dark:bg-white/5 border-2 border-transparent focus:border-[#00b4d8] rounded-2xl py-4 pl-14 pr-6 outline-none font-bold text-sm transition-all" />
                  </div>
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input type="email" placeholder="Email ou téléphone" className="w-full bg-gray-50/50 dark:bg-white/5 border-2 border-transparent focus:border-[#00b4d8] rounded-2xl py-4 pl-14 pr-6 outline-none font-bold text-sm transition-all" />
              </div>

              {mode === "register" && (
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <span className="absolute left-14 top-1/2 -translate-y-1/2 text-xs font-black text-[#00b4d8] tracking-widest border-r border-gray-200 dark:border-gray-800 pr-3">+213</span>
                  <input type="tel" placeholder="5xx xx xx xx" className="w-full bg-gray-50/50 dark:bg-white/5 border-2 border-transparent focus:border-[#00b4d8] rounded-2xl py-4 pl-28 pr-6 outline-none font-bold text-sm transition-all" />
                </div>
              )}

              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe" 
                  className="w-full bg-gray-50/50 dark:bg-white/5 border-2 border-transparent focus:border-[#00b4d8] rounded-2xl py-4 pl-14 pr-14 outline-none font-bold text-sm transition-all" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#00b4d8] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {mode === "register" && (
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="password" 
                    placeholder="Confirmer mot de passe" 
                    className="w-full bg-gray-50/50 dark:bg-white/5 border-2 border-transparent focus:border-[#00b4d8] rounded-2xl py-4 pl-14 pr-6 outline-none font-bold text-sm transition-all" 
                  />
                </div>
              )}

              {mode === "register" && password && (
                <div className="space-y-3 px-2">
                   <div className="flex gap-1.5 h-1">
                      {[25, 50, 75, 100].map((step) => (
                        <div key={step} className={`flex-1 rounded-full transition-all duration-700 ${strength >= step ? (strength <= 50 ? 'bg-orange-500' : strength <= 75 ? 'bg-yellow-400' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]') : 'bg-gray-100 dark:bg-white/10'}`}></div>
                      ))}
                   </div>
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Force du mot de passe</p>
                </div>
              )}

              {mode === "login" && (
                <div className="flex justify-end px-2">
                  <a href="#" className="text-xs font-black text-[#00b4d8] hover:underline uppercase tracking-widest">Mot de passe oublié ?</a>
                </div>
              )}

              {mode === "register" && (
                <label className="flex items-center gap-3 cursor-pointer group mt-6 px-2">
                   <div className="relative">
                     <input type="checkbox" className="peer hidden" />
                     <div className="w-5 h-5 border-2 border-gray-200 dark:border-gray-800 rounded-md peer-checked:bg-[#00b4d8] peer-checked:border-[#00b4d8] transition-all"></div>
                     <CheckCircle2 className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={14} />
                   </div>
                   <span className="text-xs text-gray-500 font-medium leading-relaxed">
                     J'accepte les <a href="#" className="text-[#00b4d8] font-black underline decoration-2 underline-offset-4">conditions d'utilisation</a>
                   </span>
                </label>
              )}

              <button 
                type="submit"
                className="w-full bg-[#00b4d8] hover:bg-[#0096b4] text-white font-black py-5 rounded-2xl shadow-2xl shadow-[#00b4d8]/30 transition-all flex items-center justify-center gap-3 group mt-6 active:scale-95"
              >
                {mode === "login" ? "Se connecter" : "Créer mon compte"}
                <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {mode === "register" && (
              <div className="mt-8 p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl flex items-start gap-4 border border-blue-100 dark:border-blue-900/20">
                <ShieldCheck size={24} className="text-[#00b4d8] shrink-0" />
                <p className="text-[11px] text-blue-800 dark:text-blue-300 font-medium leading-relaxed italic">
                  Le numéro de téléphone sera vérifié par SMS avant la publication de votre première annonce.
                </p>
              </div>
            )}
          </div>

          <div className="bg-gray-100/50 dark:bg-black/20 p-8 text-center border-t border-gray-100 dark:border-gray-800">
             <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
               {mode === "login" ? "Nouveau sur Habibou ?" : "Déjà membre ?"}
               <button 
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="ml-3 text-[#00b4d8] hover:underline decoration-2 underline-offset-4"
               >
                 {mode === "login" ? "S'inscrire" : "Connexion"}
               </button>
             </p>
          </div>
        </motion.div>
      </main>

      <footer className="bg-white/80 dark:bg-black/40 backdrop-blur-lg border-t border-gray-100 dark:border-white/5 py-8 text-center relative z-10">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Habibou — Le futur du shopping en Algérie</p>
      </footer>
    </div>

  );
}
