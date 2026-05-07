'use strict';
var axios = require('axios');
var db = require('../models/database');

var API = 'https://api.ouedkniss.com/graphql';

var HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Origin': 'https://www.ouedkniss.com',
  'Referer': 'https://www.ouedkniss.com/',
  'x-app-version': '4.0',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
};

// ─── Query GraphQL correcte avec medias pour les images ───────────────────────
var QUERY = `
query SearchAnnouncements($q: String!, $mediaCount: Int, $page: Int, $count: Int) {
  search(q: $q, mediaCount: $mediaCount, page: $page, count: $count) {
    announcements {
      data {
        id
        title
        price
        priceType
        slug
        status
        description
        store { name }
        category { name }
        cities { name }
        medias { mediaType thumb }
      }
    }
  }
}`;

/**
 * Scrape Ouedkniss via GraphQL
 * @param {string} motCle  — mot-clé de recherche
 * @param {string} categorie — catégorie pour la DB
 * @param {number} page — page (défaut 1)
 * @returns {Promise<number>} nombre de produits insérés
 */
async function scrapeOuedkniss(motCle, categorie, page) {
  page = page || 1;
  console.log('[Ouedkniss] Recherche: "' + motCle + '" page ' + page);
  var total = 0;

  try {
    var resp = await axios.post(
      API,
      {
        query: QUERY,
        variables: { q: motCle, mediaCount: 3, page: page, count: 30 }
      },
      { headers: HEADERS, timeout: 30000 }
    );

    // ─── Vérifie les erreurs GraphQL ────────────────────────────────────────
    if (resp.data && resp.data.errors) {
      console.error('[Ouedkniss] Erreur GraphQL:', JSON.stringify(resp.data.errors).slice(0, 300));
      return 0;
    }

    var items = [];
    try {
      items = resp.data.data.search.announcements.data;
    } catch (e) {
      console.error('[Ouedkniss] Structure inattendue:', JSON.stringify(resp.data).slice(0, 300));
      return 0;
    }

    console.log('[Ouedkniss] ' + items.length + ' annonces reçues pour "' + motCle + '"');

    var stmt = db.prepare(
      'INSERT OR IGNORE INTO produits (titre, prix, image_url, source_url, vendeur_nom, source_site, categorie, wilaya, etat, description) VALUES (?,?,?,?,?,?,?,?,?,?)'
    );

    items.forEach(function(item) {
      var titre = (item.title || '').trim();
      if (titre.length < 3) return; // ignorer les titres vides

      // ─── Prix ─────────────────────────────────────────────────────────────
      // Ouedkniss: priceType peut être "FIXED", "NEGOTIABLE", "EXCHANGE" ou null
      var prix = null;
      if (item.price !== null && item.price !== undefined && item.price > 0) {
        prix = Math.round(item.price);
      }
      // Si prix null/0, on insère quand même avec prix = 0 pour ne pas perdre le produit
      // mais on filtre les cas aberrants (prix négatifs)
      if (prix !== null && prix < 0) return;
      var prixFinal = prix || 0;

      // ─── Image ────────────────────────────────────────────────────────────
      var imageUrl = '';
      if (item.medias && item.medias.length > 0) {
        // Cherche d'abord une image (pas une vidéo)
        var media = item.medias.find(function(m) {
          return m.mediaType === 'IMAGE' || m.mediaType === 'image';
        }) || item.medias[0];
        imageUrl = media.thumb || '';
      }

      // ─── Autres champs ────────────────────────────────────────────────────
      var slug = item.slug || String(item.id);
      var lien = 'https://www.ouedkniss.com/' + slug;
      var vendeur = (item.store && item.store.name) ? item.store.name : 'Ouedkniss';
      var wilaya = (item.cities && item.cities.length > 0) ? item.cities[0].name : 'Algérie';
      var cat = (item.category && item.category.name) ? item.category.name : (categorie || 'Autres');
      var etat = (item.status === 'NEW' || item.status === 'new') ? 'neuf' : 'occasion';
      var desc = (item.description || '').slice(0, 500); // limiter la taille

      // ─── Insère seulement si source_url n'existe pas déjà ─────────────────
      var existing = db.prepare('SELECT id FROM produits WHERE source_url = ?').get(lien);
      if (!existing) {
        stmt.run(titre, prixFinal, imageUrl, lien, vendeur, 'ouedkniss.com', cat, wilaya, etat, desc);
        total++;
      }
    });

    console.log('[Ouedkniss] ' + total + ' nouveaux produits insérés pour "' + motCle + '"');
  } catch (err) {
    console.error('[Ouedkniss] Erreur réseau:', err.message);
    if (err.response) {
      console.error('[Ouedkniss] Status HTTP:', err.response.status);
      console.error('[Ouedkniss] Réponse:', JSON.stringify(err.response.data).slice(0, 300));
    }
  }

  return total;
}

module.exports = { scrapeOuedkniss };
