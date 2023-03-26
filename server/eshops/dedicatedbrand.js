const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);
  
  const start = new Date('2023-01-01').getTime();
  const end = new Date('2023-03-24').getTime();
  const randomTimestamp = start + Math.random() * (end - start);
  const date = new Date(randomTimestamp).toISOString().split('T')[0];

  return $('.productList-container .productList')
    .map((i, element) => {
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      );
      if (isNaN(price)) {
        return null; // skip this element if price is NaN
      }
      const brand = 'Dedicated';
      let url = $(element)
        .find('.productList-link')
        .attr('href');
        url = 'https://www.dedicatedbrand.com'.concat(url);
      const photo = $(element)
        .find('img')
        .attr('data-src');

      return {name, price, brand, url, photo, date};
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
