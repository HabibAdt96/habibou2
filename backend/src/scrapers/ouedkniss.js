var axios = require('axios');
var db = require('../models/database');

var API = 'https://api.ouedkniss.com/graphql';
var HEADERS = {
  'Content-Type': 'application/json',
  'Origin': 'https://www.ouedkniss.com',
  'Referer': 'https://www.ouedkniss.com/',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124'
};

var QUERY = '{ search(q: "%MOT%") { announcements { data { id title price slug description status store { name } category { name } cities { name } } } } }';

async function scrapeOuedkniss(motCle, categorie) {
  console.log('Ouedkniss API -> ' + motCle);
  var total = 0;
  try {
    var query = QUERY.replace('%MOT%', motCle.replace(/"/g, ''));
    var resp = await axios.post(API, { query: query }, { headers: HEADERS, timeout: 25000 });
    var items = resp.data && resp.data.data && resp.data.data.search && resp.data.data.search.announcements && resp.data.data.search.announcements.data ? resp.data.data.search.announcements.data : [];

    console.log('Ouedkniss -> ' + items.length + ' annonces recues');

    var stmt = db.prepare(
      'INSERT OR IGNORE INTO produits (titre, prix, image_url, source_url, vendeur_nom, source_site, categorie, wilaya, etat, description) VALUES (?,?,?,?,?,?,?,?,?,?)'
    );

    items.forEach(function(item) {
      var titre = item.title || '';
      var prix = (item.price && item.price > 10) ? Math.round(item.price) : 0;
      var lien = 'https://www.ouedkniss.com/' + (item.slug || item.id);
      var vendeur = item.store ? item.store.name : 'Ouedkniss';
      var wilaya = (item.cities && item.cities.length > 0) ? item.cities[0].name : 'Algerie';
      var cat = item.category ? item.category.name : (categorie || 'Autres');
      var etat = (item.status === 'NEW' || item.status === 'new') ? 'neuf' : 'occasion';
      var desc = item.description || '';

      if (titre.length > 2) {
        var existing = db.prepare('SELECT id FROM produits WHERE source_url = ?').get(lien);
        if (!existing) {
          stmt.run(titre, prix, '', lien, vendeur, 'ouedkniss.com', cat, wilaya, etat, desc);
          total++;
        }
      }
    });

    console.log('Ouedkniss -> ' + total + ' nouveaux inseres pour "' + motCle + '"');
  } catch (err) {
    console.log('Ouedkniss erreur: ' + err.message);
    if (err.response) console.log('Status: ' + err.response.status + ' - ' + JSON.stringify(err.response.data).slice(0, 200));
  }
  return total;
}

module.exports = { scrapeOuedkniss };
