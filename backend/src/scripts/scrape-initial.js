require('dotenv').config();
require('../models/database');
const { scrapeOuedkniss } = require('../scrapers/ouedkniss');
const { scrapeJumia } = require('../scrapers/jumia');
const { scrapeEshopDZ } = require('../scrapers/eshopdz');
const db = require('../models/database');

const donneesDemo = [
  { titre: 'Samsung Galaxy A55 5G 256Go', categorie: 'Smartphones', prix: 89000, ancien_prix: 95000, wilaya: 'Alger', vendeur_nom: 'TechZone', source_site: 'demo', etat: 'neuf', image_url: 'https://picsum.photos/seed/samsung-a55/400/400' },
  { titre: 'iPhone 15 Pro Max 256Go Noir', categorie: 'Smartphones', prix: 235000, ancien_prix: null, wilaya: 'Oran', vendeur_nom: 'iStore DZ', source_site: 'demo', etat: 'neuf', image_url: 'https://picsum.photos/seed/iphone15/400/400' },
  { titre: 'Xiaomi Redmi Note 13 Pro 8/256', categorie: 'Smartphones', prix: 55000, ancien_prix: 62000, wilaya: 'Setif', vendeur_nom: 'MegaTech', source_site: 'demo', etat: 'neuf', image_url: 'https://picsum.photos/seed/xiaomi-redmi/400/400' },
  { titre: 'MacBook Air M2 8Go/256Go Argent', categorie: 'PC Portables', prix: 185000, ancien_prix: null, wilaya: 'Alger', vendeur_nom: 'MacZone', source_site: 'demo', etat: 'neuf', image_url: 'https://picsum.photos/seed/macbook-air/400/400' },
  { titre: 'Dell Inspiron 15 Core i7 16Go 512SSD', categorie: 'PC Portables', prix: 115000, ancien_prix: 130000, wilaya: 'Constantine', vendeur_nom: 'PC World', source_site: 'demo', etat: 'neuf', image_url: 'https://picsum.photos/seed/dell-inspiron/400/400' },
  { titre: 'HP Pavilion 15 Ryzen 5 8Go', categorie: 'PC Portables', prix: 92000, ancien_prix: null, wilaya: 'Annaba', vendeur_nom: 'HP Center', source_site: 'demo', etat: 'neuf', image_url: 'https://picsum.photos/seed/hp-pavilion/400/400' },
  { titre: 'Samsung TV 55 QLED 4K Smart 2024', categorie: 'TV', prix: 145000, ancien_prix: null, wilaya: 'Alger', vendeur_nom: 'ElectroPro', source_site: 'demo', etat: 'neuf', image_url: 'https://picsum.photos/seed/samsung-tv/400/400' },
  { titre: 'Sony Bravia 65 OLED Android TV', categorie: 'TV', prix: 198000, ancien_prix: 220000, wilaya: 'Oran', vendeur_nom: 'Sony Store', source_site: 'demo', etat: 'neuf', image_url: 'https://picsum.photos/seed/sony-bravia/400/400' },
  { titre: 'PS5 Slim Disc Edition + 2 Manettes', categorie: 'Jeux Video', prix: 118000, ancien_prix: null, wilaya: 'Blida', vendeur_nom: 'GameZone', source_site: 'demo', etat: 'neuf', image_url: 'https://picsum.photos/seed/ps5-slim/400/400' },
  { titre: 'Xbox Series X 1To Digital', categorie: 'Jeux Video', prix: 98000, ancien_prix: 110000, wilaya: 'Setif', vendeur_nom: 'XboxDZ', source_site: 'demo', etat: 'neuf', image_url: 'https://picsum.photos/seed/xbox-series/400/400' },
  { titre: 'Refrigerateur Samsung No Frost 400L', categorie: 'Electromenager', prix: 78000, ancien_prix: null, wilaya: 'Tizi Ouzou', vendeur_nom: 'Electromenager Plus', source_site: 'demo', etat: 'neuf', image_url: 'https://picsum.photos/seed/frigo-samsung/400/400' },
  { titre: 'Machine a laver Beko 8Kg A+++', categorie: 'Electromenager', prix: 52000, ancien_prix: 58000, wilaya: 'Alger', vendeur_nom: 'Beko Center', source_site: 'demo', etat: 'neuf', image_url: 'https://picsum.photos/seed/beko-laundry/400/400' },
  { titre: 'Climatiseur 12000BTU Inverter', categorie: 'Electromenager', prix: 68000, ancien_prix: null, wilaya: 'Oran', vendeur_nom: 'ClimDZ', source_site: 'demo', etat: 'neuf', image_url: 'https://picsum.photos/seed/clim-inverter/400/400' },
  { titre: 'Samsung Galaxy A55 5G Occasion', categorie: 'Smartphones', prix: 72000, ancien_prix: null, wilaya: 'Setif', vendeur_nom: 'Vendeur Habibou', source_site: 'ouedkniss.com', etat: 'occasion', image_url: 'https://picsum.photos/seed/samsung-a55-occ/400/400' },
  { titre: 'AirPods Pro 2eme generation', categorie: 'Audio', prix: 45000, ancien_prix: 52000, wilaya: 'Alger', vendeur_nom: 'AudioTech', source_site: 'demo', etat: 'neuf', image_url: 'https://picsum.photos/seed/airpods-pro/400/400' },
  { titre: 'Casque Sony WH-1000XM5 Bluetooth', categorie: 'Audio', prix: 38000, ancien_prix: null, wilaya: 'Constantine', vendeur_nom: 'SoundStore', source_site: 'demo', etat: 'neuf', image_url: 'https://picsum.photos/seed/sony-headphone/400/400' },
  { titre: 'iPhone 14 128Go Minuit Occasion', categorie: 'Smartphones', prix: 155000, ancien_prix: null, wilaya: 'Alger', vendeur_nom: 'PhoneShop', source_site: 'ouedkniss.com', etat: 'occasion', image_url: 'https://picsum.photos/seed/iphone14-occ/400/400' },
  { titre: 'Tablette Samsung Galaxy Tab S9 256Go', categorie: 'Smartphones', prix: 88000, ancien_prix: 98000, wilaya: 'Bejaia', vendeur_nom: 'TabletStore', source_site: 'demo', etat: 'neuf', image_url: 'https://picsum.photos/seed/galaxy-tab/400/400' },
];

