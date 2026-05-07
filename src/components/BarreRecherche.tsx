import React, { useState, useEffect, useRef } from "react";
import { Search, Package, X } from "lucide-react";

interface ProductSuggestion {
  id: number;
  titre: string;
  prix: number;
  image_url?: string;
}

interface BarreRechercheProps {
  onSearch: (terme: string) => void;
  className?: string;
}

export default function BarreRecherche({ onSearch, className = "" }: BarreRechercheProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search effect
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length === 0) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      setShowDropdown(true);

      try {
        // Fetch depuis l'API locale avec Fast API / Express
        const res = await fetch(`/api/produits?search=${encodeURIComponent(searchTerm)}`);
        const data = await res.json();
        setSuggestions(data.slice(0, 5)); // Limiter à 5 suggestions
      } catch (err) {
        console.error("Erreur de recherche:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Escape key to close dropdown
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowDropdown(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSuggestionClick = (id: number) => {
    setShowDropdown(false);
    setSearchTerm("");
    // Redirection vers la page produit (simulation ici ou vrai lien /produit/:id)
    window.location.href = `/produit/${id}`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setShowDropdown(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 0
    }).format(price).replace('DZD', 'DA');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (searchTerm.trim().length > 0) setShowDropdown(true);
          }}
          placeholder="iPhone, Samsung, PlayStation..."
          className="w-full bg-gray-100 dark:bg-[#0f0f0f] border border-transparent focus:bg-white dark:focus:bg-[#1a1a2e] focus:border-[#00b4d8] rounded-full py-2.5 pl-4 pr-12 text-sm text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-[#00b4d8]/20 outline-none"
        />
        {searchTerm && (
          <button 
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSuggestions([]);
              setShowDropdown(false);
            }}
            className="absolute right-12 top-1.5 bottom-1.5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={16} />
          </button>
        )}
        <button 
          type="submit"
          className="absolute right-1 top-1 bottom-1 bg-[#00b4d8] text-white rounded-full aspect-square flex items-center justify-center hover:bg-[#0096b4] transition-colors"
        >
          <Search size={18} />
        </button>
      </form>

      {/* Dropdown des résultats en temps réel */}
      {showDropdown && searchTerm.trim().length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1a1a2e] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden transform opacity-100 scale-100 transition-all origin-top">
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-[#00b4d8] border-t-transparent rounded-full animate-spin mr-2"></div>
              Recherche en cours...
            </div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((produit) => (
                <li 
                  key={produit.id}
                  onClick={() => handleSuggestionClick(produit.id)}
                  className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#0f0f0f] flex items-center gap-4 cursor-pointer transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0"
                >
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {produit.image_url ? (
                      <img src={produit.image_url} alt={produit.titre} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {produit.titre}
                    </h4>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="font-bold text-[#00b4d8] text-sm">
                      {formatPrice(produit.prix)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500 py-6">
              <span className="block mb-1 text-2xl">😕</span>
              Aucun produit trouvé pour <span className="font-semibold text-gray-900 dark:text-white">"{searchTerm}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
