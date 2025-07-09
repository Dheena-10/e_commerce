import { loadFromStorage, updateCartQuantity, setAddToCardClickEvent } from './cart.js';
import {getProductWithKeyword} from './products.js'

// loadNavbar
export function loadNavbar() {
  fetch('../templates/navbar.html')
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.text();
    })
    .then(data => {
      document.body.insertAdjacentHTML('afterbegin', data);
      loadFromStorage()
      updateCartQuantity()
      addSearchEvent()
      document.getElementById('search-keyword-input')
        .addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                document.getElementById('search-button').click(); // trigger search button click
            }
        });
    })
    .catch(error => {
      console.error("Unable to load Navbar:", error);
      // alert("Failed to load navbar!");
    });
}

function addSearchEvent() {
  const closeButton = document.getElementById('search-close');
  const searchButton = document.getElementById('search-button');
  const inputField = document.getElementById('search-keyword-input');
  const cardItemGroup = document.getElementById('card-item-groups');

  if (!closeButton || !searchButton || !inputField || !cardItemGroup) {
    console.warn('Search UI elements missing');
    return;
  }

  closeButton.addEventListener('click', () => {
    hideKeywordSearchResult();
  });

  searchButton.addEventListener('click', async () => {
    showKeywordSearchResult();
    const keyword = inputField.value.trim();
    cardItemGroup.innerHTML = '';

    if (!keyword) return;

    let products = await getProductWithKeyword(keyword); // assume async

    if (!products || products.length === 0) {
      cardItemGroup.innerHTML = `
        <div class="card-item-not-found">Not Found</div>
      `;
      return;
    }

    const cards = products.map(product => {
      return `
        <div class="card-section">
          <div class="product-container item-card">
            <div class="product-image-container">
              <img class="product-image" src="assets/${product.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
              ${product.name}
            </div>

            <div class="product-rating-container">
              <img class="product-rating-stars" src="assets/images/ratings/rating-${product.rating.stars * 10}.png">
              <div class="product-rating-count link-primary">
                ${product.rating.count}
              </div>
            </div>

            <div class="product-price">
              $${(product.priceCents / 100).toFixed(2)}
            </div>

            <div class="product-spacer"></div>

            <div class="added-to-cart">
              <img src="images/icons/checkmark.png">
              Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart"
              data-product-id="${product.id}">
              Add to Cart
            </button>
          </div>
        </div>
      `;
    }).join('');

    cardItemGroup.innerHTML = cards;

    if (typeof setAddToCardClickEvent === 'function') {
      setAddToCardClickEvent(); // restore cart functionality
    } else {
      console.warn('setAddToCardClickEvent() not available');
    }
  });
}


function showKeywordSearchResult() {
  let ele = document.getElementById('section-search-result')
  ele.style.display = 'flex';
}

function hideKeywordSearchResult() {
  let ele = document.getElementById('section-search-result')
  ele.style.display = 'none';
}
