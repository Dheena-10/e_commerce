import { getProduct } from "./products.js";

let cart = [];

function loadFromStorage() {
  const storedCart = localStorage.getItem('cart');
  cart = storedCart ? JSON.parse(storedCart) : [];
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
  const existingItem = cart.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      productId,
      quantity: 1,
      deliveryOptionId: '1'
    });
  }
  saveToStorage();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  saveToStorage();
}

function updateDeliveryOption(productId, deliveryOptionId) {
  const matchingItem = cart.find(item => item.productId === productId);

  if (matchingItem) {
    matchingItem.deliveryOptionId = deliveryOptionId;
    saveToStorage();
  } else {
    console.warn(`No matching cart item found for productId: ${productId}`);
  }
}

function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

function setAddToCardClickEvent() {
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      addToCart(productId);
      updateCartQuantity();

    });
  });
}

function getRadioButtonOptions(prefix) {
  let radioButtonsOptions = '';
  
  const options = [
    { id: 'option1', label: '1 day delivery' },
    { id: 'option2', label: '2 day delivery' },
    { id: 'option3', label: '3 day delivery' }
  ];

  options.forEach(option => {
    radioButtonsOptions += `
      <div>
      <input id="${prefix}${option.id}" type="radio" name="${prefix}delivery-option" value="${option.id}">
      <label for="${prefix}${option.id}">${option.label}</label>
      </div>
    `;
  });

  return radioButtonsOptions;
}

function setCartRemoveButtonEvents() {
  document.querySelectorAll('.js-remove-from-cart').forEach(button => {
    button.addEventListener('click', event => {
      const productId = event.target.dataset.productId;

      // Remove item from cart array
      removeFromCart(productId);
      // remove the card from the DOM
      const card = event.target.closest('.cart-item-card');
      if (card) card.remove();

      updateCartQuantity();
      updateCartSummary();
      isEmptyCart();
    });
  });
}

function isEmptyCart(){
    if(cart.length == 0){
    const el = document.getElementById('empty-cart')
    el.hidden = !el.hidden
  }
}

async function loadCartItems() {
  loadFromStorage();
  const res = await fetch('/templates/cartItem.html');
  const template = await res.text();
  let cartItemHTML = '';

  for (const item of cart) {
    const prod = await getProduct(item.productId);
    let temp = template
      .replace('{{image}}', prod.image)
      .replace('{{name}}', prod.name)
      .replace('{{price}}', (prod.priceCents / 100).toFixed(2))
      .replace('{{quantity}}', item.quantity)
      .replace('{{product-id}}', prod.id)
      .replace('{{radio-buttons}}', getRadioButtonOptions(prod.id));

    cartItemHTML += temp;
  }

  document.querySelector('#review-cart-items').innerHTML = cartItemHTML;
  setCartRemoveButtonEvents()
}

function getCartQuantity() {
  loadFromStorage()
  return cart.reduce((total, item) => total + item.quantity, 0);
}

async function getCartTotalAmount() {
  let totalCents = 0;

  for (const item of cart) {
    const product = await getProduct(item.productId);
    totalCents += product.priceCents * item.quantity;
  }

  return (totalCents/100).toFixed(2);
}


async function updateCartSummary(){
  
  let totalAmount = await getCartTotalAmount()
  let tax = (totalAmount * 0.18).toFixed(2)
  let total = Number(totalAmount) + Number(tax)

  document.querySelector('#cart-summary-total-qty').innerHTML= 'Totaly Qty: ' + getCartQuantity()
  document.querySelector('#cart-summary-total-before-tax').innerHTML= 'Total before tax: $' + totalAmount
  document.querySelector('#cart-summary-tax').innerHTML= 'Estimated tax (18%): $' + tax
  document.querySelector('#cart-summary-total').innerHTML= 'Total: $' + total.toFixed(2)
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.endsWith('cart.html')) {
    loadCartItems();
    updateCartSummary();
    isEmptyCart()
  }
});


export {
  cart,
  addToCart,
  removeFromCart,
  updateDeliveryOption,
  updateCartQuantity,
  setAddToCardClickEvent,
  loadFromStorage
};
