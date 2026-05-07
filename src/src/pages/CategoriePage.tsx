import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import FiltresAvances, { FiltresState } from "../components/FiltresAvances";
import CarteProduit from "../components/CarteProduit";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

const CATEGORY_MAP: Record<string, { title: string, emoji: string, bg: string, subs: string[] }> = {
  "smartphones": { 
    title: "Smartphones", 
    emoji: "📱", 
    bg: "from-blue-600 to-indigo-700",
    subs: ["iPhone", "Samsung", "Xiaomi", "Oppo", "Realme", "Google Pixel"] 
  },
  "pc-mac": { 
    title: "PC & Mac", 
    emoji: "💻", 
    bg: "from-gray-700 to-gray-900",
    subs: ["MacBook", "Laptops Gamer", "Ultraportables", "PC Bureau", "DPI"] 
  },
  "tv-son": { 
    title: "TV & Son", 
    emoji: "📺", 
    bg: "from-red-600 to-pink-700",
    subs: ["Android TV", "OLED", "Barres de son", "Casques", "Enceintes"] 
  },
  "electromenager": { 
    title: "Électroménager", 
    emoji: "🏠", 
    bg: "from-teal-600 to-emerald-700",
    subs: ["Réfrigérateurs", "Lave-linge", "Cuisinières", "Climatiseurs"] 
  },
  "jeux-video": { 
    title: "Jeux Vidéo", 
    emoji: "🎮", 
    bg: "from-purple-600 to-indigo-800",
    subs: ["PS5", "Xbox", "Nintendo Switch", "Jeux PC", "Périphériques"] 
  },
};

export default function CategoriePage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryInfo = CATEGORY_MAP[slug || ""] || { title: slug, emoji: "📦", bg: "from-gray-500 to-gray-700", subs: [] };

  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("nouveautés");

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        // Fetch all products (in a real app, the API would have a category filter)
        const res = await fetch("/api/produits");
        const data = await res.json();
        
        // Filter by category slug (normalized)
        const filtered = data.filter((p: any) => 
          p.categorie.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === slug
        );

        // Apply URL filters
        let finalResults = filtered;
        const wilaya = searchParams.get("wilaya");
        const prixMin = searchParams.get("prix_min");
        const prixMax = searchParams.get("prix_max");
        
        if (wilaya) finalResults = finalResults.filter((p: any) => p.wilaya.includes(wilaya.split(" - ")[0]));
        if (prixMin) finalResults = finalResults.filter((p: any) => p.prix >= Number(prixMin));
        if (prixMax) finalResults = finalResults.filter((p: any) => p.prix <= Number(prixMax));

        // Sort
        if (sortOrder === "prix_croissant") finalResults.sort((a: any, b: any) => a.prix - b.prix);
        else if (sortOrder === "prix_decroissant") finalResults.sort((a: any, b: any) => b.prix - a.prix);
        else finalResults.sort((a: any, b: any) => b.id - a.id);

        setProduits(finalResults);
      } catch (err) {
        console.error("Erreur category fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [slug, searchParams, sortOrder]);

  const handleFiltreChange = (filtres: FiltresState) => {
    const newParams = new URLSearchParams(searchParams);
    if (filtres.wilaya) newParams.set("wilaya", filtres.wilaya); else newParams.delete("wilaya");
    if (filtres.prix_min !== "") newParams.set("prix_min", String(filtres.prix_min)); else newParams.delete("prix_min");
    if (filtres.prix_max !== "") newParams.set("prix_max", String(filtres.prix_max)); else newParams.delete("prix_max");
    setSearchParams(newParams);
    setIsMobileFiltersOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] font-sans text-gray-900 dark:text-gray-100 flex flex-col">
      <Header />

      {/* BANNIÈRE CATÉGORIE */}
      <section className={`bg-gradient-to-r ${categoryInfo.bg} text-white py-12 md:py-20 px-4`}>
        <div className="max-w-7xl mx-auto flex flex-col items-center md:items-start text-center md:text-left">
          <div className="text-5xl md:text-7xl mb-4 drop-shadow-lg">{categoryInfo.emoji}</div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 uppercase">
            {categoryInfo.title}
          </h1>
          <p className="text-white/80 max-w-xl text-lg font-medium">
            Découvrez les meilleurs prix et offres disponibles en Algérie pour la catégorie {categoryInfo.title}.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        
        {/* SOUS-CATÉGORIES / MARQUES */}
        {categoryInfo.subs.length > 0 && (
          <div className="mb-10 overflow-x-auto pb-4 custom-scrollbar">
            <div className="flex gap-3">
              {categoryInfo.subs.map((sub, i) => (
                <button key={i} className="shrink-0 px-6 py-2.5 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-800 rounded-full text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-[#00b4d8] hover:text-[#00b4d8] transition-all shadow-sm">
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* FILTRES SIDEBAR */}
          <aside className="w-full md:w-1/4">
            <FiltresAvances 
              onFiltreChange={handleFiltreChange}
              isOpenMobile={isMobileFiltersOpen}
              onCloseMobile={() => setIsMobileFiltersOpen(false)}
            />
          </aside>

          {/* GRILLE RÉSULTATS */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {produits.length} Produits <span className="text-gray-400 font-normal text-sm">dans {categoryInfo.title}</span>
              </h2>
              
              <div className="flex gap-2">
                 <button 
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="md:hidden flex items-center gap-2 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  <SlidersHorizontal size={18} />
                </button>
                <div className="relative">
                  <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-lg text-sm font-medium appearance-none pr-8 outline-none focus:ring-2 focus:ring-[#00b4d8]/20"
                  >
                    <option value="nouveautés">Nouveautés</option>
                    <option value="prix_croissant">Prix croissant</option>
                    <option value="prix_decroissant">Prix décroissant</option>
                  </select>
                  <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white dark:bg-[#1a1a2e] h-40 md:h-80 rounded-xl border border-gray-100 dark:border-gray-800"></div>
                ))}
              </div>
            ) : produits.length > 0 ? (
              <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 md:gap-6">
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
            ) : (
              <div className="text-center py-20 bg-white dark:bg-[#1a1a2e] rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="text-xl font-bold mb-2">Aucun produit pour le moment</h3>
                <p className="text-gray-500">Revenez plus tard ou essayez une autre catégorie.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-800 py-8 mt-auto text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Habibou © 2026 — Tous les prix en DZD</p>
      </footer>
    </div>
  );
}
