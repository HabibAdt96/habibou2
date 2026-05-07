import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { Star, MapPin, Truck, Box, MessageCircle, ExternalLink, ShieldCheck, Bell, ChevronRight, Info, FileText, BarChart3, Filter, ShoppingCart, ArrowRight } from "lucide-react";
import CarteProduit from "../components/CarteProduit";
import AlertePrixModal from "../components/AlertePrixModal";
import SEO from "../components/SEO";

export default function ProduitPage() {
  const { id } = useParams();
  const [produit, setProduit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [similaires, setSimilaires] = useState([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  useEffect(() => {
    // Fetch product detail
    fetch(`/api/produits/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setProduit(data);
        
        // Fetch similar products (mocked by fetching all products and taking 4)
        return fetch("/api/produits").then(r => r.json());
      })
      .then(allProducts => {
        setSimilaires(allProducts.filter((p: any) => p.id !== Number(id)).slice(0, 4));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching product", err);
        setLoading(false);
      });
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 0
    }).format(price).replace('DZD', 'DA');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] flex flex-col">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-[#00b4d8] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!produit) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col justify-center items-center text-gray-500">
          <h2 className="text-2xl font-bold mb-4">Produit introuvable</h2>
          <a href="/" className="text-[#00b4d8] hover:underline">Retour à l'accueil</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] font-sans text-gray-900 dark:text-gray-100 flex flex-col">
      <SEO 
        title={`${produit.titre} — Meilleur prix Algérie`}
        description={`Comparez ${produit.nb_offres} offres pour ${produit.titre} en Algérie. Meilleur prix : ${formatPrice(produit.prix)} chez ${produit.vendeur_nom}.`}
        image={produit.image_url}
        type="product"
      />
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-4 flex-grow w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-6 font-medium">
          <a href="/" className="hover:text-black">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          </a>
          <ChevronRight size={14} className="text-gray-300" />
          <a href={`/categorie/${produit.categorie}`} className="hover:underline">{produit.categorie}</a>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-gray-400 truncate">{produit.titre}</span>
        </nav>

        {/* Product Identity */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {produit.titre}
          </h1>
          <div className="flex items-center justify-center gap-1">
            <div className="flex text-[#ffcc00]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={20} fill={s <= 4 ? "currentColor" : "none"} className={s === 5 ? "text-gray-300" : ""} />
              ))}
            </div>
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300 ml-1">(10)</span>
            <button className="text-blue-500 ml-1"><Info size={18} /></button>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          <button className="flex flex-col items-center justify-center py-4 px-2 border-r border-gray-100 dark:border-gray-800 hover:bg-gray-50 transition-colors">
            <FileText size={24} className="mb-2 text-gray-700 dark:text-gray-300" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white">Détails du produit</span>
          </button>
          <button className="flex flex-col items-center justify-center py-4 px-2 border-r border-gray-100 dark:border-gray-800 hover:bg-gray-50 transition-colors">
            <BarChart3 size={24} className="mb-2 text-gray-700 dark:text-gray-300" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white">Évolution du prix</span>
          </button>
          <button 
            onClick={() => setIsAlertModalOpen(true)}
            className="flex flex-col items-center justify-center py-4 px-2 hover:bg-gray-50 transition-colors"
          >
            <Bell size={24} className="mb-2 text-gray-700 dark:text-gray-300" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white">Alerte prix</span>
          </button>
        </div>

        {/* Quick Specs & Similar Tags */}
        <div className="space-y-3 mb-8 text-sm">
          <p className="text-gray-900 dark:text-white">
            <span className="font-bold">Aperçu du produit :</span> 6,2 pouces · Full HD · 120 Hz · 50 mégapixels
          </p>
          <p className="text-gray-900 dark:text-white">
            <span className="font-bold">Produits similaires :</span> 
            <a href="#" className="text-blue-500 ml-1 hover:underline">Smartphones {produit.marque}</a> · 
            <a href="#" className="text-blue-500 ml-1 hover:underline">Smartphones 5G</a>
          </p>
        </div>

        {/* Variants Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">
              {produit.nb_offres} Variantes à partir de {formatPrice(produit.prix)}
            </h3>
            <button className="flex items-center gap-2 border border-blue-500 text-blue-500 px-4 py-1.5 rounded-md text-sm font-bold hover:bg-blue-50 transition-colors">
              <Filter size={16} fill="currentColor" />
              Filtrer
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar no-scrollbar scroll-smooth">
            {/* Toutes les variantes card */}
            <div className="min-w-[150px] border-2 border-blue-500 rounded-lg p-2 bg-white relative">
              <div className="absolute top-0 left-0 bg-blue-500 text-white p-0.5 rounded-br-md">
                <ShieldCheck size={12} fill="white" />
              </div>
              <div className="aspect-square bg-gray-50 rounded mb-2 overflow-hidden p-1 flex items-center justify-center">
                <img src={produit.image_url} alt="Variantes" className="h-full object-contain" />
              </div>
              <p className="text-xs font-bold leading-tight mb-1">Toutes les Variantes</p>
              <p className="text-[10px] text-gray-500">à partir de</p>
              <p className="text-sm font-black text-orange-500">{formatPrice(produit.prix)}</p>
            </div>

            {/* Mock Variants */}
            {[
              { id: 1, label: "Meilleur prix", color: "vert d'eau", price: produit.prix },
              { id: 2, label: null, color: "bleu foncé", price: produit.prix + 5000 },
              { id: 3, label: null, color: "argent", price: produit.prix + 8000 },
            ].map((v) => (
              <div key={v.id} className="min-w-[150px] border border-gray-200 rounded-lg p-2 bg-white flex flex-col">
                {v.label && (
                   <div className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm self-start mb-1">
                     {v.label}
                   </div>
                )}
                {!v.label && <div className="h-5"></div>}
                <div className="aspect-square bg-gray-50 rounded mb-2 overflow-hidden p-2 flex items-center justify-center">
                  <img src={produit.image_url} alt="Variant" className="h-full object-contain opacity-80" />
                </div>
                <p className="text-xs font-bold leading-tight mb-1">128 Go {v.color}</p>
                <p className="text-[10px] text-gray-500 mt-auto">à partir de</p>
                <p className="text-sm font-black text-orange-500">{formatPrice(v.price)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Offer Types */}
        <div className="mb-8">
          <p className="font-bold text-sm mb-2">Offres:</p>
          <div className="flex gap-2">
            <div className="flex-1 border-2 border-blue-500 rounded-lg p-3 bg-blue-50/20 relative">
              <div className="absolute top-0 left-0 bg-blue-500 text-white p-0.5 rounded-br-md">
                <ShieldCheck size={10} fill="white" />
              </div>
              <p className="font-bold text-sm">Neuf</p>
              <p className="text-xs text-gray-600">à partir de <span className="font-bold text-black">{formatPrice(produit.prix)}</span></p>
            </div>
            <div className="flex-1 border border-gray-200 rounded-lg p-3 bg-white">
              <p className="font-bold text-sm">D'occasion &amp; Reconditionné</p>
              <p className="text-xs text-gray-600">à partir de <span className="font-bold text-black">{formatPrice(produit.prix * 0.7)}</span></p>
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 pb-2">Comparer les prix</h2>
          
          <div className="flex gap-6 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
              <span>livraison incl.</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
              <span>Livraison rapide</span>
            </label>
          </div>

          {/* Merchant List */}
          <div className="space-y-2">
            {/* Offer 1 */}
            <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white underline decoration-gray-300">
                    {produit.marque} {produit.titre} AI Smartphone 128 Go Vert d'eau
                  </h4>
                  <div className="flex items-center mt-3 gap-6">
                    <div>
                      <div className="text-2xl font-black text-gray-900 dark:text-white">{formatPrice(produit.prix)}</div>
                      <div className="text-[10px] text-orange-500 font-bold border border-orange-200 rounded px-1 max-w-fit mt-1">Meilleur prix total</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-blue-600 text-white font-black text-xs px-2 py-1 italic mb-1 rounded-sm">
                        TechDZ
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={10} fill="#ffcc00" className="text-[#ffcc00]" />
                        <span className="text-[10px] font-bold text-gray-900">4,6</span>
                        <span className="text-[10px] text-gray-400 font-medium">(251)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <button className="flex-1 md:flex-none bg-[#00b4d8] hover:bg-[#168aad] text-white font-bold py-2.5 px-8 rounded-lg transition-colors text-sm shadow-sm">
                    Voir l'offre
                   </button>
                </div>
              </div>
            </div>

            {/* Offer 2 */}
            <div className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-90">
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white underline decoration-gray-300">
                    {produit.marque} {produit.titre} 128Go Graphite Dual SIM
                  </h4>
                  <div className="flex items-center mt-3 gap-6">
                    <div>
                      <div className="text-2xl font-black text-gray-900 dark:text-white">{formatPrice(produit.prix + 2300)}</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-100 text-gray-800 font-black text-xs px-2 py-1 rounded-sm flex items-center gap-1 border border-gray-200">
                        <ShoppingCart size={10} /> SOUQ_DZ
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={10} fill="#ffcc00" className="text-[#ffcc00]" />
                        <span className="text-[10px] font-bold text-gray-900">4,2</span>
                        <span className="text-[10px] text-gray-400 font-medium">(84)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <button className="flex-1 md:flex-none border-2 border-[#00b4d8] text-[#00b4d8] font-bold py-2.5 px-8 rounded-lg transition-colors text-sm">
                    Voir l'offre
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar items at bottom */}
        {similaires.length > 0 && (
          <div className="mt-16 border-t border-gray-100 pt-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Produits recommandés</h3>
              <a href="#" className="text-blue-500 text-sm font-bold flex items-center gap-1">
                Voir tout <ArrowRight size={14} />
              </a>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {similaires.map((p: any) => (
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
          </div>
        )}

        <AlertePrixModal 
          isOpen={isAlertModalOpen} 
          onClose={() => setIsAlertModalOpen(false)} 
          produitTitre={produit.titre} 
          prixActuel={produit.prix} 
        />
      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-800 py-8 mt-auto text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Habibou © 2026 — Tous les prix en DZD</p>
      </footer>
    </div>
  );
}
