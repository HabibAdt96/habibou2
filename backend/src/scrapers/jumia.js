const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models/database');

async function scrapeJumia(motCle, categorie) {
  console.log('Jumia -> ' + motCle);

  // Jumia expose ses résultats en JSON via ce endpoint
  const url = 'https://www.jumia.com.dz/catalog/?q=' + encodeURIComponent(motCle) + '&type=item_page.search';

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
      },
      timeout: 25000
    });

    const $ = cheerio.load(data);
    let count = 0;

    const stmt = db.prepare(
      'INSERT OR IGNORE INTO produits (titre, prix, ancien_prix, image_url, source_url, vendeur_nom, source_site, categorie, wilaya, etat) VALUES (?,?,?,?,?,?,?,?,?,?)'
    );

    $('article.prd').each(function(i, el) {
      if (i >= 20) return false;
      const titre = $(el).find('.name').text().trim();
      const prixTxt = $(el).find('.prc').text().trim();
      const oldTxt = $(el).find('.old').text().trim();
      const prix = parseInt(prixTxt.replace(/[^0-9]/g, ''));
      const ancienPrix = parseInt(oldTxt.replace(/[^0-9]/g, '')) || null;
      const image = $(el).find('img').attr('data-src') || $(el).find('img').attr('src') || '';
      const href = $(el).find('a.core').attr('href') || '';
      const lien = href.startsWith('http') ? href : 'https://www.jumia.com.dz' + href;

      if (titre.length > 2 && prix > 1000) {
        const existing = db.prepare('SELECT id FROM produits WHERE source_url = ?').get(lien);
        if (!existing) {
          stmt.run(titre, prix, ancienPrix, image, lien, 'Jumia', 'jumia.com.dz', categorie || 'Autres', 'Alger', 'neuf');
          count++;
        }
      }
    });

    console.log('Jumia -> ' + count + ' nouveaux produits');
    return count;
  } catch (err) {
    console.error('Jumia erreur: ' + err.message);
    return 0;
  }
}

module.exports = { scrapeJumia };
