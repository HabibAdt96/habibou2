import { useState } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown, Loader2, Search, Star, MapPin } from "lucide-react";

// ── Données mock pour la preview ───────────────────────────────────────────────
const MOCK_PRODUITS = Array.from({ length: 47 }, (_, i) => ({
  id: i + 1,
  titre: ["iPhone 15 Pro 256Go", "Samsung Galaxy S24", "PC Portable Lenovo", "MacBook Air M2", "PlayStation 5", "Climatiseur 18000 BTU", "Réfrigérateur Samsung", "TV Samsung 55\"", "Tablette iPad Pro", "AirPods Pro"][i % 10],
  prix: [185000, 142000, 98000, 310000, 118000, 75000, 62000, 88000, 145000, 32000][i % 10] + (i * 1000),
  ancien_prix: i % 3 === 0 ? ([200000, 160000, 110000, 340000, 130000, 85000, 70000, 99000, 160000, 38000][i % 10]) : undefined,
  image_url: `https://picsum.photos/seed/${i + 1}/300/200`,
  vendeur_nom: ["TechStore", "iShop", "GigaInfo", "ElectroDZ", "MediaStore"][i % 5],
  wilaya: ["Alger", "Oran", "Sétif", "Constantine", "Blida"][i % 5],
  categorie: ["Smartphones", "PC Portables", "TV", "Jeux Vidéo", "Électroménager"][i % 5],
  nb_offres: (i % 8) + 1,
  est_meilleur_prix: i % 4 === 0,
}));

const PAGE_SIZE = 9;

