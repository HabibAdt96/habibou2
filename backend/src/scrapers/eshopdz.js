const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models/database');

async function scrapeEshopDZ(motCle, categorie = 'Informatique') {
  const url = `https://www.eshop.dz/recherche?q=${encodeURIComponent(motCle)}`;
  console.log(`🔍 EshopDZ → "${motCle}"`);

  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' },
      timeout: 20000
    });
    const $ = cheerio.load(data);
    let count = 0;

    $('.product-miniature, .js-product-miniature, [class*="product-item"]').each((i, el) => {
      if (i >= 15) return false;

      const titre = $(el).find('.product-title, h2, h3, .name').first().text().trim();
      const prixTexte = $(el).find('.price, .product-price, [class*="price"]').first().text().trim();
      const prixNum = parseInt(prixTexte.replace(/[^0-9]/g, ''));
      const image = $(el).find('img').attr('data-src') || $(el).find('img').attr('src') || '';
      const lienRel = $(el).find('a').first().attr('href') || '';
      const lien = lienRel.startsWith('http') ? lienRel : `https://www.eshop.dz${lienRel}`;

      if (titre.length > 3 && prixNum > 1000) {
        const existing = db.prepare('SELECT id FROM produits WHERE source_url = ?').get(lien);
        if (!existing) {
          db.prepare(`
            INSERT INTO produits (titre, prix, image_url, source_url, vendeur_nom, source_site, categorie, wilaya, etat)
            VALUES (?,?,?,?,?,?,?,?,?)
          `).run(titre, prixNum, image, lien, 'EshopDZ', 'eshop.dz', categorie, 'Alger', 'neuf');
          count++;
        }
      }
    });

    console.log(`✅ EshopDZ → ${count} nouveaux produits`);
    return count;
  } catch (err) {
    console.error(`❌ EshopDZ erreur: ${err.message}`);
    return 0;
  }
}

module.exports = { scrapeEshopDZ };
