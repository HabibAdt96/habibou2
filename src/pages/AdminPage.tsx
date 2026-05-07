import React, { useState } from "react";
import { 
  Users, 
  Package, 
  Eye, 
  BrainCircuit, 
  ShieldCheck, 
  Globe, 
  AlertTriangle, 
  Terminal, 
  LayoutDashboard, 
  BarChart3, 
  UserCheck, 
  Settings, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Search,
  CheckCircle2,
  XCircle,
  Wand2,
  RefreshCw,
  Bell,
  MapPin
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import Header from "../components/Header";
import SEO from "../components/SEO";

// Données fictives pour les graphiques
const CATEGORY_DATA = [
  { name: "Smartphones", value: 400 },
  { name: "Laptops", value: 300 },
  { name: "Appareils Photo", value: 200 },
  { name: "Consoles", value: 150 },
  { name: "Electroménager", value: 100 },
];

const NEW_PRODUCTS_DATA = [
  { day: "01", count: 45 }, { day: "05", count: 52 }, { day: "10", count: 38 },
  { day: "15", count: 65 }, { day: "20", count: 48 }, { day: "25", count: 70 },
  { day: "30", count: 55 },
];

const VISITORS_DATA = [
  { hour: "00h", users: 120 }, { hour: "04h", users: 45 }, { hour: "08h", users: 310 },
  { hour: "12h", users: 850 }, { hour: "16h", users: 950 }, { hour: "20h", users: 1100 },
  { hour: "23h", users: 400 },
];

const COLORS = ["#00b4d8", "#0077b6", "#90e0ef", "#03045e", "#caf0f8"];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const statCards = [
    { title: "Produits Actifs", value: "12,450", change: "+12%", up: true, icon: Package, color: "text-blue-500" },
    { title: "Visiteurs (Aujourd'hui)", value: "5,840", change: "+8%", up: true, icon: Eye, color: "text-green-500" },
    { title: "Nouvelles Annonces", value: "842", change: "-3%", up: false, icon: Users, color: "text-orange-500" },
    { title: "Coût IA (Mois)", value: "$142.50", change: "+$12.30", up: true, icon: BrainCircuit, color: "text-purple-500" },
  ];

  const sellersToVerify = [
    { id: 1, name: "Informatique DZ", shop: "Alger", date: "04/05/2026", status: "En attente" },
    { id: 2, name: "Samir Mobile", shop: "Oran", date: "05/05/2026", status: "En attente" },
    { id: 3, name: "Electra Biskra", shop: "Biskra", date: "02/05/2026", status: "Priorité" },
  ];

  const scrapingSites = [
    { name: "Ouedkniss", status: "success", lastRun: "Il y a 5 min", latency: "450ms" },
    { name: "Jumia DZ", status: "warning", lastRun: "Il y a 12 min", latency: "1.2s" },
    { name: "Iris Algérie", status: "error", lastRun: "Echec - Sélecteur", latency: "N/A" },
  ];

  const brokenSelectors = [
    { site: "Ouedkniss", field: "Prix", error: "NaN value", impact: "Elevé" },
    { site: "Raylan", field: "Image_URL", error: "404 Not Found", impact: "Moyen" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] font-sans text-gray-900 dark:text-gray-100 flex">
      <SEO title="Administration - Habibou" description="Tableau de bord administrateur." />
      
      {/* SIDEBAR */}
      <aside className="w-80 border-r border-gray-100 dark:border-white/5 bg-white dark:bg-[#111] flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-lg border border-gray-100 p-1">
              <img src="https://i.imgur.com/7tAtXrv.png" alt="Habibou" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h1 className="font-black text-lg leading-none">Habibou Admin</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">HABIBOU v2.0</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {[
              { id: "overview", label: "Vue Globale", icon: LayoutDashboard },
              { id: "moderation", label: "Modération", icon: ShieldCheck },
              { id: "sites", label: "Sites & Scraping", icon: Globe },
              { id: "sellers", label: "Vendeurs", icon: Users },
              { id: "reports", label: "Rapports", icon: BarChart3 },
              { id: "settings", label: "Configuration", icon: Settings },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-sm uppercase tracking-tighter ${
                  activeTab === item.id 
                  ? 'bg-[#00b4d8]/10 text-[#00b4d8]' 
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-orange-500 overflow-hidden border-2 border-white dark:border-white/10">
              <img src="https://ui-avatars.com/api/?name=Admin+DZ&background=ff9f43&color=fff" alt="" />
            </div>
            <div>
              <p className="font-black text-sm">Super Admin</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Connecté</p>
            </div>
          </div>
          <button className="w-full bg-red-500/10 text-red-500 font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
            Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2 uppercase">Tableau de Bord</h2>
            <p className="text-gray-400 font-bold">Mise à jour en temps réel • {new Date().toLocaleDateString('fr-DZ')}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-4 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 text-gray-400 hover:text-[#00b4d8] transition-colors relative">
              <Bell size={24} />
              <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-4 border-white dark:border-[#111]"></span>
            </button>
            <div className="bg-[#00b4d8] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#00b4d8]/20 cursor-pointer">
              Exporter les données
            </div>
          </div>
        </header>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {statCards.map((card, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-[#111] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-gray-50 dark:bg-white/5 ${card.color}`}>
                  <card.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-black ${card.up ? 'text-green-500' : 'text-red-500'}`}>
                  {card.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {card.change}
                </div>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{card.title}</p>
              <h3 className="text-3xl font-black tracking-tighter">{card.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* New Products Bar Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-[#111] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5">
            <h3 className="text-xl font-black mb-10 uppercase tracking-tight flex items-center justify-between">
              Nouveaux produits par jour
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-[#00b4d8] rounded-full"></div>
                <div className="text-[10px] font-black text-gray-400 uppercase">30 derniers jours</div>
              </div>
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={NEW_PRODUCTS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', borderRadius: '20px', border: 'none', color: '#fff' }}
                    itemStyle={{ color: '#00b4d8' }}
                  />
                  <Bar dataKey="count" fill="#00b4d8" radius={[10, 10, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categories Pie Chart */}
          <div className="bg-white dark:bg-[#111] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5">
            <h3 className="text-xl font-black mb-10 uppercase tracking-tight">Par Catégorie</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {CATEGORY_DATA.map((cat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TABLES ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sellers to Verify */}
          <div className="bg-white dark:bg-[#111] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-4">
                <UserCheck className="text-[#00b4d8]" />
                Vendeurs à vérifier
              </h3>
              <span className="bg-[#00b4d8]/10 text-[#00b4d8] text-[10px] font-black px-4 py-1.5 rounded-full">3 NOUVEAUX</span>
            </div>
            
            <div className="space-y-4">
              {sellersToVerify.map(seller => (
                <div key={seller.id} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 group hover:border-[#00b4d8] transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white dark:bg-black rounded-2xl flex items-center justify-center font-black text-[#00b4d8] shadow-sm">
                      {seller.name[0]}
                    </div>
                    <div>
                      <h4 className="font-black text-sm mb-1">{seller.name}</h4>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <MapPin size={12} /> {seller.shop}
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        {seller.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-3 bg-green-500 text-white rounded-xl hover:scale-110 transition-transform">
                      <CheckCircle2 size={18} />
                    </button>
                    <button className="p-3 bg-red-500 text-white rounded-xl hover:scale-110 transition-transform">
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scraping Status */}
          <div className="bg-white dark:bg-[#111] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-4">
                <Globe className="text-[#00b4d8]" />
                Système de Scraping
              </h3>
              <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#00b4d8]">
                <RefreshCw size={16} /> Relancer tout
              </button>
            </div>

            <div className="space-y-6">
              {scrapingSites.map((site, i) => (
                <div key={i} className="flex flex-col gap-4 p-6 border border-gray-100 dark:border-white/5 rounded-[2rem]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full animate-pulse ${
                        site.status === 'success' ? 'bg-green-500' : 
                        site.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                      }`}></div>
                      <h4 className="font-black text-lg">{site.name}</h4>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{site.lastRun}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Latence : <span className="text-black dark:text-white">{site.latency}</span></div>
                    {site.status === 'error' && (
                      <button className="flex items-center gap-2 bg-purple-500 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-tighter hover:scale-105 transition-transform">
                        <Wand2 size={14} /> Réparer avec IA
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LOGS SECTION */}
        <div className="mt-12 bg-black text-green-400 p-10 rounded-[3rem] border border-white/10 font-mono text-xs overflow-hidden h-80 relative">
          <div className="absolute top-6 right-10 flex items-center gap-3">
             <div className="w-2 h-2 bg-red-400 rounded-full"></div>
             <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
             <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <h3 className="text-white font-black mb-8 border-b border-white/10 pb-4 uppercase tracking-widest flex items-center gap-3">
            <Terminal size={18} />
            Live Logs: Telegram Bot & Workers
          </h3>
          <div className="space-y-3 opacity-80">
            <p>[21:09:12] <span className="text-white">INFO</span> - Telegram Bot started successfully (@Habibou_Bot)</p>
            <p>[21:09:15] <span className="text-blue-400">SYNC</span> - Meilisearch index 'produits' updated (452 docs)</p>
            <p>[21:09:40] <span className="text-yellow-400">WARN</span> - Slow response from Ouedkniss Proxy (1.2s)</p>
            <p>[21:10:05] <span className="text-green-400">DATA</span> - User 'habib_dz' registered via Google Auth</p>
            <p>[21:10:30] <span className="text-red-400">FAIL</span> - Could not scrape Iris.dz - Selector #price_val missing</p>
            <p className="animate-pulse">_</p>
          </div>
        </div>
      </main>
    </div>
  );
}
