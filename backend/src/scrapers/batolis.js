var axios = require('axios');
var cheerio = require('cheerio');
var db = require('../models/database');

var HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124',
  'Accept-Language': 'fr-FR,fr;q=0.9'
};

async function scrapeBatolis(motCle, categorie) {
  console.log('Batolis -> ' + motCle);
  var total = 0;

  try {
    var url = 'https://batolis.com/search?q=' + encodeURIComponent(motCle);
    var resp = await axios.get(url, { headers: HEADERS, timeout: 20000 });
    var $ = cheerio.load(resp.data);

    var stmt = db.prepare(
      'INSERT OR IGNORE INTO produits (titre, prix, image_url, source_url, vendeur_nom, source_site, categorie, wilaya, etat) VALUES (?,?,?,?,?,?,?,?,?)'
    );

    $('.product-item, .item, [class*="product"], [class*="card"]').each(function(i, el) {
      if (i >= 20) return false;
      var titre = $(el).find('h2,h3,.title,.name,[class*="title"]').first().text().trim();
      var prixTxt = $(el).find('[class*="price"],[class*="prix"],.price').first().text().trim();
      var prix = parseInt(prixTxt.replace(/[^0-9]/g, '')) || 0;
      var image = $(el).find('img').first().attr('src') || '';
      var href = $(el).find('a').first().attr('href') || '';
      var lien = href.startsWith('http') ? href : 'https://batolis.com' + href;

      if (titre.length > 3 && lien.length > 15) {
        var existing = db.prepare('SELECT id FROM produits WHERE source_url = ?').get(lien);
        if (!existing) {
          stmt.run(titre, prix, image, lien, 'Batolis', 'batolis.com', categorie || 'Autres', 'Algerie', 'neuf');
          total++;
        }
      }
    });

    console.log('Batolis -> ' + total + ' inseres pour "' + motCle + '"');
  } catch (err) {
    console.log('Batolis erreur: ' + err.message);
  }

  return total;
}

module.exports = { scrapeBatolis };
