import React from "react";
import { AlertTriangle, RefreshCw, MessageCircle } from "lucide-react";
import { motion } from "motion/react";

interface ErrorPageProps {
  error?: Error;
  reset?: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] font-sans text-gray-900 dark:text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ rotate: -10, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          className="w-24 h-24 bg-red-500/10 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8"
        >
          <AlertTriangle size={48} />
        </motion.div>

        <h1 className="text-3xl font-black mb-4 tracking-tight">Oups ! Une erreur est survenue.</h1>
        <p className="text-gray-500 font-medium mb-10 leading-relaxed">
          Nos robots scrapers ont dû rencontrer un obstacle. Nous faisons de notre mieux pour réparer ça !
          {error && <span className="block mt-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl text-xs font-mono text-red-400 break-all">{error.message}</span>}
        </p>

        <div className="space-y-4">
          <button 
            onClick={() => reset ? reset() : window.location.reload()}
            className="w-full flex items-center justify-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-black font-black px-8 py-5 rounded-2xl shadow-2xl transition-all active:scale-95"
          >
            <RefreshCw size={20} />
            Réessayer
          </button>
          
          <button 
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 font-black px-8 py-5 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
          >
            <MessageCircle size={20} />
            Contacter le support
          </button>
        </div>

        <p className="mt-12 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Habibou — Error Handler v1.0
        </p>
      </div>
    </div>
  );
}
