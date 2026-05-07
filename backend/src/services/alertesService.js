var db = require('../models/database');
var cron = require('node-cron');

function verifierAlertes() {
  var alertes = db.prepare('SELECT * FROM alertes WHERE active = 1').all();
  alertes.forEach(function(alerte) {
    var produit = db.prepare('SELECT * FROM produits WHERE id = ?').get(alerte.produit_id);
    if (!produit) return;
    if (produit.prix <= alerte.prix_cible) {
      console.log('ALERTE: ' + produit.titre + ' est a ' + produit.prix + ' DA (cible: ' + alerte.prix_cible + ' DA)');
      db.prepare('UPDATE alertes SET active = 0 WHERE id = ?').run(alerte.id);
    }
  });
}

function demarrer() {
  cron.schedule('*/30 * * * *', function() {
    console.log('Verification alertes...');
    verifierAlertes();
  });
  console.log('Surveillance alertes activee');
}

module.exports = { demarrer, verifierAlertes };
