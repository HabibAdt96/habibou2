const db = require('../models/database');

function analyserPrix(produitId, prixActuel) {
  const produit = db.prepare('SELECT * FROM produits WHERE id = ?').get(produitId);
  if (!produit) return null;

  const similaires = db.prepare(`
    SELECT prix FROM produits 
    WHERE LOWER(categorie) = LOWER(?) AND statut = 'actif' AND id != ?
    LIMIT 50
  `).all(produit.categorie, produitId);

  if (similaires.length < 2) {
    return { badge: 'DONNEES_INSUFFISANTES', couleur: 'gray', message: 'Pas assez de données comparatives.', pourcentage_ecart: 0, prix_moyen: prixActuel };
  }

  const prix = similaires.map(p => p.prix);
  const moyenne = prix.reduce((a, b) => a + b, 0) / prix.length;
  const ecart = ((prixActuel - moyenne) / moyenne) * 100;

  if (ecart < -30) return { badge: 'SUSPECT', couleur: 'yellow', message: '⚠️ Prix anormalement bas. Vérifiez bien la qualité.', pourcentage_ecart: Math.round(ecart * 10) / 10, prix_moyen: Math.round(moyenne) };
  if (ecart < -8) return { badge: 'BON_PLAN', couleur: 'blue', message: `🎉 Bonne affaire ! ${Math.abs(Math.round(ecart))}% sous la moyenne du marché.`, pourcentage_ecart: Math.round(ecart * 10) / 10, prix_moyen: Math.round(moyenne) };
  if (ecart > 15) return { badge: 'ELEVE', couleur: 'red', message: `💸 Prix élevé, environ ${Math.round(ecart)}% au-dessus du marché.`, pourcentage_ecart: Math.round(ecart * 10) / 10, prix_moyen: Math.round(moyenne) };
  return { badge: 'CONSEILLE', couleur: 'green', message: '✅ Prix dans la fourchette normale du marché algérien.', pourcentage_ecart: Math.round(ecart * 10) / 10, prix_moyen: Math.round(moyenne) };
}

module.exports = { analyserPrix };
