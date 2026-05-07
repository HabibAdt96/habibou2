import React from "react";
import { Home, Search, PlusCircle, Heart, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-800 px-4 py-1 pb-safe-area shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        <button 
          onClick={() => navigate("/")}
          className={`flex flex-col items-center gap-0.5 p-1.5 transition-all ${isActive("/") ? 'text-[#00b4d8]' : 'text-gray-400'}`}
        >
          <Home size={18} strokeWidth={isActive("/") ? 3 : 2} />
          <span className="text-[8px] font-black uppercase tracking-tighter">Accueil</span>
        </button>

        <button 
          onClick={() => navigate("/recherche")}
          className={`flex flex-col items-center gap-0.5 p-1.5 transition-all ${isActive("/recherche") ? 'text-[#00b4d8]' : 'text-gray-400'}`}
        >
          <Search size={18} strokeWidth={isActive("/recherche") ? 3 : 2} />
          <span className="text-[8px] font-black uppercase tracking-tighter">Chercher</span>
        </button>

        <button 
          onClick={() => navigate("/dashboard/ajouter")}
          className="relative -top-4 flex flex-col items-center"
        >
          <div className="bg-[#00b4d8] text-white p-2.5 rounded-full shadow-lg shadow-[#00b4d8]/40 border-[3px] border-white dark:border-[#111]">
            <PlusCircle size={22} />
          </div>
          <span className="text-[8px] font-black uppercase tracking-tighter text-[#00b4d8] mt-0.5">Publier</span>
        </button>

        <button 
          onClick={() => navigate("/favoris")}
          className={`flex flex-col items-center gap-0.5 p-1.5 transition-all ${isActive("/favoris") ? 'text-[#00b4d8]' : 'text-gray-400'}`}
        >
          <Heart size={18} strokeWidth={isActive("/favoris") ? 3 : 2} />
          <span className="text-[8px] font-black uppercase tracking-tighter">Favoris</span>
        </button>

        <button 
          onClick={() => navigate("/dashboard")}
          className={`flex flex-col items-center gap-0.5 p-1.5 transition-all ${isActive("/dashboard") ? 'text-[#00b4d8]' : 'text-gray-400'}`}
        >
          <User size={18} strokeWidth={isActive("/dashboard") ? 3 : 2} />
          <span className="text-[8px] font-black uppercase tracking-tighter">Profil</span>
        </button>
      </div>
    </div>
  );
}