function CarteProduit({ id, titre, prix, ancien_prix, image_url, vendeur_nom, wilaya, nb_offres, est_meilleur_prix }) {
  const reduction = ancien_prix ? Math.round((1 - prix / ancien_prix) * 100) : null;
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      <div className="relative overflow-hidden bg-gray-100" style={{ height: 140 }}>
        <img src={image_url} alt={titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e => { e.target.style.display='none'; }} />
        {est_meilleur_prix && (
          <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Meilleur prix</span>
        )}
        {reduction && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{reduction}%</span>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2 mb-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{titre}</p>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-base font-bold text-[#00b4d8]">{prix.toLocaleString('fr-DZ')} DA</span>
          {ancien_prix && <span className="text-xs text-gray-400 line-through">{ancien_prix.toLocaleString()} DA</span>}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <span className="flex items-center gap-1"><MapPin size={10} />{wilaya}</span>
          <span>{nb_offres} offre{nb_offres > 1 ? 's' : ''}</span>
        </div>
        <div className="text-xs text-gray-400 mt-0.5 truncate">{vendeur_nom}</div>
      </div>
    </div>
  );
}

function Pagination({ page, pages, onPage }) {
  const getButtons = () => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    const btns = [1];
    if (page > 3) btns.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) btns.push(i);
    if (page < pages - 2) btns.push("...");
    btns.push(pages);
    return btns;
  };
  return (
    <div className="mt-8 flex justify-center items-center gap-1 flex-wrap">
      <button onClick={() => onPage(page - 1)} disabled={page <= 1}
        className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#00b4d8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <ChevronLeft size={18} />
      </button>
      {getButtons().map((btn, i) =>
        btn === "..." ? (
          <span key={"d" + i} className="w-8 text-center text-gray-400 text-sm">…</span>
        ) : (
          <button key={btn} onClick={() => onPage(btn)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${btn === page ? "bg-[#00b4d8] text-white shadow-sm" : "bg-white border border-gray-200 hover:border-[#00b4d8] text-gray-700"}`}>
            {btn}
          </button>
        )
      )}
      <button onClick={() => onPage(page + 1)} disabled={page >= pages}
        className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#00b4d8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("nouveautes");
  const [page, setPage] = useState(1);
  const [scraping, setScraping] = useState(false);
  const [input, setInput] = useState("");

  // Filtrage + tri
  let filtered = MOCK_PRODUITS.filter(p =>
    !search || p.titre.toLowerCase().includes(search.toLowerCase()) ||
    p.categorie.toLowerCase().includes(search.toLowerCase())
  );
  if (sort === "prix_croissant")  filtered.sort((a, b) => a.prix - b.prix);
  if (sort === "prix_decroissant") filtered.sort((a, b) => b.prix - a.prix);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const produits = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setScraping(true);
    setTimeout(() => {
      setSearch(input);
      setScraping(false);
      setPage(1);
    }, 1800); // simule scraping live
  };

  const goPage = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0077b6, #00b4d8)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Star size={20} color="white" fill="white" />
          </div>
          <span style={{ color: "white", fontWeight: 800, fontSize: 22 }}>Habibou</span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginLeft: 4 }}>Comparateur DZ</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "4px 12px", color: "white", fontSize: 12 }}>
          🇩🇿 DZD
        </div>
      </div>

      {/* Barre de recherche */}
      <div style={{ background: "white", padding: "16px 24px", borderBottom: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, maxWidth: 700, margin: "0 auto" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Rechercher un produit... (ex: iphone, climatiseur)"
              style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 10, paddingBottom: 10, border: "2px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "#00b4d8"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>
          <button type="submit"
            style={{ background: "#00b4d8", color: "white", border: "none", borderRadius: 10, padding: "0 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Search size={16} /> Chercher
          </button>
        </form>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>

        {/* En-tête résultats */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>
              {scraping ? "🔎 Scraping Ouedkniss en cours..." : `${total} résultat${total !== 1 ? "s" : ""}${search ? ` pour "${search}"` : ""}`}
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
              Page {safePage}/{pages} — Prix en Dinars Algériens (DZD)
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {search && (
              <button onClick={() => { setSearch(""); setInput(""); setPage(1); }}
                style={{ fontSize: 12, color: "#ef4444", border: "1px solid #fca5a5", background: "#fef2f2", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>
                ✕ Effacer
              </button>
            )}
            <div style={{ position: "relative" }}>
              <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
                style={{ padding: "8px 36px 8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 500, background: "white", appearance: "none", cursor: "pointer", outline: "none" }}>
                <option value="nouveautes">Nouveautés</option>
                <option value="prix_croissant">Prix croissant</option>
                <option value="prix_decroissant">Prix décroissant</option>
              </select>
              <ArrowUpDown size={13} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#6b7280", pointerEvents: "none" }} />
            </div>
          </div>
        </div>

        {/* Banner scraping */}
        {scraping && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "12px 16px", marginBottom: 16, color: "#1d4ed8", fontSize: 13 }}>
            <Loader2 size={16} style={{ animation: "spin 1s linear infinite", flexShrink: 0 }} />
            <span>Aucun résultat en cache — Scraping Ouedkniss en temps réel, patiente quelques secondes...</span>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Grille produits */}
        {!scraping && produits.length > 0 ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
              {produits.map(p => <CarteProduit key={p.id} {...p} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ marginTop: 32, display: "flex", justifyContent: "center", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                <button onClick={() => goPage(safePage - 1)} disabled={safePage <= 1}
                  style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: safePage <= 1 ? "not-allowed" : "pointer", opacity: safePage <= 1 ? 0.4 : 1, display: "flex", alignItems: "center" }}>
                  <ChevronLeft size={18} color="#6b7280" />
                </button>

                {(() => {
                  const btns = [];
                  if (pages <= 7) { for (let i = 1; i <= pages; i++) btns.push(i); }
                  else {
                    btns.push(1);
                    if (safePage > 3) btns.push("...");
                    for (let i = Math.max(2, safePage - 1); i <= Math.min(pages - 1, safePage + 1); i++) btns.push(i);
                    if (safePage < pages - 2) btns.push("...");
                    btns.push(pages);
                  }
                  return btns.map((btn, i) =>
                    btn === "..." ? (
                      <span key={"d" + i} style={{ width: 32, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>…</span>
                    ) : (
                      <button key={btn} onClick={() => goPage(btn)}
                        style={{ width: 36, height: 36, borderRadius: 8, border: btn === safePage ? "none" : "1px solid #e5e7eb", background: btn === safePage ? "#00b4d8" : "white", color: btn === safePage ? "white" : "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.15s" }}>
                        {btn}
                      </button>
                    )
                  );
                })()}

                <button onClick={() => goPage(safePage + 1)} disabled={safePage >= pages}
                  style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: safePage >= pages ? "not-allowed" : "pointer", opacity: safePage >= pages ? 0.4 : 1, display: "flex", alignItems: "center" }}>
                  <ChevronRight size={18} color="#6b7280" />
                </button>
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "#9ca3af" }}>
              Affichage {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, total)} sur {total} produits · 20/page en production
            </div>
          </>
        ) : !scraping ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 56 }}>🔍</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: "#111827", marginTop: 16 }}>Aucun produit trouvé</div>
            <div style={{ color: "#6b7280", marginTop: 8 }}>Essaie un autre mot-clé — ex: "iphone", "samsung", "laptop"</div>
            <button onClick={() => { setSearch(""); setInput(""); setPage(1); }}
              style={{ marginTop: 20, color: "#00b4d8", fontWeight: 700, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: 14 }}>
              Voir tous les produits
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
