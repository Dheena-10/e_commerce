const buyButton = document.querySelectorAll('.buy-again-button');


buyButton.forEach((button)=>{
  button.addEventListener('click',()=>{
    alert('Ordered Successfully!');

    const productDetails = button.closest('.product-details');

    const quantityDiv = productDetails.querySelector('.product-quantity');

    let currQuan = parseInt(quantityDiv.textContent.replace('Quantity:',''));

    currQuan++;

    quantityDiv.textContent = `Quantity: ${currQuan}`;
  });
});
