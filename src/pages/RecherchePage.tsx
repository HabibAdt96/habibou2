import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import FiltresAvances, { FiltresState } from "../components/FiltresAvances";
import CarteProduit from "../components/CarteProduit";
import { ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown } from "lucide-react";

export default function RecherchePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const queryTerm = searchParams.get("q") || "";
  const categorieParam = searchParams.get("categorie") || "";
  const wilayaParam = searchParams.get("wilaya") || "";
  const prixMinParam = searchParams.get("prix_min") || "";
  const prixMaxParam = searchParams.get("prix_max") || "";
  const etatParam = searchParams.get("etat") || "Tous";
  const verifieParam = searchParams.get("verifie") === "true";

  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("nouveautés");

  // Fetch results based on search params
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Build API URL based on params
        const params = new URLSearchParams();
        if (queryTerm) params.append("search", queryTerm);
        // Note: For now the server API only supports 'search'. 
        // In a real app we would extend the backend routes to handle filters.
        
        const res = await fetch(`/api/produits?${params.toString()}`);
        let data = await res.json();

        // Client-side filtering simulation since our simple server only has basic search
        let filtered = data;
        if (categorieParam) {
          filtered = filtered.filter((p: any) => p.categorie === categorieParam);
        }
        if (wilayaParam) {
          filtered = filtered.filter((p: any) => p.wilaya.includes(wilayaParam.split(" - ")[0]));
        }
        if (prixMinParam) {
          filtered = filtered.filter((p: any) => p.prix >= Number(prixMinParam));
        }
        if (prixMaxParam) {
          filtered = filtered.filter((p: any) => p.prix <= Number(prixMaxParam));
        }
        if (etatParam !== "Tous") {
          filtered = filtered.filter((p: any) => p.etat === etatParam.toLowerCase());
        }

        // Sorting
        if (sortOrder === "prix_croissant") {
          filtered.sort((a: any, b: any) => a.prix - b.prix);
        } else if (sortOrder === "prix_decroissant") {
          filtered.sort((a: any, b: any) => b.prix - a.prix);
        } else {
          // Nouveautés (default ID desc)
          filtered.sort((a: any, b: any) => b.id - a.id);
        }

        setProduits(filtered);
      } catch (err) {
        console.error("Erreur de recherche:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [queryTerm, categorieParam, wilayaParam, prixMinParam, prixMaxParam, etatParam, verifieParam, sortOrder]);

  const handleFiltreChange = (filtres: FiltresState) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (filtres.wilaya) newParams.set("wilaya", filtres.wilaya); else newParams.delete("wilaya");
    if (filtres.prix_min !== "") newParams.set("prix_min", String(filtres.prix_min)); else newParams.delete("prix_min");
    if (filtres.prix_max !== "") newParams.set("prix_max", String(filtres.prix_max)); else newParams.delete("prix_max");
    if (filtres.etat !== "Tous") newParams.set("etat", filtres.etat); else newParams.delete("etat");
    if (filtres.categorie.length > 0) newParams.set("categorie", filtres.categorie[0]); else newParams.delete("categorie");
    if (filtres.verifie) newParams.set("verifie", "true"); else newParams.delete("verifie");

    setSearchParams(newParams);
    setIsMobileFiltersOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] font-sans text-gray-900 dark:text-gray-100 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* COLONNE GAUCHE : FILTRES (25%) */}
          <aside className="w-full md:w-1/4">
            <FiltresAvances 
              onFiltreChange={handleFiltreChange} 
              isOpenMobile={isMobileFiltersOpen}
              onCloseMobile={() => setIsMobileFiltersOpen(false)}
            />
          </aside>

          {/* COLONNE DROITE : RÉSULTATS (75%) */}
          <section className="w-full md:w-3/4">
            
            {/* EN-TÊTE RÉSULTATS */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {loading ? "Recherche en cours..." : `${produits.length} résultats pour "${queryTerm || 'tous les produits'}"`}
                </h2>
                <div className="text-sm text-gray-500 mt-1">
                  Tous les prix sont en Dinars Algériens (DZD)
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="md:hidden flex-1 flex items-center justify-center gap-2 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  <SlidersHorizontal size={18} /> Filtres
                </button>
                
                <div className="relative flex-1 sm:flex-none">
                  <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-lg text-sm font-medium appearance-none pr-10 focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] outline-none"
                  >
                    <option value="nouveautés">Nouveautés</option>
                    <option value="prix_croissant">Prix croissant</option>
                    <option value="prix_decroissant">Prix décroissant</option>
                  </select>
                  <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* GRILLE DE PRODUITS */}
            {loading ? (
              <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white dark:bg-[#1a1a2e] rounded-xl h-40 md:h-80 border border-gray-100 dark:border-gray-800"></div>
                ))}
              </div>
            ) : produits.length > 0 ? (
              <>
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

                {/* PAGINATION SIMPLE */}
                <div className="mt-12 flex justify-center items-center gap-2">
                  <button className="p-2 rounded-lg bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-[#00b4d8] transition-colors disabled:opacity-50" disabled>
                    <ChevronLeft size={20} />
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-[#00b4d8] text-white font-bold text-sm">1</button>
                  <button className="w-10 h-10 rounded-lg bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-800 hover:border-[#00b4d8] transition-colors text-sm font-medium">2</button>
                  <button className="w-10 h-10 rounded-lg bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-800 hover:border-[#00b4d8] transition-colors text-sm font-medium">3</button>
                  <span className="text-gray-400 mx-1">...</span>
                  <button className="w-10 h-10 rounded-lg bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-800 hover:border-[#00b4d8] transition-colors text-sm font-medium">10</button>
                  <button className="p-2 rounded-lg bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-[#00b4d8] transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-500 max-w-sm">
                  Essayez de modifier vos filtres ou effectuez une nouvelle recherche pour trouver ce que vous cherchez.
                </p>
                <button 
                  onClick={() => handleFiltreChange({ wilaya: "", prix_min: "", prix_max: "", etat: "Tous", categorie: [], verifie: false })}
                  className="mt-6 text-[#00b4d8] font-bold hover:underline"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-800 py-8 mt-auto text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Habibou © 2026 — Tous les prix en DZD</p>
      </footer>
    </div>
  );
}
