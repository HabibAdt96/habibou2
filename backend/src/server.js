require('dotenv').config();
var express = require('express');
var cors = require('cors');
var scrapingService = require('./services/scrapingService');
var alertesService = require('./services/alertesService');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/produits', require('./routes/produits'));
app.use('/api/alertes', require('./routes/alertes'));

app.get('/api/ping', function(req, res) {
  var db = require('./models/database');
  var nb = db.prepare('SELECT COUNT(*) as n FROM produits').get().n;
  res.json({ status: 'ok', app: 'Habibou Backend', nb_produits: nb, timestamp: new Date().toISOString() });
});

scrapingService.demarrer();
alertesService.demarrer();

app.listen(PORT, '0.0.0.0', function() {
  console.log('============================');
  console.log('  HABIBOU BACKEND v1.0');
  console.log('  http://localhost:' + PORT);
  console.log('============================');
});
