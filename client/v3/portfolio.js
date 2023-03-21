// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let brand = "No";
let reasonable = "No";
let recent = "No";
let sort = "price-asc";
let favorite = "No";
let favorite_products = [];
const current_date = Date.now();

// instantiate the selectors
const selectBrand = document.querySelector('#brand-select');
const selectReasonable = document.querySelector('#reasonable-select');
const selectRecent = document.querySelector('#recent-select');
const selectSort = document.querySelector('#sort-select');
const selectFavorite = document.querySelector('#favorite-select');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbBrands = document.querySelector('#nbBrands');
const spanNbRecentProducts = document.querySelector('#nbRecentProducts');
const spanPercentile50 = document.querySelector('#percentile50');
const spanPercentile90 = document.querySelector('#percentile90');
const spanPercentile95 = document.querySelector('#percentile95');
const spanLastReleasedDate = document.querySelector('#lastReleasedDate');
const sectionProducts = document.querySelector('#products');

/**
 * Set global value
 * @param {Array} - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({products, meta}) => {
  currentProducts = products;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async () => {
  try {
    const response = await fetch(
      `https://clear-fashion-ashen-six.vercel.app/products`
    );
    const body = await response.json();
    return body;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

const fetchBrands = async () => {
  try {
    const response = await fetch(
      `https://clear-fashion-ashen-six.vercel.app/brands`
    );
    const body = await response.json();
    return body;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

function changeFavorite(uuid) {
  if (favorite_products.includes(uuid)) {
    favorite_products = favorite_products.filter(item => !(item == uuid));
  }
  else {
    favorite_products.push(uuid);
  }

  let products = [];
  products = currentProducts;
  products.meta = currentPagination;

  if (brand != "No") {
    products = products.filter(product => product.brand == brand);
  }

  if (reasonable == "Yes") {
    products = products.filter(product => product.price <= 50);
  }

  if (recent == "Yes") {
    products = products.filter(product => (current_date - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 60);
  }

  if (sort == "price-asc") {
    products = products.sort(PriceAsc);
  }
  else if (sort == "price-desc") {
    products = products.sort(PriceDesc);
  }
  else if (sort == "date-asc") {
    products = products.sort(DateAsc);
  }
  else if (sort == "date-desc") {
    products = products.sort(DateDesc);
  }

  if (favorite == "Yes") {
    products = products.filter(product => favorite_products.includes(product.uuid));
  }

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
}

function textFavorite(uuid) {
  let text = "";
  if (favorite_products.includes(uuid)) {
    text = "Remove favorite";
  }
  else {
    text = "Add favorite";
  }
  return text;
}

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
        <a href="${product.link}" target="_blank">${product.name}</a>
        <span>${product.price}€</span>
        <span>${new Date(product.released).toDateString()}</span>
        <button onclick="changeFavorite('${product.uuid}')">${textFavorite(product.uuid)}</button>
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

function PriceAsc(a, b) {
  return parseFloat(a.price) - parseFloat(b.price);
}

function PriceDesc(a, b) {
  return parseFloat(b.price) - parseFloat(a.price);
}

function DateAsc(a, b) {
  return new Date(b.released) - new Date(a.released);
}

function DateDesc(a, b) {
  return new Date(a.released) - new Date(b.released);
}

/**
 * Declaration of all Listeners
 */

