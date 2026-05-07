import React, { useState, useEffect } from "react";
import { CreditCard, Info, CheckCircle2, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PaymentRules {
  mode: string;
  acompte: number;
  type_acompte: "cod_only" | "deposit_fixed" | "deposit_percent";
  escrow_actif: boolean;
  message: string;
}

interface SystemePaiementProps {
  prix: number;
  vendeurId: number;
}

export default function SystemePaiement({ prix, vendeurId }: SystemePaiementProps) {
  const [rules, setRules] = useState<PaymentRules | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRules() {
      try {
        const res = await fetch(`/api/commandes/calculer-paiement?prix=${prix}&vendeur_id=${vendeurId}`);
        const data = await res.json();
        setRules(data);
      } catch (err) {
        console.error("Erreur calcul paiement:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRules();
  }, [prix, vendeurId]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 p-6 bg-gray-50 dark:bg-white/5 rounded-3xl animate-pulse">
        <Loader2 size={20} className="animate-spin text-[#00b4d8]" />
        <p className="text-sm font-bold text-gray-400">Calcul des conditions de paiement...</p>
      </div>
    );
  }

  if (!rules) return null;

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-[#00b4d8]/10 text-[#00b4d8] rounded-2xl flex items-center justify-center flex-shrink-0">
            <CreditCard size={24} />
          </div>
          <div>
            <h4 className="font-black text-lg mb-1">{rules.mode}</h4>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{rules.message}</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Deposit Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-[#00b4d8]" />
              <span className="text-sm font-bold">Acompte de réservation</span>
            </div>
            <span className={`font-black ${rules.acompte > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {rules.acompte > 0 ? `${new Intl.NumberFormat('fr-DZ').format(rules.acompte)} DA` : "GRATUIT"}
            </span>
          </div>

          {/* Security Badge */}
          {rules.escrow_actif && (
            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
              <div className="flex items-center gap-3 text-blue-500 mb-2">
                <ShieldCheck size={20} />
                <span className="font-black text-sm uppercase tracking-tight">Protection Acheteur Active</span>
              </div>
              <p className="text-[11px] font-medium text-blue-500/80 leading-relaxed">
                ℹ️ Votre argent est en sécurité. Le paiement n'est libéré au vendeur qu'après votre confirmation de réception de l'article conforme.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Trust Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-6 py-4 bg-green-500/10 text-green-600 rounded-2xl border border-green-500/20"
      >
        <CheckCircle2 size={18} />
        <span className="text-xs font-black uppercase tracking-widest">Transaction sécurisée par Habibou</span>
      </motion.div>
    </div>
  );
}
