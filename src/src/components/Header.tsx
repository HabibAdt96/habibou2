import React, { useState } from "react";
import { Search, Menu, X, ShoppingCart, User, PlusCircle } from "lucide-react";
import BarreRecherche from "./BarreRecherche";

const CATEGORIES = [
  "Smartphones", "PC & Mac", "TV & Son", "Électroménager", 
  "Jeux Vidéo", "Mode", "Auto", "Autres"
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearch = (terme: string) => {
    window.location.href = `/recherche?q=${encodeURIComponent(terme)}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#111] shadow-sm">
      {/* --- LIGNE 1 : LOGO + RECHERCHE + ACTIONS (DESKTOP) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-gray-800/50">
        <div className="flex justify-between items-center h-16 md:h-20 gap-4">
          
          {/* Menu Mobile & Logo */}
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:text-[#00b4d8] transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <a href="/" className="flex items-center shrink-0">
              <img src="https://i.imgur.com/7tAtXrv.png" alt="Habibou Logo" className="h-12 md:h-16 w-auto object-contain" referrerPolicy="no-referrer" />
            </a>
          </div>

          {/* Barre de Recherche (Desktop) */}
          <div className="hidden md:block flex-1 max-w-2xl px-4">
            <BarreRecherche onSearch={handleSearch} className="w-full" />
          </div>

          {/* Actions Droite */}
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-[#00b4d8] transition-colors"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <Search size={24} />
            </button>
            <a href="/dashboard/ajouter" className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#00b4d8] dark:text-gray-300 dark:hover:text-[#00b4d8] transition-colors">
              <PlusCircle size={18} />
              Vendre
            </a>
            <div className="hidden md:block w-px h-6 bg-gray-200 dark:bg-gray-800"></div>
            <a href="/auth" className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#00b4d8] dark:text-gray-300 dark:hover:text-[#00b4d8] transition-colors">
              <User size={18} />
              Se connecter
            </a>
            <a href="/panier" className="p-2 text-gray-600 hover:text-[#00b4d8] dark:text-gray-300 relative transition-colors">
              <ShoppingCart size={24} />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#00b4d8] text-[10px] font-bold text-white">
                0
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* --- RECHERCHE MOBILE FULL SCREEN --- */}
      {isMobileSearchOpen && (
        <div className="md:hidden p-4 bg-white dark:bg-[#111] border-b border-gray-100 dark:border-gray-800 w-full animate-in slide-in-from-top-2">
          <BarreRecherche onSearch={handleSearch} className="w-full" />
        </div>
      )}

      {/* --- LIGNE 2 : MENU CATÉGORIES (DESKTOP) --- */}
      <div className="hidden md:block bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-between text-sm font-medium text-gray-600 dark:text-gray-400 py-3 overflow-x-auto custom-scrollbar gap-6">
            {CATEGORIES.map((cat, idx) => (
              <li key={idx} className="shrink-0">
                <a 
                  href={`/categorie/${cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} 
                  className="hover:text-[#00b4d8] dark:hover:text-white transition-colors"
                >
                  {cat}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- MENU LATÉRAL MOBILE --- */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-[#1a1a2e] z-50 flex flex-col transform transition-transform duration-300 md:hidden shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
            <a href="/">
                <img src="https://i.imgur.com/7tAtXrv.png" alt="Habibou" className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
              </a>
              <button 
                className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-4 pb-6 border-b border-gray-100 dark:border-gray-800 space-y-4">
                <a href="/auth" className="flex items-center gap-3 w-full p-3 bg-gray-50 dark:bg-[#0f0f0f] rounded-xl text-gray-900 dark:text-white font-semibold">
                  <User size={20} className="text-[#00b4d8]" />
                  Se connecter / S'inscrire
                </a>
                <a href="/dashboard/ajouter" className="flex items-center justify-center gap-2 w-full p-3 bg-[#00b4d8] text-white rounded-xl font-bold shadow-md shadow-[#00b4d8]/20">
                  <PlusCircle size={20} />
                  Vendre un produit
                </a>
              </div>

              <div className="p-4">
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
                  Catégories
                </h3>
                <ul className="space-y-1">
                  {CATEGORIES.map((cat, idx) => (
                    <li key={idx}>
                      <a 
                        href={`/categorie/${cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                        className="block py-2.5 px-3 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-[#0f0f0f] hover:text-[#00b4d8] dark:hover:text-[#00b4d8] transition-colors"
                      >
                        {cat}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
