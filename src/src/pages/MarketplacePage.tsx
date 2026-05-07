import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Filter, Search, Grid, MapPin, ChevronDown, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import Header from "../components/Header";
import CarteAnnonce from "../components/CarteAnnonce";
import SEO from "../components/SEO";

const MOCK_ANNONCES = [
  {
    id: "m1",
    titre: "iPhone 15 Pro Max 256GB Naturel Titane - Comme neuf avec boite",
    prix: 215000,
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop",
    negociable: true,
    etat: "Occasion",
    note_etat: "9.5",
    wilaya: "Alger (El Biar)",
    vendeur: {
      nom: "Yassine Tech",
      etoiles: 4.9,
      badge: true,
    },
    date: "Il y a 2h"
  },
  {
    id: "m2",
    titre: "PlayStation 5 (PS5) Slim Edition CD + 2 Manettes DualSense",
    prix: 98000,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop",
    negociable: false,
    etat: "Neuf",
    note_etat: "10",
    wilaya: "Oran",
    vendeur: {
      nom: "Best Game Dz",
      etoiles: 4.7,
      badge: false,
    },
    date: "Il y a 4h"
  },
  {
    id: "m3",
    titre: "Samsung Odyssey G7 32 pouces 240Hz incurvé",
    prix: 85000,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
    negociable: true,
    etat: "Occasion",
    note_etat: "8",
    wilaya: "Constantine",
    vendeur: {
      nom: "Hamza PC",
      etoiles: 4.5,
      badge: true,
    },
    date: "Aujourd'hui"
  },
  {
    id: "m4",
    titre: "MacBook Pro M3 Max 14 pouces (Scellé)",
    prix: 540000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    negociable: false,
    etat: "Neuf",
    note_etat: "10",
    wilaya: "Alger (Dely Brahim)",
    vendeur: {
      nom: "Apple Store DZ",
      etoiles: 5.0,
      badge: true,
    },
    date: "Il y a 30 min"
  }
];

export default function MarketplacePage() {
  const [activeSubTab, setActiveSubTab] = useState("toutes");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] font-sans text-gray-900 dark:text-gray-100 flex flex-col">
      <SEO 
        title="Petites Annonces Algérie — Marketplace Habibou" 
        description="Achetez et vendez vos objets d'occasion ou neufs en Algérie. Smartphones, PC, Voitures, Immobilier sur la marketplace Habibou."
      />
      <Header />

      {/* SEARCH & NAV TABS */}
      <div className="bg-white dark:bg-[#111] border-b border-gray-100 dark:border-white/5 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-6">
            {/* Top Tabs */}
            <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl w-full md:w-auto">
              <NavLink 
                to="/" 
                className={({isActive}) => `flex-1 md:flex-none px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${!isActive ? 'text-gray-400 hover:text-gray-600 dark:hover:text-white' : ''}`}
              >
                Comparateur
              </NavLink>
              <div className="bg-white dark:bg-white/10 px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-sm text-[#00b4d8]">
                Annonces
              </div>
            </div>

            {/* Quick Search */}
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00b4d8] transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Chercher parmi les annonces..."
                className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-[#00b4d8] rounded-2xl py-4 pl-14 pr-6 font-bold outline-none transition-all"
              />
            </div>
          </div>

          {/* Sub Tabs */}
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar pb-1">
            {["toutes", "neuf", "occasion", "wilaya"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`pb-4 text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap border-b-2 transition-all ${
                  activeSubTab === tab ? 'border-[#00b4d8] text-[#00b4d8]' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        {/* SIDEBAR FILTERS (Desktop) */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-8 sticky top-52 h-fit">
          <div className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5">
            <h3 className="text-lg font-black mb-6 flex items-center justify-between">
              Filtres
              <SlidersHorizontal size={18} className="text-gray-400" />
            </h3>

            <div className="space-y-8">
              {/* Wilaya Filter */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Wilaya</label>
                <div className="relative">
                  <select className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl py-3 px-4 font-bold appearance-none outline-none focus:border-[#00b4d8]">
                    <option>Toute l'Algérie</option>
                    <option>16 - Alger</option>
                    <option>31 - Oran</option>
                    <option>25 - Constantine</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Budget (DA)</label>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl py-3 px-4 font-bold outline-none text-sm placeholder:font-normal" />
                  <div className="w-2 h-[2px] bg-gray-300"></div>
                  <input type="number" placeholder="Max" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl py-3 px-4 font-bold outline-none text-sm placeholder:font-normal" />
                </div>
              </div>

              {/* Status checkboxes */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">État</label>
                <div className="space-y-3">
                  {['Produit Scellé', 'Comme Neuf', 'Bon État', 'Pour pièces'].map(s => (
                    <label key={s} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 border-2 border-gray-200 dark:border-white/10 rounded-md group-hover:border-[#00b4d8] transition-colors flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#00b4d8] rounded-sm scale-0 group-has-[:checked]:scale-100 transition-transform"></div>
                      </div>
                      <input type="checkbox" className="hidden" />
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Delivery toggle */}
              <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-black text-sm">Livraison disponible</span>
                  <div className="w-12 h-6 bg-gray-200 dark:bg-white/10 rounded-full relative transition-colors has-[:checked]:bg-[#00b4d8]">
                    <input type="checkbox" className="hidden" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform translate-x-0 peer-checked:translate-x-6"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#00b4d8] to-[#0077b6] rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-2">Vendez vos objets !</h4>
              <p className="text-xs font-bold text-white/80 mb-6 leading-relaxed">
                Rejoignez 50 000 vendeurs sur la plateforme n°1 en Algérie.
              </p>
              <button className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform">
                Déposer une annonce
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          </div>
        </aside>

        {/* FEED SECTION */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black tracking-tight">Annonces récentes</h2>
              <span className="bg-[#00b4d8]/10 text-[#00b4d8] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                12,450 résultats
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <ArrowUpDown size={14} />
                Trier par : Récent
              </button>
            </div>
          </div>

          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MOCK_ANNONCES.map((annonce) => (
              <CarteAnnonce key={annonce.id} annonce={annonce} />
            ))}
          </div>

          {/* Pagination or Load more */}
          <div className="pt-12 text-center">
            <button className="bg-white dark:bg-[#111] border-2 border-gray-100 dark:border-white/5 font-black px-12 py-5 rounded-2xl hover:border-[#00b4d8] transition-all group">
              Charger plus d'annonces
              <ChevronDown className="inline-block ml-3 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>

      {/* MOBILE FLOATING ACTION (Add product) */}
      <div className="fixed bottom-24 right-6 lg:hidden z-50">
        <button className="w-16 h-16 bg-[#00b4d8] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#00b4d8]/40 ring-4 ring-white dark:ring-black">
          <Grid size={24} />
        </button>
      </div>
    </div>
  );
}
