import React, { useState, useEffect, useCallback } from "react";
import { Search, Loader2, TrendingUp, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  titre: string;
  prix: number;
  vendeur_nom: string;
  image_url: string;
}

export default function RechercheInstantanee() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/recherche?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      setResults(data.hits || []);
    } catch (err) {
      console.error("Erreur recherche:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) handleSearch(query);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  const highlightMatches = (text: string, match: string) => {
    if (!match) return text;
    const parts = text.split(new RegExp(`(${match})`, "gi"));
    return parts.map((part, i) => 
      part.toLowerCase() === match.toLowerCase() ? (
        <span key={i} className="text-[#00b4d8] font-black">{part}</span>
      ) : part
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-50">
      <div className={`relative flex items-center bg-white dark:bg-[#111] border-2 transition-all duration-300 ${
        isOpen ? 'border-[#00b4d8] shadow-2xl shadow-[#00b4d8]/10 rounded-t-[2rem]' : 'border-gray-100 dark:border-white/5 shadow-sm rounded-[2rem]'
      }`}>
        <div className="pl-6 text-gray-400">
          <Search size={24} />
        </div>
        
        <input 
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Un iPhone, un PC Gamer, un frigo..."
          className="w-full py-6 px-4 bg-transparent outline-none font-bold text-lg dark:text-white"
        />

        {query && (
          <button 
            onClick={() => { setQuery(""); setResults([]); }}
            className="p-2 mr-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-400"
          >
            <X size={20} />
          </button>
        )}

        {loading && (
          <div className="pr-6 text-[#00b4d8]">
            <Loader2 size={24} className="animate-spin" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (query || results.length > 0) && (
          <>
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 w-full bg-white dark:bg-[#111] border-x-2 border-b-2 border-[#00b4d8] rounded-b-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {results.length > 0 ? (
                  <div className="p-4 space-y-2">
                    <p className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Résultats correspondants</p>
                    {results.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => {
                          navigate(`/produit/${item.id}`);
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-all text-left group"
                      >
                        <div className="w-16 h-16 bg-white dark:bg-black p-2 rounded-xl flex-shrink-0 border border-gray-100 dark:border-white/5">
                          <img src={item.image_url} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-sm truncate group-hover:text-[#00b4d8] transition-colors">
                            {highlightMatches(item.titre, query)}
                          </h4>
                          <p className="text-xs text-gray-400 font-bold">{item.vendeur_nom}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-[#00b4d8]">{new Intl.NumberFormat('fr-DZ').format(item.prix)} DA</p>
                          <div className="flex items-center justify-end text-[8px] font-black text-green-500 uppercase tracking-tighter">
                            <TrendingUp size={10} className="mr-1" />
                            Meilleur prix
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : !loading && query && (
                  <div className="p-12 text-center">
                    <p className="text-gray-400 font-bold">Aucun produit trouvé pour "{query}"</p>
                  </div>
                )}
              </div>
            </motion.div>
            
            <div 
              className="fixed inset-0 z-[-1]" 
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
