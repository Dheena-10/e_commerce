import { cart, addToCart, loadFromStorage } from '../data/cart.js';
import { products, getProductWithKeyword } from '../data/products.js';

let productHTML = '';

products.forEach((product) => {
  productHTML += `
       <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            $${(product.priceCents / 100).toFixed(2)}
          </div>

          <div class="product-quantity-container">
            <select>
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
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
  `;
});
// console.log(productHTML);

document.querySelector('.js-product-grid').innerHTML = productHTML;



function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  //console.log(cartQuantity);
  //console.log(cart);
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}


function setAddToCardClickEvent(){
document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    addToCart(productId);
    updateCartQuantity();

  });
});
}
setAddToCardClickEvent()

document.getElementById('search-close').addEventListener('click', () => {
  hideKeywordSearchResult()
})

document.getElementById('search-button').addEventListener('click', () => {
  showKeywordSearchResult()
  let keyword = document.getElementById('search-keyword-input').value
  let card_item_group = document.getElementById('card-item-groups')
  card_item_group.innerHTML = ''
  if (keyword) {
    let products = getProductWithKeyword(keyword)
    console.log(products)
    if(products.length === 0){
      card_item_group.innerHTML += `
    <div class="card-item-not-found">Not Found</div>
    `
    }
    products.forEach((product) => {
      console.log(product)
      let card = `<div class="card-section">
        <div class="product-container item-card">
          <div class="product-image-container">
            <img class="product-image" src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
           ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars" src="images/ratings/rating-45.png">
            <div class="product-rating-count link-primary">
              87
            </div>
          </div>

          <div class="product-price">
            ${(product.priceCents / 100).toFixed(2)}
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
      </div>`

      card_item_group.innerHTML += card
    })
    setAddToCardClickEvent()
  }
})

function showKeywordSearchResult() {
  let ele = document.getElementById('section-search-result')
  ele.style.display = 'flex';
}

function hideKeywordSearchResult() {
  let ele = document.getElementById('section-search-result')
  ele.style.display = 'none';
}
