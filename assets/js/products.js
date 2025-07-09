import {setAddToCardClickEvent} from './cart.js'

async function fetchProducts() {
  try {
    const res = await fetch('/assets/data/products.json');
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch products:', err);
    return []; // return an empty array on failure
  }
}


async function renderProducts() {
  const products = await fetchProducts();
  if (products.length > 0) {
    await loadProducts(products);
    setAddToCardClickEvent();
  } else {
    console.warn('No products to render.');
  }
}


async function loadProducts(products) {
  try {
    const res = await fetch('/templates/product.html');
    const template = await res.text();

    let productHTML = '';

    products.forEach(product => {
      let temp = template
        .replace('{{image}}', "assets/"+product.image)
        .replace('{{name}}', product.name)
        .replace('{{ratingStars}}', product.rating.stars * 10)
        .replace('{{ratingCount}}', product.rating.count)
        .replace('{{price}}', (product.priceCents / 100).toFixed(2))
        .replace('{{id}}', product.id)
        .replace('{{quantityOptions}}', generateQuantityOptions());

      productHTML += temp;
    });

    document.querySelector('#product-list').innerHTML = productHTML;

  } catch (err) {
    console.error('Error loading product template:', err);
  }
}

function generateQuantityOptions() {
  let options = '';
  for (let i = 1; i <= 10; i++) {
    options += `<option value="${i}" ${i === 1 ? 'selected' : ''}>${i}</option>`;
  }
  return options;
}

export async function getProductWithKeyword(keyword) {
  const products = await fetchProducts();

  if (products.length > 0) {
    return products.filter(product =>
      Array.isArray(product.keywords) &&
      product.keywords.includes(keyword)
    );
  } else {
    console.warn('No products to filter.');
    return [];
  }
}

export async function getProduct(productId) {
  const products = await fetchProducts();
  if (products.length > 0) {
     return products.find(product => product.id === productId);
  } else {
    console.warn('No products to filter.');
    return [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
    renderProducts();
  }
});
