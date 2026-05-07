'use strict';
var cron = require('node-cron');
var ouedkniss = require('../scrapers/ouedkniss');
var jumia = require('../scrapers/jumia');

// ─── Sujets à scraper automatiquement toutes les 2h ───────────────────────────
var SUJETS = [
  { mot: 'iphone',          cat: 'Smartphones'    },
  { mot: 'samsung galaxy',  cat: 'Smartphones'    },
  { mot: 'laptop',          cat: 'PC Portables'   },
  { mot: 'pc portable',     cat: 'PC Portables'   },
  { mot: 'television',      cat: 'TV'             },
  { mot: 'ps5',             cat: 'Jeux Video'     },
  { mot: 'refrigerateur',   cat: 'Electroménager' },
  { mot: 'climatiseur',     cat: 'Electroménager' },
  { mot: 'tablette',        cat: 'Tablettes'      },
  { mot: 'imprimante',      cat: 'Informatique'   },
];

async function lancerScraping() {
  console.log('[Cron] ═══ Scraping automatique démarré ═══');
  var debut = Date.now();

  for (var i = 0; i < SUJETS.length; i++) {
    var sujet = SUJETS[i];
    try {
      // Ouedkniss + Jumia en parallèle pour chaque mot-clé
      await Promise.allSettled([
        ouedkniss.scrapeOuedkniss(sujet.mot, sujet.cat, 1),
        jumia.scrapeJumia(sujet.mot, sujet.cat)
      ]);
    } catch (e) {
      console.error('[Cron] Erreur pour "' + sujet.mot + '":', e.message);
    }
    // Pause 4s entre chaque mot-clé (respecte le rate limit)
    await new Promise(function(r) { setTimeout(r, 4000); });
  }

  var duree = Math.round((Date.now() - debut) / 1000);
  console.log('[Cron] ═══ Scraping terminé en ' + duree + 's ═══');
}

function demarrer() {
  // Toutes les 2 heures
  cron.schedule('0 */2 * * *', lancerScraping);
  console.log('[Cron] Scraping automatique actif — toutes les 2h');
  // Premier scraping 30 secondes après le démarrage du serveur
  setTimeout(function() {
    console.log('[Cron] Premier scraping initial...');
    lancerScraping().catch(function(e) { console.error('[Cron] Erreur init:', e.message); });
  }, 30000);
}

module.exports = { demarrer, lancerScraping };
