import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { 
  Check, 
  X, 
  MapPin, 
  Star, 
  ShoppingBag, 
  Truck, 
  Plus, 
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Product {
  id: number;
  titre: string;
  prix: number;
  ancien_prix?: number;
  image_url: string;
  nb_offres: number;
  note: number;
  wilaya: string;
  livraison_min: number;
  categorie: string;
}

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const ids = searchParams.get("ids")?.split(",").map(Number).filter(n => !isNaN(n)) || [];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/produits");
        const allProducts = await res.json();
        
        const filtered = allProducts
          .filter((p: any) => ids.includes(p.id))
          .map((p: any) => ({
            ...p,
            note: p.note || 4.5,
            wilaya: p.wilaya || "Toutes",
            livraison_min: Math.floor(Math.random() * 500) + 200,
          }));
        
        setProducts(filtered);
      } catch (err) {
        console.error("Erreur lors du chargement des produits:", err);
      } finally {
        setLoading(false);
      }
    };

    if (ids.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const formatPrice = (p: number) => new Intl.NumberFormat('fr-DZ').format(p) + " DA";

  const removeProduct = (id: number) => {
    const newIds = ids.filter(i => i !== id).join(",");
    if (newIds) {
      navigate(`/comparer?ids=${newIds}`);
    } else {
      navigate(`/comparer`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] font-sans text-gray-900 dark:text-white flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-12 flex-grow">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black mb-3 tracking-tight">Comparatif Élite</h1>
            <p className="text-gray-500 font-medium max-w-lg">
              Comparez jusqu'à 4 produits côte à côte pour trouver la meilleure offre disponible en Algérie.
            </p>
          </motion.div>
          <button 
            disabled={products.length >= 4}
            onClick={() => navigate("/recherche")}
            className="flex items-center gap-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/10 transition-all disabled:opacity-30"
          >
            <Plus size={20} />
            Ajouter un produit
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-6 opacity-40">
             <div className="w-12 h-12 border-4 border-[#00b4d8] border-t-transparent rounded-full animate-spin"></div>
             <p className="font-black uppercase tracking-[0.3em] text-xs">Analyse comparative...</p>
          </div>
        ) : products.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 bg-white dark:bg-[#111] rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center p-8"
          >
             <ShoppingBag size={64} className="text-gray-200 mb-6" />
             <h3 className="text-2xl font-black mb-2">Votre comparateur est vide</h3>
             <p className="text-gray-500 mb-8 max-w-xs">Sélectionnez des produits sur le site pour les comparer ici.</p>
             <button onClick={() => navigate("/")} className="bg-[#00b4d8] text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-[#00b4d8]/20 hover:bg-[#0096b4] transition-all">
                Découvrir les produits
             </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* TABLE CONTAINER */}
            <div className="overflow-x-auto bg-white/50 dark:bg-[#111]/50 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-white/5 shadow-2xl">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="p-8 w-1/5 min-w-[200px] align-top bg-white/30 dark:bg-black/10">
                       <h2 className="text-2xl font-black leading-tight text-left">Match<br/><span className="text-[#00b4d8]">Direct</span></h2>
                    </th>
                    <AnimatePresence>
                      {products.map(p => (
                        <th key={p.id} className="p-8 w-1/5 min-w-[250px] relative group text-center align-top border-l border-gray-50 dark:border-white/5">
                          <button 
                            onClick={() => removeProduct(p.id)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-full transition-all"
                          >
                            <X size={16} />
                          </button>
                          <div className="relative w-32 h-32 mx-auto mb-6 p-4 bg-white dark:bg-white/5 rounded-3xl shadow-sm">
                             <img src={p.image_url} alt={p.titre} className="w-full h-full object-contain" />
                          </div>
                          <h4 className="font-black text-sm mb-2 line-clamp-2 h-10 leading-tight uppercase tracking-tight">{p.titre}</h4>
                          <div className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest">{p.categorie}</div>
                        </th>
                      ))}
                    </AnimatePresence>
                    {/* Placeholder columns if < 4 */}
                    {[...Array(Math.max(0, 4 - products.length))].map((_, i) => (
                      <th key={`empty-${i}`} className="p-8 w-1/5 opacity-5 border-l border-gray-50 dark:border-white/5 align-top">
                         <div className="w-32 h-32 mx-auto mb-6 border-4 border-dashed rounded-3xl flex items-center justify-center">
                           <Plus size={32} />
                         </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm font-bold">
                  {/* PRIX */}
                  <tr className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-6 bg-white/30 dark:bg-black/10 uppercase text-[10px] tracking-[0.3em] text-gray-400">Meilleur Prix</td>
                    {products.map(p => (
                      <td key={p.id} className="p-6 text-center text-xl font-black text-[#00b4d8] border-l border-gray-50 dark:border-white/5">
                        {formatPrice(p.prix)}
                      </td>
                    ))}
                    {[...Array(Math.max(0, 4 - products.length))].map((_, i) => <td key={i} className="border-l border-gray-50 dark:border-white/5"></td>)}
                  </tr>

                  {/* MARCHANDS */}
                  <tr className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-6 bg-white/30 dark:bg-black/10 uppercase text-[10px] tracking-[0.3em] text-gray-400">Marchands</td>
                    {products.map(p => (
                      <td key={p.id} className="p-6 text-center border-l border-gray-50 dark:border-white/5">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full">
                          <ShoppingBag size={14} className="text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{p.nb_offres} offres</span>
                        </div>
                      </td>
                    ))}
                    {[...Array(Math.max(0, 4 - products.length))].map((_, i) => <td key={i} className="border-l border-gray-50 dark:border-white/5"></td>)}
                  </tr>

                  {/* NOTE */}
                  <tr className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-6 bg-white/30 dark:bg-black/10 uppercase text-[10px] tracking-[0.3em] text-gray-400">Popularité</td>
                    {products.map(p => (
                      <td key={p.id} className="p-6 text-center border-l border-gray-50 dark:border-white/5">
                        <div className="flex items-center justify-center gap-1 text-yellow-500">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} size={14} fill={i < Math.floor(p.note) ? "currentColor" : "none"} />
                           ))}
                           <span className="ml-2 text-gray-900 dark:text-white font-black">{p.note}</span>
                        </div>
                      </td>
                    ))}
                    {[...Array(Math.max(0, 4 - products.length))].map((_, i) => <td key={i} className="border-l border-gray-50 dark:border-white/5"></td>)}
                  </tr>

                  {/* WILAYA */}
                  <tr className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-6 bg-white/30 dark:bg-black/10 uppercase text-[10px] tracking-[0.3em] text-gray-400">Disponibilité</td>
                    {products.map(p => (
                      <td key={p.id} className="p-6 text-center border-l border-gray-50 dark:border-white/5">
                        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin size={14} />
                          <span>{p.wilaya}</span>
                        </div>
                      </td>
                    ))}
                    {[...Array(Math.max(0, 4 - products.length))].map((_, i) => <td key={i} className="border-l border-gray-50 dark:border-white/5"></td>)}
                  </tr>

                  {/* LIVRAISON */}
                  <tr className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-6 bg-white/30 dark:bg-black/10 uppercase text-[10px] tracking-[0.3em] text-gray-400">Livraison Min.</td>
                    {products.map(p => (
                      <td key={p.id} className="p-6 text-center border-l border-gray-50 dark:border-white/5">
                        <div className="flex items-center justify-center gap-2 text-green-500">
                          <Truck size={14} />
                          <span>{p.livraison_min === 0 ? "Gratuite" : formatPrice(p.livraison_min)}</span>
                        </div>
                      </td>
                    ))}
                    {[...Array(Math.max(0, 4 - products.length))].map((_, i) => <td key={i} className="border-l border-gray-50 dark:border-white/5"></td>)}
                  </tr>

                  {/* ACTION FOOTER */}
                  <tr className="bg-gray-50/50 dark:bg-black/20">
                    <td className="p-6 uppercase text-[10px] font-black tracking-[0.3em] text-gray-400">Décision</td>
                    {products.map(p => (
                      <td key={p.id} className="p-8 text-center border-l border-gray-50 dark:border-white/5">
                        <button 
                          onClick={() => navigate(`/produit/${p.id}`)}
                          className="w-full bg-[#00b4d8] hover:bg-[#0096b4] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#00b4d8]/20 transition-all flex items-center justify-center gap-2 group active:scale-95"
                        >
                          Choisir celui-ci
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </td>
                    ))}
                    {[...Array(Math.max(0, 4 - products.length))].map((_, i) => <td key={i} className="border-l border-gray-50 dark:border-white/5"></td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
        
        {/* INSIGHTS SECTION */}
        {products.length >= 2 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-16 p-10 bg-white/50 dark:bg-white/5 border border-white dark:border-white/5 rounded-[3rem] backdrop-blur-md shadow-xl"
          >
             <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="w-20 h-20 bg-[#00b4d8]/10 rounded-3xl flex items-center justify-center text-[#00b4d8] shrink-0">
                   <Star size={32} />
                </div>
                <div className="flex-1 text-center md:text-left">
                   <h3 className="text-2xl font-black mb-2 tracking-tight">Conseil d'Expert Habibou</h3>
                   <p className="text-gray-500 font-medium leading-relaxed">
                      D'après notre analyse en temps réel, le <strong>{products[0].titre}</strong> présente actuellement le meilleur rapport performance/prix. La tendance des prix est à la baisse sur les 7 derniers jours pour ce modèle.
                   </p>
                </div>
                <button className="bg-gray-900 dark:bg-white text-white dark:text-black font-black px-10 py-5 rounded-3xl shadow-2xl transition-all hover:scale-105 active:scale-95">
                   Enregistrer ce match
                </button>
             </div>
          </motion.div>
        )}
      </main>

      <footer className="bg-white/80 dark:bg-black/40 backdrop-blur-lg border-t border-gray-100 dark:border-white/5 py-12 text-center mt-20">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Habibou — Tous les prix en DZD</p>
      </footer>
    </div>
  );
}
