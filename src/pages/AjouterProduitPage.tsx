import React, { useState, useRef } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Upload, 
  X, 
  Smartphone, 
  Laptop, 
  Tv, 
  Headphones, 
  Gamepad2, 
  Home, 
  Shirt, 
  Car, 
  Layout,
  Plus,
  Image as ImageIcon,
  AlertCircle,
  Loader2
} from "lucide-react";
import Header from "../components/Header";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";

const WILAYAS = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna", 
  "06 - Béjaïa", "07 - Biskra", "08 - Béchar", "09 - Blida", "10 - Bouira", 
  "11 - Tamanrasset", "12 - Tébessa", "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou", 
  "16 - Alger", "17 - Djelfa", "18 - Jijel", "19 - Sétif", "20 - Saïda", 
  "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma", "25 - Constantine", 
  "26 - Médéa", "27 - Mostaganem", "28 - M'Sila", "29 - Mascara", "30 - Ouargla", 
  "31 - Oran", "32 - El Bayadh", "33 - Illizi", "34 - Bordj Bou Arreridj", "35 - Boumerdès", 
  "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela", 
  "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla", "45 - Naâma", 
  "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane", "49 - El M'Ghair", "50 - El Meniaâ",
  "51 - Ouled Djellal", "52 - Bordj Baji Mokhtar", "53 - Béni Abbès", "54 - Timimoun", "55 - Touggourt",
  "56 - Djanet", "57 - In Salah", "58 - In Guezzam"
];

const CATEGORIES = [
  { id: "smartphones", label: "Smartphones", icon: <Smartphone size={20} /> },
  { id: "pc", label: "PC", icon: <Laptop size={20} /> },
  { id: "tv", label: "TV", icon: <Tv size={20} /> },
  { id: "audio", label: "Audio", icon: <Headphones size={20} /> },
  { id: "electromenager", label: "Électroménager", icon: <Home size={20} /> },
  { id: "mode", label: "Mode", icon: <Shirt size={20} /> },
  { id: "auto", label: "Auto", icon: <Car size={20} /> },
  { id: "jeux", label: "Jeux", icon: <Gamepad2 size={20} /> },
  { id: "autres", label: "Autres", icon: <Layout size={20} /> },
];

