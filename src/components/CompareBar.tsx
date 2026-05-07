import React from "react";
import { X, ArrowRight, Table } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CompareBarProps {
  items: any[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export default function CompareBar({ items, onRemove, onClear }: CompareBarProps) {
  const navigate = useNavigate();

  if (items.length < 2) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-2xl">
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-4 animate-in slide-in-from-bottom-10 duration-500">
        
        <div className="flex-1 flex gap-3 overflow-hidden">
          {items.map((item) => (
            <div key={item.id} className="relative group shrink-0">
              <div className="w-14 h-14 bg-gray-50 dark:bg-[#0f0f0f] rounded-xl border border-gray-100 dark:border-gray-800 p-1 flex items-center justify-center overflow-hidden">
                <img src={item.image_url} alt={item.titre} className="w-full h-full object-contain" />
              </div>
              <button 
                onClick={() => onRemove(item.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          {items.length < 4 && (
            <div className="w-14 h-14 bg-gray-50/50 dark:bg-[#0f0f0f]/50 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-center text-gray-300">
              <PlusIcon />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="hidden sm:block text-right">
             <p className="text-xs font-bold text-[#00b4d8]">{items.length}/4 PRODUITS</p>
             <button onClick={onClear} className="text-[10px] uppercase font-black text-gray-400 hover:text-red-500 transition-colors">Vider</button>
          </div>
          <button 
            onClick={() => navigate("/comparer")}
            className="bg-[#00b4d8] hover:bg-[#0096b4] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#00b4d8]/20 flex items-center gap-2 text-sm transition-all whitespace-nowrap"
          >
            Comparer <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  );
}
