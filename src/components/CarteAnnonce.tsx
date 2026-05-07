import React from "react";
import { MapPin, Phone, MessageCircle, Star, ShieldCheck, Clock, Share2, Heart } from "lucide-react";
import { motion } from "motion/react";

export interface AnnonceProps {
  id: string;
  titre: string;
  prix: number;
  image: string;
  negociable: boolean;
  etat: string;
  note_etat: string;
  wilaya: string;
  vendeur: {
    nom: string;
    etoiles: number;
    badge: boolean;
  };
  date: string;
}

const CarteAnnonce: React.FC<{ annonce: AnnonceProps }> = ({ annonce }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="bg-white dark:bg-[#111] rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-black/10 transition-all group flex flex-col h-full"
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={annonce.image} 
          alt={annonce.titre} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges permanents */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-gray-900/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
            {annonce.etat} {annonce.note_etat}/10
          </span>
          {annonce.negociable && (
            <span className="bg-green-500/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
              Négociable
            </span>
          )}
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
            <Heart size={18} />
          </button>
          <button className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
            <Share2 size={18} />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 flex items-center justify-between text-white shadow-2xl">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#00b4d8]" />
              <span className="text-[10px] font-black uppercase tracking-tight">{annonce.wilaya}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span className="text-[10px] font-black">{annonce.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-black overflow-hidden">
                {annonce.vendeur.nom[0]}
              </div>
              <span className="text-xs font-black dark:text-gray-300">{annonce.vendeur.nom}</span>
              {annonce.vendeur.badge && <ShieldCheck size={14} className="text-blue-500" />}
            </div>
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold">{annonce.vendeur.etoiles}</span>
            </div>
          </div>

          <h3 className="text-lg font-black leading-tight mb-4 line-clamp-2 group-hover:text-[#00b4d8] transition-colors">
            {annonce.titre}
          </h3>
        </div>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Dernier prix</p>
              <p className="text-2xl font-black text-black dark:text-white">
                {new Intl.NumberFormat('fr-DZ').format(annonce.prix)} <span className="text-sm">DA</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-[#00b4d8] text-white font-black py-4 rounded-2xl hover:bg-[#0096b4] transition-all shadow-lg shadow-[#00b4d8]/20 active:scale-95">
              <Phone size={18} />
              Appeler
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-white/5 font-black py-4 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all active:scale-95">
              <MessageCircle size={18} />
              Message
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CarteAnnonce;
