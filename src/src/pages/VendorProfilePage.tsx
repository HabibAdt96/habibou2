import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  Star, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  MessageSquare, 
  UserPlus, 
  Share2,
  Package,
  ThumbsUp,
  Filter,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Header from "../components/Header";
import CarteProduit from "../components/CarteProduit";

interface Vendor {
  id: number;
  nom: string;
  is_certified: boolean;
  score_confiance: number;
  etoiles: number;
  cree_le: string;
  wilaya: string;
  logo_url: string;
  cover_url: string;
  stats: {
    nb_produits: number;
    rating: number;
    positif_percent: number;
  };
}

interface Review {
  id: number;
  nom_acheteur: string;
  note: number;
  commentaire: string;
  date: string;
}

export default function VendorProfilePage() {
  const { id } = useParams();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [produits, setProduits] = useState([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Tous");

  useEffect(() => {
    // Fetch Vendor Info & Score
    const fetchVendorData = async () => {
      try {
        // En vrai, on appellerait le backend FastAPI
        // const res = await fetch(`/api/vendeurs/${id}/score`);
        // const data = await res.json();
        
        // Simulation pour la démo visuelle
        setTimeout(() => {
          setVendor({
            id: Number(id),
            nom: "TechWorld Algérie",
            is_certified: true,
            score_confiance: 85,
            etoiles: 5,
            cree_le: "2024-03-12",
            wilaya: "Alger - 16",
            logo_url: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=200&auto=format&fit=crop",
            cover_url: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200&auto=format&fit=crop",
            stats: {
              nb_produits: 127,
              rating: 4.8,
              positif_percent: 98
            }
          });
          
          setReviews([
            { id: 1, nom_acheteur: "Karim B.", note: 5, commentaire: "Excellent vendeur, produit conforme et livraison rapide à Oran.", date: "2026-04-20" },
            { id: 2, nom_acheteur: "Lydia M.", note: 4, commentaire: "Bonne communication, prix compétitif.", date: "2026-04-15" },
            { id: 3, nom_acheteur: "Omar H.", note: 5, commentaire: "Le meilleur magasin pour les composants PC.", date: "2026-04-10" }
          ]);
          
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error("Error fetching vendor:", err);
        setLoading(false);
      }
    };

    const fetchProduits = async () => {
      try {
        const res = await fetch("/api/produits");
        const data = await res.json();
        setProduits(data);
      } catch (err) {
        console.error("Error fetching vendor products:", err);
      }
    };

    fetchVendorData();
    fetchProduits();
  }, [id]);

  const categories = ["Tous", "Smartphones", "PC Portables", "Accessoires", "Occasion"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00b4d8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!vendor) return <div>Vendeur non trouvé</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] font-sans text-gray-900 dark:text-white">
      <Header />

      {/* BANNER & PROFILE */}
      <section className="relative">
        <div className="h-48 md:h-80 w-full overflow-hidden">
          <img 
            src={vendor.cover_url} 
            className="w-full h-full object-cover" 
            alt="cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative -mt-16 md:-mt-24 pb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {/* LOGO */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] bg-white dark:bg-[#111] p-1 shadow-2xl overflow-hidden border-4 border-white dark:border-[#111]"
            >
              <img src={vendor.logo_url} className="w-full h-full object-cover rounded-[1.8rem]" alt="logo" />
            </motion.div>

            {/* INFO */}
            <div className="flex-1 mb-2">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight">{vendor.nom}</h1>
                {vendor.is_certified && (
                  <CheckCircle2 className="text-[#00b4d8] fill-[#00b4d8]/20" size={28} />
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm md:text-base font-bold text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill={i < vendor.etoiles ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="text-gray-900 dark:text-white">{vendor.stats.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{vendor.wilaya}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>Membre depuis {new Date(vendor.cree_le).getFullYear()}</span>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#00b4d8] hover:bg-[#0096b4] text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-[#00b4d8]/20 transition-all active:scale-95">
                <MessageSquare size={20} />
                Contacter
              </button>
              <button className="p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
                <UserPlus size={20} />
              </button>
              <button className="p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { label: "Produits", value: vendor.stats.nb_produits, icon: <Package className="text-blue-500" /> },
              { label: "Avis Clients", value: `${vendor.stats.rating}/5`, icon: <Star className="text-yellow-500" /> },
              { label: "Confiance", value: `${vendor.stats.positif_percent}%`, icon: <ThumbsUp className="text-green-500" /> }
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-[#111] p-4 md:p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                  {stat.icon}
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{stat.label}</span>
                </div>
                <p className="text-xl md:text-3xl font-black">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        
        {/* TABS & FILTERS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-3 rounded-full text-sm font-black whitespace-nowrap transition-all ${
                  activeTab === cat 
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-black' 
                    : 'bg-white dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-100 dark:border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-full text-sm font-black">
            <Filter size={18} />
            Filtres
          </button>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-20">
          {produits.map((p: any) => (
            <CarteProduit 
              key={p.id}
              id={p.id}
              titre={p.titre}
              prix={p.prix}
              ancien_prix={p.ancien_prix}
              image_url={p.image_url}
              vendeur_nom={p.vendeur_nom}
              wilaya={p.wilaya}
              categorie={p.categorie}
              nb_offres={p.nb_offres}
              est_meilleur_prix={p.est_meilleur_prix}
            />
          ))}
        </div>

        {/* AVIS SECTION */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black tracking-tight">Ce que disent les clients</h2>
            <button className="flex items-center gap-2 text-[#00b4d8] font-black text-sm uppercase tracking-widest hover:underline decoration-2">
              Voir tous les avis
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* SCORE SUMMARY */}
            <div className="bg-white dark:bg-[#111] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm h-fit">
              <div className="text-center mb-8">
                <p className="text-6xl font-black text-gray-900 dark:text-white mb-2">{vendor.stats.rating}</p>
                <div className="flex justify-center text-yellow-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} fill={i < 5 ? "currentColor" : "none"} size={24} />
                  ))}
                </div>
                <p className="text-sm font-bold text-gray-400">Basé sur 1 458 avis</p>
              </div>

              <div className="space-y-4">
                {[
                  { star: 5, percent: 80 },
                  { star: 4, percent: 12 },
                  { star: 3, percent: 5 },
                  { star: 2, percent: 2 },
                  { star: 1, percent: 1 }
                ].map((row) => (
                  <div key={row.star} className="flex items-center gap-4">
                    <span className="text-sm font-black w-4">{row.star}</span>
                    <div className="flex-1 h-3 bg-gray-50 dark:bg-black/20 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${row.percent}%` }}></div>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 w-8">{row.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* REVIEWS LIST */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.map((review) => (
                <motion.div 
                  key={review.id}
                  whileHover={{ x: 10 }}
                  className="bg-white dark:bg-[#111] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center font-black text-[#00b4d8]">
                        {review.nom_acheteur[0]}
                      </div>
                      <div>
                        <p className="font-black">{review.nom_acheteur}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(review.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.note ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed italic">"{review.commentaire}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5 py-12 text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Habibou — Vendeur Partenaire Certifié</p>
      </footer>
    </div>
  );
}
