var cron = require('node-cron');
var ouedkniss = require('../scrapers/ouedkniss');

var SUJETS = [
  { mot: 'iphone', cat: 'Smartphones' },
  { mot: 'samsung galaxy', cat: 'Smartphones' },
  { mot: 'laptop', cat: 'PC Portables' },
  { mot: 'television', cat: 'TV' },
  { mot: 'ps5', cat: 'Jeux Video' },
  { mot: 'refrigerateur', cat: 'Electromenager' },
  { mot: 'climatiseur', cat: 'Electromenager' },
];

async function lancerScraping() {
  console.log('Scraping automatique en cours...');
  for (var i = 0; i < SUJETS.length; i++) {
    await ouedkniss.scrapeOuedkniss(SUJETS[i].mot, SUJETS[i].cat).catch(function(){});
    await new Promise(function(r){ setTimeout(r, 3000); });
  }
  console.log('Scraping automatique termine');
}

function demarrer() {
  cron.schedule('0 */2 * * *', lancerScraping);
  console.log('Scraping auto toutes les 2h active');
}

module.exports = { demarrer, lancerScraping };
