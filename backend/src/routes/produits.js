'use strict';
var express = require('express');
var router = express.Router();
var db = require('../models/database');
var { analyserPrix } = require('../services/analyseService');
var { scrapeOuedkniss } = require('../scrapers/ouedkniss');
var { scrapeJumia } = require('../scrapers/jumia');

// ─── Constantes pagination ─────────────────────────────────────────────────────
var PAGE_SIZE = 20; // produits par page (mobile-friendly)

/**
 * GET /api/produits
 * Paramètres : search, categorie, wilaya, etat, prix_min, prix_max, page
 * Réponse    : { produits, total, page, pages, page_size }
 */
router.get('/', async function(req, res) {
  try {
    var search = req.query.search || '';
    var categorie = req.query.categorie || '';
    var wilaya = req.query.wilaya || '';
    var etat = req.query.etat || '';
    var prixMin = req.query.prix_min ? Number(req.query.prix_min) : null;
    var prixMax = req.query.prix_max ? Number(req.query.prix_max) : null;
    var page = Math.max(1, parseInt(req.query.page) || 1);

    var where = "statut = 'actif'";
    var params = [];

    if (search)    { where += ' AND titre LIKE ?';              params.push('%' + search + '%'); }
    if (categorie) { where += ' AND LOWER(categorie) LIKE ?';   params.push('%' + categorie.toLowerCase() + '%'); }
    if (wilaya)    { where += ' AND wilaya LIKE ?';             params.push('%' + wilaya + '%'); }
    if (etat && etat !== 'Tous') { where += ' AND LOWER(etat) = ?'; params.push(etat.toLowerCase()); }
    if (prixMin !== null) { where += ' AND prix >= ?'; params.push(prixMin); }
    if (prixMax !== null) { where += ' AND prix <= ?'; params.push(prixMax); }

    // ─── Si aucun résultat local pour la recherche → scraping live ──────────
    if (search) {
      var countLocal = db.prepare('SELECT COUNT(*) as n FROM produits WHERE ' + where).get(...params).n;

      if (countLocal === 0) {
        console.log('[Live] Aucun résultat local pour "' + search + '" → scraping live...');
        // Lance Ouedkniss ET Jumia en parallèle
        await Promise.allSettled([
          scrapeOuedkniss(search, categorie || 'Autres', 1),
          scrapeJumia(search, categorie || 'Autres')
        ]);
        console.log('[Live] Scraping terminé pour "' + search + '"');
      }
    }

    // ─── Total pour la pagination ──────────────────────────────────────────
    var total = db.prepare('SELECT COUNT(*) as n FROM produits WHERE ' + where).get(...params).n;
    var pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    page = Math.min(page, pages); // sécurité

    var offset = (page - 1) * PAGE_SIZE;

    var query = 'SELECT * FROM produits WHERE ' + where +
                ' ORDER BY id DESC LIMIT ? OFFSET ?';

    var produits = db.prepare(query).all(...params, PAGE_SIZE, offset);

    res.json({
      produits: produits,
      total: total,
      page: page,
      pages: pages,
      page_size: PAGE_SIZE
    });

  } catch (err) {
    console.error('[/api/produits]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/produits/:id ────────────────────────────────────────────────────
router.get('/:id', function(req, res) {
  try {
    var p = db.prepare('SELECT * FROM produits WHERE id = ?').get(req.params.id);
    if (!p) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/produits ───────────────────────────────────────────────────────
router.post('/', function(req, res) {
  try {
    var b = req.body;
    var info = db.prepare(
      'INSERT INTO produits (titre, description, categorie, etat, prix, wilaya, image_url, vendeur_nom, source_site) VALUES (?,?,?,?,?,?,?,?,?)'
    ).run(
      b.titre,
      b.description || '',
      b.categorie || 'Autres',
      b.etat || 'neuf',
      b.prix,
      b.wilaya || 'Algérie',
      b.image_url || '',
      b.vendeur_nom || 'Moi',
      'utilisateur'
    );
    res.status(201).json({ id: info.lastInsertRowid, message: 'Produit créé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/produits/:id/badge-prix ────────────────────────────────────────
router.get('/:id/badge-prix', function(req, res) {
  try {
    var prix = parseFloat(req.query.current_price || req.query.currentprice || 0);
    if (!prix) return res.status(400).json({ error: 'current_price requis' });
    var analyse = analyserPrix(req.params.id, prix);
    if (!analyse) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json(analyse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/produits/:id/historique-prix ────────────────────────────────────
router.get('/:id/historique-prix', function(req, res) {
  try {
    var produit = db.prepare('SELECT * FROM produits WHERE id = ?').get(req.params.id);
    if (!produit) return res.status(404).json({ error: 'Produit non trouvé' });

    var historique = db.prepare(
      'SELECT scrape_le as date, prix FROM prix_historique WHERE produit_id = ? ORDER BY scrape_le ASC'
    ).all(req.params.id);

    // Si pas d'historique → génère des données simulées
    if (historique.length === 0) {
      var base = produit.prix;
      historique = Array.from({ length: 30 }, function(_, i) {
        var date = new Date();
        date.setDate(date.getDate() - (29 - i));
        var variation = (Math.random() * 0.12 - 0.04);
        var tendance = i > 20 ? -0.005 * (i - 20) : 0;
        return {
          date: date.toISOString().split('T')[0],
          prix: Math.max(100, Math.round(base * (1 + variation + tendance)))
        };
      });
    }

    res.json(historique);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
