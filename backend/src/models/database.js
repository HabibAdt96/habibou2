const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../habibou.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS produits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titre TEXT NOT NULL,
    description TEXT DEFAULT '',
    categorie TEXT NOT NULL DEFAULT 'Autres',
    etat TEXT DEFAULT 'neuf',
    prix INTEGER NOT NULL,
    ancien_prix INTEGER,
    wilaya TEXT DEFAULT 'Algérie',
    image_url TEXT DEFAULT '',
    vendeur_nom TEXT DEFAULT 'Inconnu',
    source_site TEXT DEFAULT '',
    source_url TEXT DEFAULT '',
    nb_offres INTEGER DEFAULT 1,
    est_meilleur_prix INTEGER DEFAULT 0,
    statut TEXT DEFAULT 'actif',
    cree_le DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS prix_historique (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produit_id INTEGER REFERENCES produits(id) ON DELETE CASCADE,
    prix REAL NOT NULL,
    site_source TEXT,
    scrape_le DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS alertes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    utilisateur_id INTEGER DEFAULT 1,
    produit_id INTEGER REFERENCES produits(id) ON DELETE CASCADE,
    prix_cible REAL NOT NULL,
    active INTEGER DEFAULT 1,
    cree_le DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS utilisateurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL DEFAULT 'Habibou',
    email TEXT UNIQUE NOT NULL DEFAULT 'demo@habibou.dz',
    wilaya TEXT DEFAULT 'Sétif',
    cree_le DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    expediteur_id INTEGER NOT NULL DEFAULT 1,
    destinataire_id INTEGER NOT NULL DEFAULT 2,
    contenu TEXT NOT NULL,
    lu INTEGER DEFAULT 0,
    cree_le DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('✅ Base de données initialisée');
module.exports = db;
