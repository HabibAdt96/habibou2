import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const app = express();
app.use(express.json());

// Initialize SQLite DB
const db = new Database("comparateur.db", { verbose: console.log });

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS produits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titre TEXT NOT NULL,
    description TEXT,
    categorie TEXT NOT NULL,
    etat TEXT DEFAULT 'neuf',
    prix INTEGER NOT NULL,
    ancien_prix INTEGER,
    wilaya TEXT NOT NULL,
    image_url TEXT,
    vendeur_nom TEXT NOT NULL,
    nb_offres INTEGER DEFAULT 1,
    est_meilleur_prix BOOLEAN DEFAULT 1,
    nb_vues INTEGER DEFAULT 0,
    statut TEXT DEFAULT 'actif',
    cree_le DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert initial mock data to test the UI if table is empty
const stmtCount = db.prepare("SELECT COUNT(*) as count FROM produits");
const rowsCount = stmtCount.get() as { count: number };
if (rowsCount.count === 0) {
  const stmtInsert = db.prepare(`
    INSERT INTO produits (titre, categorie, etat, prix, ancien_prix, wilaya, image_url, vendeur_nom, nb_offres, est_meilleur_prix)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmtInsert.run("Samsung Galaxy S24 Ultra", "Smartphones", "neuf", 195000, 210000, "Alger - 16", "https://picsum.photos/400/300?random=1", "TechStore", 5, 1);
  stmtInsert.run("iPhone 15 Pro Max 256Go", "Smartphones", "neuf", 240000, 260000, "Oran - 31", "https://picsum.photos/400/300?random=2", "iShop", 3, 1);
  stmtInsert.run("MacBook Pro M3 14 pouces", "PC Portables", "neuf", 320000, 350000, "Sétif - 19", "https://picsum.photos/400/300?random=3", "GigaInfo", 2, 0);
  stmtInsert.run("PlayStation 5 Slim Edition", "Jeux Vidéo", "occasion", 115000, null, "Blida - 09", "https://picsum.photos/400/300?random=4", "GamingDZ", 8, 1);
}

// Price Badge Route (Non-AI logic)
app.get("/api/produits/:id/badge-prix", (req, res) => {
  const { id } = req.params;
  const current_price = parseFloat(req.query.current_price as string);
  
  // Simulation: market average based on ID
  const market_avg = parseInt(id) % 2 === 0 ? 150000 : 220000;
  
  const diff_percent = ((current_price - market_avg) / market_avg) * 100;
  
  let badge = "CONSEILLE";
  let couleur = "green";
  let message = "Le prix est tout à fait dans la moyenne du marché algérien.";
  
  if (diff_percent <= -30) {
    badge = "SUSPECT";
    couleur = "yellow";
    message = "Attention : Prix anormalement bas. Risque d'arnaque ou produit défectueux.";
  } else if (diff_percent <= -10) {
    badge = "BON_PLAN";
    couleur = "blue";
    message = "Excellente affaire ! Le prix est nettement sous la moyenne.";
  } else if (diff_percent >= 15) {
    badge = "ELEVE";
    couleur = "red";
    message = "Prix supérieur au marché. Pensez à négocier ou attendre une baisse.";
  } else if (Math.abs(diff_percent) < 10) {
    badge = "CONSEILLE";
    couleur = "green";
    message = "Prix juste et équilibré par rapport à la concurrence.";
  }

  res.json({
    badge,
    couleur,
    message,
    pourcentage_ecart: Math.round(diff_percent * 10) / 10,
    prix_moyen: market_avg
  });
});

// Payment Rules Route (Non-AI logic)
app.get("/api/commandes/calculer-paiement", (req, res) => {
  const prix = parseFloat(req.query.prix as string);
  
  // Simple rules simulation
  let acompte = 0;
  let mode = "Paiement à la livraison (COD)";
  let type_acompte = "cod_only";
  let message = "Payez la totalité à la livraison.";
  
  if (prix > 100000) {
    acompte = Math.round(prix * 0.2);
    type_acompte = "deposit_percent";
    message = `Acompte de 20% (${acompte} DA) requis pour les produits de luxe.`;
  }

  res.json({
    mode,
    acompte,
    type_acompte,
    escrow_actif: true,
    message
  });
});

// API Routes (Produits)
app.get("/api/produits", (req, res) => {
  const { search } = req.query;
  let query = "SELECT * FROM produits WHERE statut = 'actif'";
  let params: any[] = [];
  
  if (search) {
    query += " AND titre LIKE ?";
    params.push(`%${search}%`);
  }
  
  query += " ORDER BY cree_le DESC LIMIT 50";
  const stmt = db.prepare(query);
  const produits = stmt.all(...params);
  
  // Return boolean integers as boolean for ease
  const result = produits.map((p: any) => ({
    ...p,
    est_meilleur_prix: p.est_meilleur_prix === 1
  }));
  res.json(result);
});

app.get("/api/produits/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("SELECT * FROM produits WHERE id = ?");
  const produit: any = stmt.get(id);
  
  if (produit) {
    produit.est_meilleur_prix = produit.est_meilleur_prix === 1;
    res.json(produit);
  } else {
    res.status(404).json({ error: "Produit non trouvé" });
  }
});

app.post("/api/produits", (req, res) => {
  const { titre, description, categorie, etat, prix, wilaya, image_url, vendeur_nom, nb_offres } = req.body;
  
  try {
    const stmt = db.prepare(`
      INSERT INTO produits (titre, description, categorie, etat, prix, wilaya, image_url, vendeur_nom, nb_offres)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(titre, description, categorie, etat, prix, wilaya, image_url, vendeur_nom, nb_offres || 1);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    console.error("DB Insert Error:", err);
    res.status(500).json({ error: "Erreur lors de la création du produit" });
  }
});

app.get("/sitemap.xml", (req, res) => {
  const stmt = db.prepare("SELECT id FROM produits WHERE statut = 'actif'");
  const products = stmt.all() as { id: number }[];
  
  const baseUrl = "https://habibou.com"; // URL réelle en production
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  
  // Accueil
  xml += `<url><loc>${baseUrl}/</loc><priority>1.0</priority></url>`;
  xml += `<url><loc>${baseUrl}/recherche</loc><priority>0.8</priority></url>`;
  xml += `<url><loc>${baseUrl}/compare</loc><priority>0.8</priority></url>`;
  
  // Produits
  products.forEach(p => {
    xml += `<url><loc>${baseUrl}/produit/${p.id}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>`;
  });
  
  xml += '</urlset>';
  
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Vite middleware for dev
async function startServer() {
  const app = express();
  app.use(express.json());

  // Re-declare routes inside startServer if needed or just use the app initialized above
  // Actually, I'll stick to a clean pattern.
}

// CLEANED UP START SERVER
async function run() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on http://localhost:" + PORT);
  });
}

run();
