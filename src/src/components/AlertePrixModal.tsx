import React, { useState } from "react";
import { X, Bell, Mail, Smartphone, Globe, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AlertePrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  produitTitre: string;
  prixActuel: number;
}

export default function AlertePrixModal({ isOpen, onClose, produitTitre, prixActuel }: AlertePrixModalProps) {
  const [targetPrice, setTargetPrice] = useState(Math.round(prixActuel * 0.9));
  const [channels, setChannels] = useState(["email"]);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleChannel = (id: string) => {
    setChannels(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-[#1a1a2e] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
          >
            {isSuccess ? (
              <div className="p-12 text-center flex flex-col items-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <Check size={40} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-black mb-2">Alerte activée !</h3>
                <p className="text-gray-500">Nous vous préviendrons dès que le prix descendra sous {new Intl.NumberFormat('fr-DZ').format(targetPrice)} DA.</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#0f0f0f]/30">
                  <div className="flex items-center gap-2 text-blue-500">
                    <Bell size={20} fill="currentColor" className="opacity-20" />
                    <span className="font-bold text-sm uppercase tracking-wider">Alerte de prix</span>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div>
                    <h3 className="font-bold text-lg mb-1 leading-tight">{produitTitre}</h3>
                    <p className="text-sm text-gray-500">Prix actuel : <span className="font-bold text-gray-900 dark:text-gray-100">{new Intl.NumberFormat('fr-DZ').format(prixActuel)} DA</span></p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Prévenez-moi quand le prix atteint :</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(Number(e.target.value))}
                        className="w-full bg-gray-50 dark:bg-[#0f0f0f] border-2 border-gray-100 dark:border-gray-800 focus:border-[#00b4d8] rounded-2xl p-4 text-2xl font-black text-[#00b4d8] outline-none transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-400">DA</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Canaux de notification :</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'email', label: 'Email', icon: <Mail size={18} /> },
                        { id: 'push', label: 'Push', icon: <Globe size={18} /> },
                        { id: 'sms', label: 'SMS', icon: <Smartphone size={18} /> },
                      ].map(ch => (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => toggleChannel(ch.id)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${channels.includes(ch.id) ? 'border-[#00b4d8] bg-[#00b4d8]/5 text-[#00b4d8] shadow-sm' : 'border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-200 dark:hover:border-gray-700'}`}
                        >
                          {ch.icon}
                          <span className="text-[10px] font-black uppercase">{ch.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#00b4d8] hover:bg-[#0096b4] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#00b4d8]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Bell size={20} /> Créer l'alerte
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
