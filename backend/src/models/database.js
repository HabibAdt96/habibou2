'use strict';
var Database = require('better-sqlite3');
var path = require('path');

// ─── La DB est dans backend/ (un seul emplacement) ────────────────────────────
var DB_PATH = path.join(__dirname, '..', '..', 'habibou.db');
var db = new Database(DB_PATH);

// Optimisations SQLite pour mobile (RAM limitée)
db.pragma('journal_mode = WAL');
db.pragma('cache_size = -2000'); // ~2MB cache
db.pragma('synchronous = NORMAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS produits (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    titre        TEXT    NOT NULL,
    description  TEXT    DEFAULT '',
    categorie    TEXT    NOT NULL DEFAULT 'Autres',
    etat         TEXT    DEFAULT 'neuf',
    prix         INTEGER NOT NULL DEFAULT 0,
    ancien_prix  INTEGER,
    wilaya       TEXT    DEFAULT 'Algérie',
    image_url    TEXT    DEFAULT '',
    vendeur_nom  TEXT    DEFAULT 'Inconnu',
    source_site  TEXT    DEFAULT '',
    source_url   TEXT    DEFAULT '' UNIQUE,
    nb_offres    INTEGER DEFAULT 1,
    est_meilleur_prix INTEGER DEFAULT 0,
    nb_vues      INTEGER DEFAULT 0,
    statut       TEXT    DEFAULT 'actif',
    cree_le      DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS prix_historique (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    produit_id  INTEGER REFERENCES produits(id) ON DELETE CASCADE,
    prix        REAL    NOT NULL,
    site_source TEXT,
    scrape_le   DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS alertes (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    utilisateur_id  INTEGER DEFAULT 1,
    produit_id      INTEGER REFERENCES produits(id) ON DELETE CASCADE,
    prix_cible      REAL    NOT NULL,
    active          INTEGER DEFAULT 1,
    cree_le         DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS utilisateurs (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    nom      TEXT    NOT NULL DEFAULT 'Habibou',
    email    TEXT    UNIQUE NOT NULL DEFAULT 'demo@habibou.dz',
    wilaya   TEXT    DEFAULT 'Sétif',
    cree_le  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    expediteur_id   INTEGER NOT NULL DEFAULT 1,
    destinataire_id INTEGER NOT NULL DEFAULT 2,
    contenu         TEXT    NOT NULL,
    lu              INTEGER DEFAULT 0,
    cree_le         DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_produits_titre    ON produits(titre);
  CREATE INDEX IF NOT EXISTS idx_produits_categorie ON produits(categorie);
  CREATE INDEX IF NOT EXISTS idx_produits_statut   ON produits(statut);
  CREATE INDEX IF NOT EXISTS idx_produits_source   ON produits(source_url);
`);

console.log('✅ Base de données initialisée → ' + DB_PATH);
module.exports = db;
