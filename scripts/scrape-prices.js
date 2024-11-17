const { updateProductPrices } = require('../lib/scraper');

async function main() {
  console.log('Starting price update...');
  await updateProductPrices();
  console.log('Price update completed');
}

main().catch(console.error);