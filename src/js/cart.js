import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Attach remove listeners to each X
  document.querySelectorAll(".cart-card__remove").forEach((btn) => {
    btn.addEventListener("click", function () {
      removeFromCart(btn.dataset.id);
    });
  });
}
function cartItemTemplate(item) {
  return `<li class="cart-card divider" 
    style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; min-height: 180px; margin: 0 auto;">
    <span class="cart-card__remove" data-id="${item.Id}" 
      style="cursor:pointer; align-self: flex-end; font-size: 1.5rem; margin-bottom: 0.5rem;">&#10006;</span>
    <img src="${item.Image}" alt="${item.Name}" 
      style="width: 100px; height: 100px; object-fit: cover; margin-bottom: 0.5rem;" />
    <h2 class="card__name" 
      style="margin: 0 0 0.5rem 0; font-size: 1rem; text-align: center;">${item.Name}</h2>
    <p class="cart-card__color" 
      style="margin: 0 0 0.5rem 0; text-align: center;">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity" 
      style="margin: 0 0 0.5rem 0; text-align: center;">qty: 1</p>
    <p class="cart-card__price" 
      style="margin: 0; text-align: center;">$${item.FinalPrice}</p>
  </li>`;
}
function removeFromCart(id) {
  let cartItems = getLocalStorage("so-cart") || [];
  cartItems = cartItems.filter(item => item.Id !== id);
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

renderCartContents();