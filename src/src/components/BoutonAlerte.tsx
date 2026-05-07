import React, { useState, useEffect } from "react";
import { Bell, BellOff, X, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Alerte {
  id: number;
  produit_id: number;
  prix_cible: number;
}

interface BoutonAlerteProps {
  produitId: number;
  prixActuel: number;
}

export default function BoutonAlerte({ produitId, prixActuel }: BoutonAlerteProps) {
  const [showModal, setShowModal] = useState(false);
  const [targetPrice, setTargetPrice] = useState(prixActuel * 0.9); // Par défaut -10%
  const [existingAlerte, setExistingAlerte] = useState<Alerte | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const checkAlerte = async () => {
      try {
        const res = await fetch("/api/alertes/");
        const alertes: Alerte[] = await res.json();
        const found = alertes.find(a => a.produit_id === produitId);
        setExistingAlerte(found || null);
      } catch (err) {
        console.error("Erreur check alerte:", err);
      } finally {
        setLoading(false);
      }
    };
    checkAlerte();
  }, [produitId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/alertes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produit_id: produitId,
          prix_cible: targetPrice
        })
      });
      if (res.ok) {
        const resList = await fetch("/api/alertes/");
        const alertes: Alerte[] = await resList.json();
        setExistingAlerte(alertes.find(a => a.produit_id === produitId) || null);
        setShowModal(false);
      }
    } catch (err) {
      console.error("Erreur save alerte:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!existingAlerte) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/alertes/${existingAlerte.id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setExistingAlerte(null);
      }
    } catch (err) {
      console.error("Erreur suppression:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <>
      {existingAlerte ? (
        <div className="flex flex-col gap-2">
            <button 
                onClick={handleRemove}
                className="flex items-center gap-3 bg-green-500 text-white font-black px-6 py-4 rounded-2xl shadow-xl shadow-green-500/20 transition-all hover:bg-red-500 group"
            >
                <div className="relative">
                    <Bell size={20} className="group-hover:hidden" />
                    <BellOff size={20} className="hidden group-hover:block" />
                </div>
                <div className="text-left leading-tight">
                    <p className="text-[10px] uppercase tracking-widest opacity-80">Alerte active</p>
                    <p className="text-sm font-black">Déclenchement à {new Intl.NumberFormat('fr-DZ').format(existingAlerte.prix_cible)} DA</p>
                </div>
            </button>
        </div>
      ) : (
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-3 bg-white dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 text-gray-900 dark:text-white font-black px-8 py-5 rounded-3xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm"
        >
          <Bell size={24} className="text-[#00b4d8]" />
          Alerte prix
        </button>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-white/5"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"
              >
                <X size={20} />
              </button>

              <div className="w-16 h-16 bg-[#00b4d8]/10 rounded-2xl flex items-center justify-center text-[#00b4d8] mb-6">
                <Bell size={32} />
              </div>

              <h3 className="text-2xl font-black mb-2 tracking-tight">Activer une alerte</h3>
              <p className="text-gray-500 font-medium mb-8">
                Vous recevrez une notification immédiate dès que le prix descendra sous votre seuil.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">
                    Votre prix cible (DZD)
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(Number(e.target.value))}
                      className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-6 px-8 text-2xl font-black outline-none transition-all focus:ring-4 focus:ring-[#00b4d8]/10"
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-gray-400">DA</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  {[
                    { label: "-5%", val: prixActuel * 0.95 },
                    { label: "-10%", val: prixActuel * 0.90 },
                    { label: "-20%", val: prixActuel * 0.80 }
                  ].map(lvl => (
                    <button 
                      key={lvl.label}
                      onClick={() => setTargetPrice(Math.round(lvl.val))}
                      className="flex-1 py-3 px-2 bg-gray-50 dark:bg-white/5 hover:bg-[#00b4d8]/10 hover:text-[#00b4d8] rounded-xl text-[10px] font-black transition-all"
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleSave}
                  disabled={saving || targetPrice <= 0}
                  className="w-full bg-[#00b4d8] hover:bg-[#0096b4] text-white font-black py-5 rounded-2xl shadow-xl shadow-[#00b4d8]/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" /> : <Check size={20} />}
                  Confirmer l'alerte
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