async function lancerScrapingInitial() {
  console.log('Demarrage du scraping initial...');

  const taches = [
    scrapeOuedkniss('iphone', 'Smartphones'),
    scrapeOuedkniss('samsung', 'Smartphones'),
    scrapeJumia('laptop', 'PC Portables'),
    scrapeJumia('television', 'TV'),
    scrapeEshopDZ('pc portable', 'PC Portables'),
  ];

  let totalScrape = 0;
  for (const tache of taches) {
    const n = await tache.catch(function() { return 0; });
    totalScrape += n;
    await new Promise(function(r) { setTimeout(r, 3000); });
  }

  const count = db.prepare('SELECT COUNT(*) as n FROM produits').get().n;
  console.log('Produits scrapes: ' + count);

  if (count < 5) {
    console.log('Insertion des donnees de demo...');
    const stmt = db.prepare(
      'INSERT INTO produits (titre, categorie, prix, ancien_prix, wilaya, vendeur_nom, source_site, etat, image_url) VALUES (?,?,?,?,?,?,?,?,?)'
    );
    donneesDemo.forEach(function(p) {
      stmt.run(p.titre, p.categorie, p.prix, p.ancien_prix || null, p.wilaya, p.vendeur_nom, p.source_site, p.etat, p.image_url);
    });
    console.log(donneesDemo.length + ' produits de demo inseres');
  }

  const total = db.prepare('SELECT COUNT(*) as n FROM produits').get().n;
  console.log('Total en base: ' + total + ' produits');
  console.log('Termine ! Lance maintenant: node src/server.js');
}

lancerScrapingInitial();
