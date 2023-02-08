// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/

Search for specific products

This endpoint accepts the following optional query string parameters:

- `page` - page of products to return
- `size` - number of products to return

GET https://clear-fashion-api.vercel.app/brands

Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};
let brand = " ";
let reasonable = "No";
let recent = "No";
const current_date = Date.now();

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const selectReasonable = document.querySelector('#reasonable-select');
const selectRecent = document.querySelector('#recent-select');
const spanNbProducts = document.querySelector('#nbProducts');
const sectionProducts = document.querySelector('#products');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

const fetchBrands = async () => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app/brands`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

  if (brand != " ") {
    products.result = products.result.filter(product => product.brand == brand);
  }

  if (reasonable == "Yes") {
    products.result = products.result.filter(product => product.price <= 50);
  }

  if (recent == "Yes") {
    products.result = products.result.filter(product => (current_date - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 60);
  }

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectPage.addEventListener('change', async (event) => {
  const products = await fetchProducts(parseInt(event.target.value), currentPagination.pageSize);

  if (brand != " ") {
    products.result = products.result.filter(product => product.brand == brand);
  }

  if (reasonable == "Yes") {
    products.result = products.result.filter(product => product.price <= 50);
  }

  if (recent == "Yes") {
    products.result = products.result.filter(product => (current_date - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 60);
  }

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectBrand.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);

  if (event.target.value != " ") {
    products.result = products.result.filter(product => product.brand == event.target.value);
  }

  if (reasonable == "Yes") {
    products.result = products.result.filter(product => product.price <= 50);
  }

  if (recent == "Yes") {
    products.result = products.result.filter(product => (current_date - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 60);
  }

  brand = event.target.value;

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectReasonable.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
  
  if (event.target.value == "Yes") {
    products.result = products.result.filter(product => product.price <= 50);
  }

  if (recent == "Yes") {
    products.result = products.result.filter(product => (current_date - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 60);
  }

  if (brand != " ") {
    products.result = products.result.filter(product => product.brand == brand);
  }

  reasonable = event.target.value;

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectRecent.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize);
  
  if (event.target.value == "Yes") {
    products.result = products.result.filter(product => (current_date - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 60);
  }

  if (brand != " ") {
    products.result = products.result.filter(product => product.brand == brand);
  }

  if (reasonable == "Yes") {
    products.result = products.result.filter(product => product.price <= 50);
  }

  recent = event.target.value;

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const brand_names = await fetchBrands();
  brand_names.result.unshift(" ");
  const brands = Array.from(
    brand_names.result,
    value => `<option value="${value}">${value}</option>`
  ).join('');
  console.log(brands);
  selectBrand.innerHTML = brands;
  
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});
