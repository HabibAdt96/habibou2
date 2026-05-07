const express = require('express');
const router = express.Router();
const db = require('../models/database');
const { analyserPrix } = require('../services/analyseService');

// GET /api/produits  — avec filtres search, categorie, wilaya
router.get('/', (req, res) => {
  try {
    const { search, categorie, wilaya, etat, prix_min, prix_max } = req.query;
    let query = "SELECT * FROM produits WHERE statut = 'actif'";
    const params = [];

    if (search) { query += ' AND titre LIKE ?'; params.push(`%${search}%`); }
    if (categorie) { query += ' AND LOWER(categorie) LIKE ?'; params.push(`%${categorie.toLowerCase()}%`); }
    if (wilaya) { query += ' AND wilaya LIKE ?'; params.push(`%${wilaya}%`); }
    if (etat && etat !== 'Tous') { query += ' AND LOWER(etat) = ?'; params.push(etat.toLowerCase()); }
    if (prix_min) { query += ' AND prix >= ?'; params.push(Number(prix_min)); }
    if (prix_max) { query += ' AND prix <= ?'; params.push(Number(prix_max)); }

    query += ' ORDER BY id DESC LIMIT 200';
    res.json(db.prepare(query).all(...params));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/produits/:id
router.get('/:id', (req, res) => {
  try {
    const p = db.prepare('SELECT * FROM produits WHERE id = ?').get(req.params.id);
    if (!p) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json(p);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/produits
router.post('/', (req, res) => {
  try {
    const { titre, description, categorie, etat, prix, wilaya, image_url, vendeur_nom } = req.body;
    const info = db.prepare(`
      INSERT INTO produits (titre, description, categorie, etat, prix, wilaya, image_url, vendeur_nom, source_site)
      VALUES (?,?,?,?,?,?,?,?,'utilisateur')
    `).run(titre, description||'', categorie||'Autres', etat||'neuf', prix, wilaya||'Algérie', image_url||'', vendeur_nom||'Moi');
    res.status(201).json({ id: info.lastInsertRowid, message: 'Produit créé avec succès' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/produits/:id/badge-prix  (compatible BadgePrix.tsx)
router.get('/:id/badge-prix', (req, res) => {
  try {
    const prix = parseFloat(req.query.current_price || req.query.currentprice || 0);
    if (!prix) return res.status(400).json({ error: 'current_price requis' });
    const analyse = analyserPrix(req.params.id, prix);
    if (!analyse) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json(analyse);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/produits/:id/historique-prix  (compatible GraphiquePrix.tsx)
router.get('/:id/historique-prix', (req, res) => {
  try {
    const produit = db.prepare('SELECT * FROM produits WHERE id = ?').get(req.params.id);
    if (!produit) return res.status(404).json({ error: 'Produit non trouvé' });

    let historique = db.prepare(
      'SELECT scrape_le as date, prix FROM prix_historique WHERE produit_id = ? ORDER BY scrape_le ASC'
    ).all(req.params.id);

    // Générer un historique simulé réaliste si vide
    if (historique.length === 0) {
      const base = produit.prix;
      historique = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const variation = (Math.random() * 0.12 - 0.04); // -4% à +8%
        const tendance = i > 20 ? -0.005 * (i - 20) : 0; // légère baisse récente
        return {
          date: date.toISOString().split('T')[0],
          prix: Math.max(100, Math.round(base * (1 + variation + tendance)))
        };
      });
    }
    res.json(historique);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
