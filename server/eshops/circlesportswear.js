const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product-grid-container .grid__item')
    .map((i, element) => {
      let name = $(element)
        .find('.full-unstyled-link')
        .text()
        .trim()
        .replace(/\s/g, ' ');
        name = name.substr(0, name.length/2).trim();
      const price = parseInt(
        $(element)
          .find('.price__regular .money')
          .text()
          .slice(1)
      );
      const brand = 'Circle Sportswear';

      return {name, price, brand};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
