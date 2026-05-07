import React, { useState, useEffect, useMemo } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  Area,
  AreaChart,
  ReferenceLine
} from 'recharts';
import { TrendingDown, TrendingUp, Info, Calendar } from 'lucide-react';
import { motion } from "motion/react";

interface PricePoint {
  date: string;
  prix: number;
}

interface GraphiquePrixProps {
  produit_id: number;
}

export default function GraphiquePrix({ produit_id }: GraphiquePrixProps) {
  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // En conditions réelles : 
        // const res = await fetch(`http://127.0.0.1:8000/produits/${produit_id}/historique-prix`);
        // const history = await res.json();
        
        // Simulation de données pour la démo
        const mockData = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          return {
            date: date.toISOString().split('T')[0],
            prix: 180000 + Math.random() * 20000 - (i > 15 ? i * 500 : 0)
          };
        });
        
        setData(mockData);
      } catch (err) {
        console.error("Erreur chargement historique:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [produit_id]);

  const stats = useMemo(() => {
    if (data.length < 2) return null;
    const first = data[0].prix;
    const last = data[data.length - 1].prix;
    const min = Math.min(...data.map(d => d.prix));
    const minPoint = data.find(d => d.prix === min);
    const diff = last - first;
    const percent = (diff / first) * 100;
    
    return {
      isDown: diff < 0,
      percent: Math.abs(percent).toFixed(1),
      min: min,
      minDate: minPoint?.date,
      current: last
    };
  }, [data]);

  const formatPrice = (p: number) => new Intl.NumberFormat('fr-DZ').format(Math.round(p)) + " DA";

  if (loading) {
    return (
      <div className="h-80 w-full bg-gray-50 dark:bg-white/5 rounded-3xl animate-pulse flex items-center justify-center">
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Analyse de la tendance...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#111] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-black tracking-tight">Historique des prix</h3>
            <div className="group relative">
               <Info size={14} className="text-gray-300 cursor-help" />
               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-black text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 leading-relaxed font-bold">
                 Données collectées via nos scrapers IA sur les 30 derniers jours.
               </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
            <Calendar size={14} />
            30 derniers jours
          </div>
        </div>

        {stats && (
          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm ${
            stats.isDown ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {stats.isDown ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
            <span>Prix en {stats.isDown ? 'baisse' : 'hausse'} de {stats.percent}%</span>
          </div>
        )}
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stats?.isDown ? "#22c55e" : "#ef4444"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={stats?.isDown ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={stats?.isDown ? "#22c55e20" : "#ef444420"} />
            <XAxis 
              dataKey="date" 
              hide 
            />
            <YAxis 
              hide
              domain={['dataMin - 5000', 'dataMax + 5000']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#000', 
                border: 'none', 
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '900',
                color: '#fff',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ color: '#fff' }}
              labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
              formatter={(value: any) => [formatPrice(value), "Prix"]}
            />
            <Area 
              type="monotone" 
              dataKey="prix" 
              stroke={stats?.isDown ? "#22c55e" : "#ef4444"} 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              animationDuration={2000}
            />
            {stats && (
              <ReferenceLine 
                y={stats.min} 
                stroke="#666" 
                strokeDasharray="3 3" 
                label={{ value: 'Plus bas', position: 'insideBottomLeft', fill: '#999', fontSize: 10, fontWeight: 900 }} 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-50 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400">
            <TrendingDown size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Prix le plus bas</p>
            <p className="font-black text-gray-900 dark:text-white">
              {stats ? formatPrice(stats.min) : '---'}
              <span className="ml-2 text-[10px] text-gray-400">
                ({stats?.minDate ? `le ${new Date(stats.minDate).toLocaleDateString()}` : ''})
              </span>
            </p>
          </div>
        </div>
        
        <div className="px-6 py-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500">
          Source : Scrapers Habibou
        </div>
      </div>
    </div>
  );
}
