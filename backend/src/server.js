'use strict';
require('dotenv').config();

var express = require('express');
var cors = require('cors');
var path = require('path');
var scrapingService = require('./services/scrapingService');
var alertesService = require('./services/alertesService');

var app = express();
var PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ─── Routes API ────────────────────────────────────────────────────────────────
app.use('/api/produits',  require('./routes/produits'));
app.use('/api/alertes',   require('./routes/alertes'));
app.use('/api/vendeurs',  require('./routes/vendeurs'));
app.use('/api/messages',  require('./routes/messages'));

// ─── Santé du serveur ─────────────────────────────────────────────────────────
app.get('/api/ping', function(req, res) {
  var db = require('./models/database');
  var nb = db.prepare('SELECT COUNT(*) as n FROM produits').get().n;
  res.json({
    status: 'ok',
    app: 'Habibou Backend v2.0',
    nb_produits: nb,
    timestamp: new Date().toISOString()
  });
});

// ─── Lancement des services ────────────────────────────────────────────────────
scrapingService.demarrer();
alertesService.demarrer();

// ─── Démarrage ────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', function() {
  console.log('');
  console.log('╔══════════════════════════════════╗');
  console.log('║   HABIBOU BACKEND v2.0  ✅        ║');
  console.log('║   Port : ' + PORT + '                     ║');
  console.log('║   DB   : habibou.db               ║');
  console.log('╚══════════════════════════════════╝');
  console.log('');
});
