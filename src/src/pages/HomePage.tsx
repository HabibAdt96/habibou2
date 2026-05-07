import React, { useState, useEffect } from "react";
import { Search, Smartphone, Laptop, Tv, Home, Headphones, Gamepad2, Shirt, Car } from "lucide-react";
import CarteProduit from "../components/CarteProduit";
import BarreRecherche from "../components/BarreRecherche";
import Header from "../components/Header";
import SEO from "../components/SEO";

export default function HomePage() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/produits")
      .then((res) => res.json())
      .then((data) => {
        setProduits(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const categories = [
    { name: "Smartphones", icon: <Smartphone size={24} /> },
    { name: "PC", icon: <Laptop size={24} /> },
    { name: "TV", icon: <Tv size={24} /> },
    { name: "Électroménager", icon: <Home size={24} /> },
    { name: "Audio", icon: <Headphones size={24} /> },
    { name: "Jeux Vidéo", icon: <Gamepad2 size={24} /> },
    { name: "Mode", icon: <Shirt size={24} /> },
    { name: "Auto", icon: <Car size={24} /> },
  ];

  const handleSearch = (terme: string) => {
    window.location.href = `/recherche?q=${encodeURIComponent(terme)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] font-sans text-gray-900 dark:text-gray-100 flex flex-col">
      <SEO />
      <Header />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-[#0f0f0f] to-[#1a1a2e] text-white py-16 md:py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
            Comparez les prix dans toute l'Algérie
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 font-medium">
            Plus de 500 sites vérifiés • Prix mis à jour chaque heure
          </p>
          
          <div className="relative w-full max-w-2xl mx-auto mb-6 md:hidden">
            <BarreRecherche onSearch={handleSearch} className="w-full" />
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-300">
             <span className="bg-white/10 hover:bg-white/20 cursor-pointer px-3 py-1.5 rounded-full transition-colors border border-white/5">iPhone 15 Pro</span>
             <span className="bg-white/10 hover:bg-white/20 cursor-pointer px-3 py-1.5 rounded-full transition-colors border border-white/5">PlayStation 5</span>
             <span className="bg-white/10 hover:bg-white/20 cursor-pointer px-3 py-1.5 rounded-full transition-colors border border-white/5">MacBook Air M2</span>
             <span className="bg-white/10 hover:bg-white/20 cursor-pointer px-3 py-1.5 rounded-full transition-colors border border-white/5">AirPods Pro</span>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        {/* CATÉGORIES POPULAIRES */}
        <div className="mb-16">
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Catégories Populaires</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-4 bg-white dark:bg-[#1a1a2e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-[#00b4d8] hover:text-[#00b4d8] dark:hover:border-[#00b4d8] dark:hover:text-[#00b4d8] cursor-pointer transition-all group">
                <div className="text-gray-500 group-hover:text-[#00b4d8] mb-2 transition-colors">
                  {cat.icon}
                </div>
                <span className="text-xs font-medium text-center truncate w-full">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION PRODUITS */}
        <div>
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Meilleures offres du moment</h3>
          
          {loading ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-[#1a1a2e] rounded-xl h-40 md:h-80 border border-gray-100 dark:border-gray-800"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
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
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-800 py-8 mt-auto text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Habibou © 2026 — Tous les prix en DZD</p>
      </footer>
    </div>
  );
}
