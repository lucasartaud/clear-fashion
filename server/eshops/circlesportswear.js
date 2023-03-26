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
      if (isNaN(price)) {
        return null; // skip this element if price is NaN
      }
      const brand = 'Circle Sportswear';
      let url = $(element)
        .find('.full-unstyled-link')
        .attr('href');
        url = 'https://shop.circlesportswear.com'.concat(url);
      let photo = $(element)
        .find('img')
        .attr('src');
      photo = 'https:'.concat(photo);

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
