const express = require('express');
const router = express.Router();
const db = require('../models/database');

router.get('/:id/score', (req, res) => {
  try {
    const produits = db.prepare('SELECT COUNT(*) as n FROM produits WHERE vendeur_nom != ""').get();
    res.json({
      id: req.params.id,
      nom: 'Vendeur Habibou',
      is_certified: true,
      score_confiance: 87,
      etoiles: 5,
      cree_le: '2024-01-15',
      wilaya: 'Alger - 16',
      logo_url: 'https://picsum.photos/seed/vendor/200/200',
      cover_url: 'https://picsum.photos/seed/vendor-cover/1200/300',
      stats: { nb_produits: produits.n, rating: 4.8, positif_percent: 96 }
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
