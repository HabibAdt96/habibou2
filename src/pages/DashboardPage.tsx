import React from "react";
import { 
  Package, 
  MessageSquare, 
  ShoppingBag, 
  User, 
  Settings, 
  LogOut, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  TrendingUp,
  Search,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import Header from "../components/Header";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  
  const stats = [
    { label: "Total produits publiés", value: "12", icon: <Package size={20} />, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/10" },
    { label: "Vues ce mois", value: "1,234", icon: <Eye size={20} />, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/10" },
    { label: "Messages reçus", value: "8", icon: <MessageSquare size={20} />, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/10" },
    { label: "Ventes réalisées", value: "450 000 DA", icon: <TrendingUp size={20} />, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/10" },
  ];

  const products = [
    { id: 1, title: "Samsung S24 Ultra", price: "195 000 DA", status: "Actif", views: 234, img: "https://images.unsplash.com/photo-1707064953765-a82f3c3a7024?auto=format&fit=crop&q=80&w=100" },
    { id: 2, title: "iPhone 15 Pro Max 256Go", price: "240 000 DA", status: "Actif", views: 567, img: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=100" },
    { id: 3, title: "MacBook Pro M3 14 pouces", price: "320 000 DA", status: "En pause", views: 89, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=100" },
    { id: 4, title: "PlayStation 5 Slim Edition", price: "115 000 DA", status: "Actif", views: 120, img: "https://images.unsplash.com/photo-1606813907291-d86ebb9474ad?auto=format&fit=crop&q=80&w=100" },
  ];

  const sidebarItems = [
    { label: "Mon profil", icon: <User size={20} />, path: "/dashboard/profil" },
    { label: "Mes produits", icon: <Package size={20} />, path: "/dashboard" },
    { label: "Mes commandes", icon: <ShoppingBag size={20} />, path: "/dashboard/commandes" },
    { label: "Mes messages", icon: <MessageSquare size={20} />, path: "/dashboard/messages" },
    { label: "Paramètres boutique", icon: <Settings size={20} />, path: "/dashboard/parametres" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] font-sans text-gray-900 dark:text-gray-100 flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* SIDEBAR GAUCHE */}
        <aside className="w-full md:w-72 shrink-0 border-r border-gray-100 dark:border-gray-800">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-[#111] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-28"
          >
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col items-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#00b4d8] to-blue-600 p-1 mb-3">
                  <div className="w-full h-full rounded-full bg-white dark:bg-[#111] flex items-center justify-center overflow-hidden">
                    <img src="https://i.pravatar.cc/150?u=habib" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-[#111]"></div>
              </div>
              <h3 className="font-black text-lg">Habib Store</h3>
              <p className="text-xs text-gray-500 font-bold flex items-center gap-1 mt-1">
                <ShieldCheck size={14} className="text-blue-500" /> Vendeur vérifié
              </p>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <button className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-[#00b4d8] text-white font-bold transition-all shadow-lg shadow-[#00b4d8]/20">
                    <div className="flex items-center gap-3">
                      <LayoutDashboard size={20} />
                      Dashboard
                    </div>
                    <ChevronRight size={16} />
                  </button>
                </li>
                {sidebarItems.map((item, idx) => (
                  <li key={idx}>
                    <button className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all font-bold">
                      <span className="opacity-70">{item.icon}</span>
                      {item.label}
                    </button>
                  </li>
                ))}
                <li className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                  <button className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all font-bold group">
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Déconnexion
                  </button>
                </li>
              </ul>
            </nav>
          </motion.div>
        </aside>

        {/* CONTENU DASHBOARD */}
        <div className="flex-1 space-y-8">
          
          {/* Header Dashboard */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
             <div>
               <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Salut, Habib 👋</h2>
               <p className="text-gray-500 font-medium">Voici ce qui se passe dans votre boutique aujourd'hui.</p>
             </div>
             <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/dashboard/ajouter")}
              className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black shadow-xl transition-all"
             >
               <Plus size={20} strokeWidth={3} /> Ajouter un produit
             </motion.button>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-[#111] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5 transition-all hover:shadow-md group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-black">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* SECTION PRODUITS - TABLEAU */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-[#111] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
               <div>
                 <h3 className="font-black text-xl">Mes produits</h3>
                 <p className="text-sm text-gray-500 font-medium">Gérez vos annonces et surveillez leurs performances.</p>
               </div>
               <div className="relative w-full sm:w-80">
                 <input 
                  type="text" 
                  placeholder="Rechercher par titre ou prix..." 
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#00b4d8]/20 transition-all"
                 />
                 <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
               </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="px-8 py-5">Image</th>
                    <th className="px-8 py-5">Titre</th>
                    <th className="px-8 py-5">Prix</th>
                    <th className="px-8 py-5">Statut</th>
                    <th className="px-8 py-5">Vues</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium">
                  {products.map((p, idx) => (
                    <motion.tr 
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + (idx * 0.05) }}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 group-hover:scale-105 transition-transform duration-300">
                          <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="font-black text-sm text-gray-900 dark:text-white line-clamp-1">{p.title}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: #DZ-00{p.id}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-black text-[#00b4d8] text-sm">{p.price}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${p.status === 'Actif' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                           <span className={`text-[11px] font-black uppercase tracking-tighter ${p.status === 'Actif' ? 'text-green-600' : 'text-gray-500'}`}>
                             {p.status === 'Actif' ? '✅ Actif' : '⏸️ En pause'}
                           </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100/50 dark:bg-white/5 rounded-full w-fit">
                          <Eye size={14} className="text-gray-400" />
                          <span className="text-xs font-black">{p.views}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-3">
                          <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                            <Edit size={14} /> Modifier
                          </button>
                          <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-8 bg-gray-50/50 dark:bg-white/5 flex justify-center">
              <button className="flex items-center gap-2 text-sm font-black text-gray-500 dark:text-gray-400 hover:text-[#00b4d8] transition-colors group">
                Consulter tout l'historique 
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <footer className="bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-gray-900 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Habibou • Vendeur Hub</p>
          <p className="text-gray-300 dark:text-gray-600 text-[10px] font-medium italic">Plateforme de comparaison numéro 1 en Algérie</p>
        </div>
      </footer>
    </div>
  );
}
