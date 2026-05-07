import React from "react";
import { Package, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CarteProduitProps {
  key?: any;
  id: number;
  titre: string;
  prix: number;
  ancien_prix?: number;
  image_url?: string;
  vendeur_nom: string;
  wilaya: string;
  categorie: string;
  nb_offres?: number;
  est_meilleur_prix?: boolean;
}

export default function CarteProduit({
  id,
  titre,
  prix,
  ancien_prix,
  image_url,
  vendeur_nom,
  wilaya,
  categorie,
  nb_offres,
  est_meilleur_prix,
}: CarteProduitProps) {
  const navigate = useNavigate();
  // Format price
  const prixFormatte = new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    maximumFractionDigits: 0
  }).format(prix).replace('DZD', 'DA');

  return (
    <div 
      onClick={() => navigate(`/produit/${id}`)}
      className="bg-white dark:bg-[#1a1a2e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-full relative"
    >
      
      {/* Badges */}
      <div className="absolute top-1 left-1 flex flex-col gap-1 z-10">
        {est_meilleur_prix && (
          <span className="bg-green-500 text-white text-[8px] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded shadow-sm">
            Top Prix
          </span>
        )}
      </div>
      
      {/* Image Area */}
      <div className="h-24 md:h-48 w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden relative">
        {image_url ? (
          <img 
            src={image_url} 
            alt={titre} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <Package size={48} />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-2 md:p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug mb-1 md:mb-2 text-[10px] md:text-base">
          {titre}
        </h3>
        
        <div className="hidden md:flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 mt-auto">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{vendeur_nom} • {wilaya}</span>
        </div>
        
        <div className="flex flex-col mb-2 md:mb-4">
          {ancien_prix && (
            <span className="text-[10px] md:text-sm text-gray-400 line-through">
              {new Intl.NumberFormat('fr-DZ').format(ancien_prix)} DA
            </span>
          )}
          <span className="text-xs md:text-xl font-bold text-[#00b4d8] dark:text-[#00b4d8]">
            {prixFormatte}
          </span>
          {nb_offres && nb_offres > 1 && (
            <span className="text-[8px] md:text-xs text-gray-500 mt-0.5">
              {nb_offres} offres
            </span>
          )}
        </div>
        
        <button className="w-full bg-[#00b4d8]/10 hover:bg-[#00b4d8]/20 text-[#00b4d8] font-black py-1.5 md:py-2 rounded-lg transition-colors text-[8px] md:text-sm uppercase">
          Voir
        </button>
      </div>
    </div>
  );
}
