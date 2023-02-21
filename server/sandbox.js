/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const circlesportswear = require('./eshops/circlesportswear');
const montlimart = require('./eshops/montlimart');
const fs = require('fs');

/*async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/all-men') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await dedicatedbrand.scrape(eshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function sandbox (eshop = 'https://shop.circlesportswear.com/collections/all') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await circlesportswear.scrape(eshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function sandbox (eshop = 'https://www.montlimart.com/99-vetements') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await montlimart.scrape(eshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}*/

//const [,, eshop] = process.argv;
//sandbox(eshop);

async function scrape (eshop) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
    let products;

    if (eshop.includes('dedicatedbrand')) {
      products = await dedicatedbrand.scrape(eshop);
    }
    else if (eshop.includes('circlesportswear')) {
      products = await circlesportswear.scrape(eshop);
    }
    else if (eshop.includes('montlimart')) {
      products = await montlimart.scrape(eshop);
    }

    console.log('done');
    return products;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function main() {
  const sitesToScrape = ['https://www.dedicatedbrand.com/en/men/all-men', 'https://www.dedicatedbrand.com/en/women/all-women', 'https://shop.circlesportswear.com/collections/all', 'https://www.montlimart.com/99-vetements'];
  let products = [];

  for (const site of sitesToScrape) {
    const scrapedProducts = await scrape(site);
    products = products.concat(scrapedProducts);
  }
  console.table(products);
  const jsonData = JSON.stringify(products, null, 2);

  fs.writeFile(`products.json`, jsonData, (err) => {
  if (err) throw err;
    console.log('Table saved to file!');
  });
}

main();
