const express = require('express');
const router = express.Router();
const db = require('../models/database');

router.get('/', (req, res) => {
  try { res.json(db.prepare('SELECT * FROM alertes WHERE active = 1 ORDER BY cree_le DESC').all()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', (req, res) => {
  try {
    const { produit_id, prix_cible, utilisateur_id } = req.body;
    const info = db.prepare('INSERT INTO alertes (produit_id, prix_cible, utilisateur_id) VALUES (?,?,?)').run(produit_id, prix_cible, utilisateur_id || 1);
    res.status(201).json({ id: info.lastInsertRowid, message: '✅ Alerte créée' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', (req, res) => {
  try {
    db.prepare('UPDATE alertes SET active = 0 WHERE id = ?').run(req.params.id);
    res.json({ message: 'Alerte supprimée' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