export default function AjouterProduitPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    titre: "",
    categorie: "",
    etat: "neuf",
    prix: "",
    wilaya: "",
    description: "",
    images: [] as string[]
  });
  const [dragActive, setDragActive] = useState(false);
  const [generating, setGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const generateWithAI = async () => {
    if (!formData.titre || !formData.categorie || !formData.prix) {
      alert("Veuillez remplir le titre, la catégorie et le prix avant de générer la description.");
      return;
    }

    setGenerating(true);
    try {
      const prompt = `
        Génère une description courte (50 mots max) en français pour ce produit algérien : 
        Titre : ${formData.titre}
        Catégorie : ${formData.categorie}
        Prix : ${formData.prix} DA
        
        Style : factuel, direct, sans superlatifs, adapté au marché algérien.
      `;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });

      if (response.text) {
        setFormData(prev => ({ ...prev, description: response.text!.trim() }));
      }
    } catch (err) {
      console.error("Erreur génération AI:", err);
    } finally {
      setGenerating(false);
    }
  };

  const validateStep = () => {
    if (step === 1) {
      return formData.titre.length > 5 && formData.categorie && formData.wilaya && formData.prix;
    }
    if (step === 2) {
      return formData.images.length >= 1;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (formData.images.length >= 5) return;
    
    // Simulation upload
    const newImages = [...formData.images];
    for (let i = 0; i < files.length; i++) {
       if (newImages.length < 5) {
         // Dans une vraie app : POST http://127.0.0.1:8000/upload-image/
         newImages.push(URL.createObjectURL(files[i]));
       }
    }
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async () => {
    try {
      // Dans une vraie app : POST http://127.0.0.1:8000/produits/
      const res = await fetch("/api/produits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          prix: Number(formData.prix),
          vendeur_nom: "Habib Store",
          image_url: formData.images[0] || "",
          nb_offres: 1
        })
      });
      if (res.ok) {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Erreur publication:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] font-sans text-gray-900 dark:text-gray-100 flex flex-col">
      <Header />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        
        {/* PROGRESS HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black mb-2 tracking-tight">Vendre un article</h1>
          <p className="text-gray-500 font-medium">Étape {step} sur 3 — {step === 1 ? "Informations" : step === 2 ? "Photos" : "Confirmation"}</p>
        </div>

        <div className="mb-12 relative max-w-lg mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#00b4d8] shadow-[0_0_15px_rgba(0,180,216,0.5)]" 
              initial={{ width: "0%" }}
              animate={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
          <div className="flex justify-between relative z-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 border-4 border-gray-50 dark:border-[#0a0a0a] ${step >= s ? 'bg-[#00b4d8] text-white shadow-xl shadow-[#00b4d8]/20' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                {step > s ? <Check size={20} strokeWidth={3} /> : s}
              </div>
            ))}
          </div>
        </div>

        {/* CONTAINER FORMULAIRE */}
        <div className="bg-white dark:bg-[#111] rounded-[2.5rem] shadow-2xl shadow-black/5 border border-gray-100 dark:border-gray-800 p-8 md:p-12">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="col-span-full">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Titre de l'annonce</label>
                    <input 
                      name="titre"
                      value={formData.titre}
                      onChange={handleInputChange}
                      placeholder="ex: Apple iPhone 15 Pro Max 256Go titane naturel" 
                      className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#00b4d8] rounded-2xl px-6 py-4 outline-none text-lg font-bold transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Catégorie</label>
                    <select 
                      name="categorie"
                      value={formData.categorie}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#00b4d8] rounded-2xl px-6 py-4 outline-none font-bold appearance-none transition-all"
                    >
                      <option value="">Choisir...</option>
                      {CATEGORIES.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Wilaya</label>
                    <select 
                      name="wilaya"
                      value={formData.wilaya}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#00b4d8] rounded-2xl px-6 py-4 outline-none font-bold appearance-none transition-all"
                    >
                      <option value="">Alger, Oran, Sétif...</option>
                      {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">État du produit</label>
                    <div className="flex bg-gray-50 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <button 
                        onClick={() => setFormData(p => ({ ...p, etat: 'neuf' }))}
                        className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${formData.etat === 'neuf' ? 'bg-white dark:bg-white/10 text-[#00b4d8] shadow-lg shadow-black/5' : 'text-gray-400'}`}
                      >NEUF</button>
                      <button 
                        onClick={() => setFormData(p => ({ ...p, etat: 'occasion' }))}
                        className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${formData.etat === 'occasion' ? 'bg-white dark:bg-white/10 text-[#00b4d8] shadow-lg shadow-black/5' : 'text-gray-400'}`}
                      >OCCASION</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Prix de vente (DA)</label>
                    <div className="relative">
                      <input 
                        name="prix"
                        value={formData.prix}
                        onChange={handleInputChange}
                        type="number"
                        placeholder="150,000" 
                        className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#00b4d8] rounded-2xl px-6 py-4 pr-16 outline-none text-2xl font-black text-[#00b4d8] transition-all"
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-400">DA</span>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description détaillée</label>
                      <button 
                        type="button"
                        onClick={generateWithAI}
                        disabled={generating}
                        className="flex items-center gap-2 bg-[#00b4d8]/10 text-[#00b4d8] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest hover:bg-[#00b4d8] hover:text-white transition-all disabled:opacity-50"
                      >
                        {generating ? <Loader2 size={12} className="animate-spin" /> : "✨ Générer avec l'IA"}
                      </button>
                    </div>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Décrivez l'état réel, les accessoires inclus, la durée d'utilisation..." 
                      className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#00b4d8] rounded-3xl px-6 py-5 outline-none font-medium transition-all"
                    ></textarea>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center max-w-md mx-auto mb-10">
                  <h2 className="text-2xl font-black mb-2">Des photos qui vendent 📸</h2>
                  <p className="text-gray-500 text-sm">Les annonces avec 3 photos ou plus sont vendues 2x plus vite.</p>
                </div>

                <div 
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative p-12 rounded-[2rem] border-4 border-dashed transition-all flex flex-col items-center justify-center text-center group cursor-pointer ${dragActive ? 'border-[#00b4d8] bg-[#00b4d8]/5' : 'border-gray-100 dark:border-gray-800 hover:border-[#00b4d8]/50 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
                  <div className="w-20 h-20 rounded-full bg-[#00b4d8]/10 text-[#00b4d8] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={32} />
                  </div>
                  <p className="text-lg font-black mb-1">Glissez vos photos ici</p>
                  <p className="text-sm text-gray-400 uppercase tracking-widest font-black">ou cliquez pour parcourir</p>
                  <p className="mt-6 text-[10px] text-gray-400 font-bold">PNG, JPG ou WEBP • MAX 5 MO par photo</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {formData.images.map((img, i) => (
                    <motion.div 
                      key={i} 
                      layoutId={`img-${i}`}
                      className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800"
                    >
                      <img src={img} className="w-full h-full object-cover" alt="preview" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                      {i === 0 && <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] font-black text-center py-1">UNE</div>}
                    </motion.div>
                  ))}
                  {[...Array(5 - formData.images.length)].map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-200 dark:text-gray-800">
                      <ImageIcon size={24} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-black mb-2">Dernière vérification 🔍</h2>
                  <p className="text-gray-500">Relisez bien votre annonce avant de la mettre en ligne.</p>
                </div>

                <div className="bg-gray-50 dark:bg-white/5 rounded-[2rem] p-8 space-y-8">
                   <div className="flex flex-col md:flex-row gap-8">
                      <div className="w-full md:w-48 h-48 bg-white dark:bg-[#111] rounded-3xl overflow-hidden shadow-sm shrink-0 flex items-center justify-center">
                         {formData.images[0] ? <img src={formData.images[0]} className="w-full h-full object-cover" /> : <ImageIcon size={48} className="text-gray-200" />}
                      </div>
                      <div className="flex-1 space-y-4">
                         <div>
                            <h3 className="text-2xl font-black leading-tight mb-2">{formData.titre}</h3>
                            <p className="text-3xl font-black text-[#00b4d8]">{Number(formData.prix).toLocaleString()} DA</p>
                         </div>
                         <div className="flex flex-wrap gap-2">
                           <span className="px-4 py-1.5 bg-white dark:bg-white/10 rounded-full text-xs font-bold uppercase">{formData.categorie}</span>
                           <span className="px-4 py-1.5 bg-white dark:bg-white/10 rounded-full text-xs font-bold uppercase">{formData.wilaya}</span>
                           <span className="px-4 py-1.5 bg-white dark:bg-white/10 rounded-full text-xs font-bold uppercase">{formData.etat}</span>
                         </div>
                      </div>
                   </div>
                   <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
                      <p className="text-xs font-black text-gray-400 mb-3 uppercase tracking-widest">Description</p>
                      <p className="text-gray-600 dark:text-gray-400 italic line-clamp-4">{formData.description || "Aucune description fournie."}</p>
                   </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl flex items-center gap-4 border border-blue-100 dark:border-blue-900/20">
                   <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                      <AlertCircle size={24} />
                   </div>
                   <p className="text-[13px] text-blue-800 dark:text-blue-300 font-medium">
                      Votre annonce sera examinée par notre équipe de modération sous 2 heures avant d'apparaître sur la plateforme.
                   </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ACTIONS */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
            {step > 1 ? (
              <button 
                onClick={prevStep}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
              >
                <ArrowLeft size={20} strokeWidth={3} /> Précédent
              </button>
            ) : <div />}
            
            {step < 3 ? (
              <button 
                onClick={nextStep}
                className={`flex items-center gap-3 bg-[#00b4d8] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-[#00b4d8]/30 transition-all hover:scale-105 active:scale-95 ${!validateStep() ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
                disabled={!validateStep()}
              >
                Continuer <ArrowRight size={20} strokeWidth={3} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                className="flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-black px-12 py-5 rounded-3xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                <Plus size={24} strokeWidth={3} /> Publier l'annonce
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-gray-900 py-12 mt-auto text-center text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest">
        <p>Habibou — Marketplace Algérie © 2026</p>
      </footer>
    </div>
  );
}
