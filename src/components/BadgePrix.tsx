import React, { useState, useEffect } from "react";
import { TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Info, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BadgeData {
  badge: "CONSEILLE" | "BON_PLAN" | "ELEVE" | "SUSPECT" | "DONNEES_INSUFFISANTES";
  couleur: string;
  message: string;
  pourcentage_ecart: number;
}

export default function BadgePrix({ produitId, prix }: { produitId: string | number, prix: number }) {
  const [data, setData] = useState<BadgeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/produits/${produitId}/badge-prix?current_price=${prix}`)
      .then(res => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then(setData)
      .catch(err => console.error("Erreur badge prix:", err))
      .finally(() => setLoading(false));
  }, [produitId, prix]);

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 animate-pulse">
        <Loader2 size={10} className="animate-spin text-gray-400" />
        <div className="w-12 h-2 bg-gray-200 dark:bg-white/10 rounded-full"></div>
      </div>
    );
  }

  if (!data) return null;

  const configs = {
    CONSEILLE: { icon: CheckCircle, text: "Prix conseillé", bg: "bg-green-500", light: "bg-green-500/10 text-green-500", border: "border-green-500/20" },
    BON_PLAN: { icon: TrendingDown, text: "Bon plan", bg: "bg-blue-500", light: "bg-blue-500/10 text-blue-500", border: "border-blue-500/20" },
    ELEVE: { icon: TrendingUp, text: "Prix élevé", bg: "bg-red-500", light: "bg-red-500/10 text-red-500", border: "border-red-500/20" },
    SUSPECT: { icon: AlertTriangle, text: "Prix suspect", bg: "bg-yellow-500", light: "bg-yellow-500/10 text-yellow-500", border: "border-yellow-500/20" },
    DONNEES_INSUFFISANTES: { icon: Info, text: "Données insuffisantes", bg: "bg-gray-500", light: "bg-gray-500/10 text-gray-500", border: "border-gray-500/20" },
  };

  const config = configs[data.badge] || configs.DONNEES_INSUFFISANTES;
  const Icon = config.icon;

  return (
    <div className="group relative inline-block">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${config.light} ${config.border} border cursor-help shadow-sm transition-all hover:shadow-md`}
      >
        <Icon size={12} />
        {config.text}
        {data.pourcentage_ecart !== 0 && data.badge !== "DONNEES_INSUFFISANTES" && (
          <span className="ml-1 opacity-70 font-bold">
            ({data.pourcentage_ecart > 0 ? "+" : ""}{data.pourcentage_ecart}%)
          </span>
        )}
      </motion.div>

      {/* Tooltip ultra-stylisé */}
      <AnimatePresence>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl z-[100] translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-8 h-8 rounded-xl ${config.light} flex items-center justify-center`}>
              <Icon size={16} />
            </div>
            <div>
              <p className="font-black text-xs leading-none mb-1">{config.text}</p>
              <p className={`text-[10px] font-bold ${config.light.split(' ')[1]}`}>Analyse du Marché</p>
            </div>
          </div>
          
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium mb-3">
            {data.message}
          </p>

          <div className="h-1 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1 }}
              className={`h-full ${config.bg}`}
            />
          </div>
          
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[8px] border-transparent border-t-white dark:border-t-[#111]"></div>
        </div>
      </AnimatePresence>
    </div>
  );
}
