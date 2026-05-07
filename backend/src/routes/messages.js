const express = require('express');
const router = express.Router();
const db = require('../models/database');

router.get('/conversations', (req, res) => {
  try {
    // Simule des conversations (demo)
    res.json([
      { user_id: 2, nom: 'Ahmed - Vendeur iPhone', dernier_msg: 'Oui, disponible à Alger', heure: new Date().toISOString(), non_lu: true },
      { user_id: 3, nom: 'Fatima - PC Portable', dernier_msg: 'Livraison possible ?', heure: new Date(Date.now()-3600000).toISOString(), non_lu: false }
    ]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/conversation/:userId', (req, res) => {
  try {
    const msgs = db.prepare(`
      SELECT * FROM messages 
      WHERE (expediteur_id = 1 AND destinataire_id = ?) OR (expediteur_id = ? AND destinataire_id = 1)
      ORDER BY cree_le ASC
    `).all(req.params.userId, req.params.userId);
    res.json(msgs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', (req, res) => {
  try {
    const { destinataire_id, contenu } = req.body;
    const info = db.prepare('INSERT INTO messages (expediteur_id, destinataire_id, contenu) VALUES (1,?,?)').run(destinataire_id, contenu);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
