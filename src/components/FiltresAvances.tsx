import React, { useState } from "react";
import { Filter, X, ChevronDown } from "lucide-react";

export interface FiltresState {
  wilaya: string;
  prix_min: number | "";
  prix_max: number | "";
  etat: "Tous" | "Neuf" | "Occasion";
  categorie: string[];
  verifie: boolean;
}

interface FiltresAvancesProps {
  onFiltreChange: (filtres: FiltresState) => void;
  isOpenMobile?: boolean; // Controls visibility on mobile
  onCloseMobile?: () => void; // Triggered when closing on mobile
  className?: string;
}

const WILAYAS = [
  "01 - Adrar - أدرار", "02 - Chlef - الشلف", "03 - Laghouat - الأغواط", "04 - Oum El Bouaghi - أم البواقي",
  "05 - Batna - باتنة", "06 - Béjaïa - بجاية", "07 - Biskra - بسكرة", "08 - Béchar - بشار",
  "09 - Blida - البليدة", "10 - Bouira - البويرة", "11 - Tamanrasset - تمنراست", "12 - Tébessa - تبسة",
  "13 - Tlemcen - تلمسان", "14 - Tiaret - تيارت", "15 - Tizi Ouzou - تيزي وزو", "16 - Alger - الجزائر",
  "17 - Djelfa - الجلفة", "18 - Jijel - جيجل", "19 - Sétif - سطيف", "20 - Saïda - سعيدة",
  "21 - Skikda - سكيكدة", "22 - Sidi Bel Abbès - سيدي بلعباس", "23 - Annaba - عنابة", "24 - Guelma - قالمة",
  "25 - Constantine - قسنطينة", "26 - Médéa - المدية", "27 - Mostaganem - مستغانم", "28 - M'Sila - المسيلة",
  "29 - Mascara - معسكر", "30 - Ouargla - ورقلة", "31 - Oran - وهران", "32 - El Bayadh - البيض",
  "33 - Illizi - إليزي", "34 - Bordj Bou Arreridj - برج بوعريريج", "35 - Boumerdès - بومرداس",
  "36 - El Tarf - الطارف", "37 - Tindouf - تندوف", "38 - Tissemsilt - تسمسيلت", "39 - El Oued - الوادي",
  "40 - Khenchela - خنشلة", "41 - Souk Ahras - سوق أهراس", "42 - Tipaza - تيبازة", "43 - Mila - ميلة",
  "44 - Aïn Defla - عين الدفلى", "45 - Naâma - النعامة", "46 - Aïn Témouchent - عين تموشنت",
  "47 - Ghardaïa - غرداية", "48 - Relizane - غليزان", "49 - Timimoun - تيميمون", "50 - Bordj Badji Mokhtar - برج باجي مختار",
  "51 - Ouled Djellal - أولاد جلال", "52 - Béni Abbès - بني عباس", "53 - In Salah - إن صالح",
  "54 - In Guezzam - إن قزام", "55 - Touggourt - تقرت", "56 - Djanet - جانت", "57 - El M'Ghair - المغير",
  "58 - El Meniaa - المنيعة"
];

const CATEGORIES = [
  "Smartphones", "PC Portables", "TV", "Audio", "Jeux Vidéo", 
  "Électroménager", "Mode", "Auto", "Autres"
];

export default function FiltresAvances({ 
  onFiltreChange, 
  isOpenMobile = false, 
  onCloseMobile,
  className = "" 
}: FiltresAvancesProps) {
  const initialState: FiltresState = {
    wilaya: "",
    prix_min: "",
    prix_max: "",
    etat: "Tous",
    categorie: [],
    verifie: false
  };

  const [filtres, setFiltres] = useState<FiltresState>(initialState);

  const handleChange = (key: keyof FiltresState, value: any) => {
    setFiltres(prev => ({ ...prev, [key]: value }));
  };

  const toggleCategory = (cat: string) => {
    setFiltres(prev => {
      const isSelected = prev.categorie.includes(cat);
      if (isSelected) {
        return { ...prev, categorie: prev.categorie.filter(c => c !== cat) };
      }
      return { ...prev, categorie: [...prev.categorie, cat] };
    });
  };

  const handleApply = () => {
    onFiltreChange(filtres);
  };

  const handleReset = () => {
    setFiltres(initialState);
    onFiltreChange(initialState);
  };

  return (
    <>
      {/* Overlay mobile */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onCloseMobile}
        />
      )}

      {/* Container principal (Sidebar) */}
      <div 
        className={`
          fixed md:relative top-0 left-0 h-full md:h-auto z-50 md:z-0
          w-[280px] md:w-full bg-white dark:bg-[#1a1a2e] 
          md:rounded-xl md:shadow-sm md:border border-gray-100 dark:border-gray-800
          overflow-y-auto transform transition-transform duration-300 ease-in-out
          ${isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          flex flex-col
          ${className}
        `}
      >
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-[#1a1a2e] z-10">
          <h2 className="font-bold flex items-center text-gray-900 dark:text-white">
            <Filter size={18} className="mr-2 text-[#00b4d8]" /> 
            Filtres avancés
          </h2>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-900 dark:hover:text-white"
            onClick={onCloseMobile}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 flex-1 space-y-6">
          {/* 1. Wilaya */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Wilaya
            </label>
            <div className="relative">
              <select 
                value={filtres.wilaya}
                onChange={(e) => handleChange("wilaya", e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-[#00b4d8] focus:border-[#00b4d8] block p-2.5 appearance-none pr-8"
              >
                <option value="">Toutes les wilayas</option>
                {WILAYAS.map((w, idx) => (
                  <option key={idx} value={w}>{w}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* 2. Fourchette de prix */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Prix (DZD)
            </label>
            <div className="flex gap-2 items-center">
              <input 
                type="number" 
                placeholder="Min" 
                value={filtres.prix_min}
                onChange={(e) => handleChange("prix_min", e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-[#00b4d8] focus:border-[#00b4d8] p-2.5"
              />
              <span className="text-gray-500">-</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={filtres.prix_max}
                onChange={(e) => handleChange("prix_max", e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-[#00b4d8] focus:border-[#00b4d8] p-2.5"
              />
            </div>
          </div>

          {/* 3. État du produit */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              État
            </label>
            <div className="flex flex-col gap-2">
              {(["Tous", "Neuf", "Occasion"] as const).map(etat => (
                <label key={etat} className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center text-[#00b4d8]">
                    <input 
                      type="radio" 
                      name="etat" 
                      checked={filtres.etat === etat}
                      onChange={() => handleChange("etat", etat)}
                      className="w-4 h-4 text-[#00b4d8] bg-gray-100 border-gray-300 focus:ring-[#00b4d8] dark:ring-offset-[#1a1a2e] dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {etat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Catégorie */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Catégorie
            </label>
            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {CATEGORIES.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={filtres.categorie.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="w-4 h-4 text-[#00b4d8] bg-gray-100 border-gray-300 rounded focus:ring-[#00b4d8] dark:ring-offset-[#1a1a2e] dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. Vendeur vérifié */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Vendeur vérifié uniquement
              </span>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={filtres.verifie}
                  onChange={(e) => handleChange("verifie", e.target.checked)}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${filtres.verifie ? 'bg-[#00b4d8]' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${filtres.verifie ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </label>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="p-5 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-[#1a1a2e] flex flex-col gap-3">
          <button 
            onClick={handleApply}
            className="w-full bg-[#00b4d8] hover:bg-[#0096b4] text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
          >
            Appliquer les filtres
          </button>
          <button 
            onClick={handleReset}
            className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-2.5 rounded-lg transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </>
  );
}
