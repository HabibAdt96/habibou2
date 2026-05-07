import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Home, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import Header from "../components/Header";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] font-sans text-gray-900 dark:text-white flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 relative inline-block"
          >
            <div className="text-[12rem] font-black leading-none text-gray-100 dark:text-white/5 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl">🔍</span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black mb-4 tracking-tight"
          >
            Produit introuvable...
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 font-medium mb-12 max-w-md mx-auto"
          >
            Mais ne vous inquiétez pas, il existe sûrement au meilleur prix quelque part sur Habibou !
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-md mx-auto mb-12"
          >
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00b4d8] transition-colors" size={24} />
              <input 
                type="text" 
                placeholder="Rechercher un autre produit..."
                className="w-full bg-white dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-lg font-bold outline-none focus:border-[#00b4d8] transition-all shadow-xl shadow-black/5"
                onKeyDown={(e) => e.key === 'Enter' && navigate('/recherche')}
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => navigate('/')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#00b4d8] text-white font-black px-10 py-5 rounded-2xl shadow-xl shadow-[#00b4d8]/20 hover:bg-[#0096b4] transition-all"
            >
              <Home size={20} />
              Retour à l'accueil
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 font-black px-10 py-5 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
            >
              <ArrowLeft size={20} />
              Page précédente
            </button>
          </motion.div>
        </div>
      </main>

      <footer className="py-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
        Habibou — Erreur 404
      </footer>
    </div>
  );
}