selectBrand.addEventListener('change', async (event) => {
  let products = await fetchProducts();

  if (event.target.value != "No") {
    products = products.filter(product => product.brand == event.target.value);
  }

  if (reasonable == "Yes") {
    products = products.filter(product => product.price <= 50);
  }

  if (recent == "Yes") {
    products = products.filter(product => (current_date - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 60);
  }

  if (sort == "price-asc") {
    products = products.sort(PriceAsc);
  }
  else if (sort == "price-desc") {
    products = products.sort(PriceDesc);
  }
  else if (sort == "date-asc") {
    products = products.sort(DateAsc);
  }
  else if (sort == "date-desc") {
    products = products.sort(DateDesc);
  }

  if (favorite == "Yes") {
    products = products.filter(product => favorite_products.includes(product.uuid));
  }

  brand = event.target.value;

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectReasonable.addEventListener('change', async (event) => {
  let products = await fetchProducts();
  
  if (event.target.value == "Yes") {
    products = products.filter(product => product.price <= 50);
  }

  if (recent == "Yes") {
    products = products.filter(product => (current_date - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 60);
  }

  if (brand != "No") {
    products = products.filter(product => product.brand == brand);
  }

  if (sort == "price-asc") {
    products = products.sort(PriceAsc);
  }
  else if (sort == "price-desc") {
    products = products.sort(PriceDesc);
  }
  else if (sort == "date-asc") {
    products = products.sort(DateAsc);
  }
  else if (sort == "date-desc") {
    products = products.sort(DateDesc);
  }

  if (favorite == "Yes") {
    products = products.filter(product => favorite_products.includes(product.uuid));
  }

  reasonable = event.target.value;

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectRecent.addEventListener('change', async (event) => {
  let products = await fetchProducts();
  
  if (event.target.value == "Yes") {
    products = products.filter(product => (current_date - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 60);
  }

  if (brand != "No") {
    products = products.filter(product => product.brand == brand);
  }

  if (reasonable == "Yes") {
    products = products.filter(product => product.price <= 50);
  }

  if (sort == "price-asc") {
    products = products.sort(PriceAsc);
  }
  else if (sort == "price-desc") {
    products = products.sort(PriceDesc);
  }
  else if (sort == "date-asc") {
    products = products.sort(DateAsc);
  }
  else if (sort == "date-desc") {
    products = products.sort(DateDesc);
  }

  if (favorite == "Yes") {
    products = products.filter(product => favorite_products.includes(product.uuid));
  }

  recent = event.target.value;

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectSort.addEventListener('change', async (event) => {
  let products = await fetchProducts();
  
  if (event.target.value == "price-asc") {
    products = products.sort(PriceAsc);
  }
  else if (event.target.value == "price-desc") {
    products = products.sort(PriceDesc);
  }
  else if (event.target.value == "date-asc") {
    products = products.sort(DateAsc);
  }
  else if (event.target.value == "date-desc") {
    products = products.sort(DateDesc);
  }

  if (brand != "No") {
    products = products.filter(product => product.brand == brand);
  }

  if (reasonable == "Yes") {
    products = products.filter(product => product.price <= 50);
  }

  if (recent == "Yes") {
    products = products.filter(product => (current_date - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 60);
  }

  if (favorite == "Yes") {
    products = products.filter(product => favorite_products.includes(product.uuid));
  }

  sort = event.target.value;

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectFavorite.addEventListener('change', async (event) => {
  let products = await fetchProducts();

  if (event.target.value == "Yes") {
    products = products.filter(product => favorite_products.includes(product.uuid));
  }

  if (brand != "No") {
    products = products.filter(product => product.brand == brand);
  }

  if (reasonable == "Yes") {
    products = products.filter(product => product.price <= 50);
  }

  if (recent == "Yes") {
    products = products.filter(product => (current_date - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 60);
  }

  if (sort == "price-asc") {
    products = products.sort(PriceAsc);
  }
  else if (sort == "price-desc") {
    products = products.sort(PriceDesc);
  }
  else if (sort == "date-asc") {
    products = products.sort(DateAsc);
  }
  else if (sort == "date-desc") {
    products = products.sort(DateDesc);
  }

  favorite = event.target.value;

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

const quantile = (arr, q) => {
  const sorted = arr.sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
      return sorted[base];
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const brand_names = await fetchBrands();
  spanNbBrands.innerHTML = brand_names.length;
  
  brand_names.unshift("No");
  const brands = Array.from(
    brand_names,
    value => `<option value="${value}">${value}</option>`
  ).join('');
  
  selectBrand.innerHTML = brands;
  
  let products = await fetchProducts();
  console.log(products)
  products = products.sort(PriceAsc);

  setCurrentProducts(products);
  render(products, currentPagination);

  const all_products = await fetchProducts();
  spanNbRecentProducts.innerHTML = all_products.filter(product => (current_date - new Date(product.released)) / (1000 * 60 * 60 * 24) <= 60).length;
  
  let prices = [];
  let lastReleasedDate = new Date(all_products[0].released);
  for (let product_id in all_products) {
    prices.push(all_products[product_id].price);
    if (new Date(all_products[product_id].released) > new Date(lastReleasedDate)) {
      lastReleasedDate = new Date(all_products[product_id].released);
    }
  }
  spanPercentile50.innerHTML = Math.round(quantile(prices, 0.50));
  spanPercentile90.innerHTML = Math.round(quantile(prices, 0.90));
  spanPercentile95.innerHTML = Math.round(quantile(prices, 0.95));
  spanLastReleasedDate.innerHTML = lastReleasedDate.toDateString();
});
