import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "../js/utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";


loadHeaderFooter();
const cart = new ShoppingCart(document.querySelector(".product-list"));
cart.init();


  const cartFooter = document.querySelector(".cart-footer");
  const cartTotalElement = document.querySelector(".cart-total");

  if (cartItems.length > 0) {
    cartFooter.classList.remove("hide");
    const total = cartItems.reduce((acc, item) => acc + item.FinalPrice, 0);
    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
  } else {
    cartFooter.classList.add("hide");
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Attach remove listeners to each X
  document.querySelectorAll(".cart-card__remove").forEach((btn) => {
    btn.addEventListener("click", function () {
      removeFromCart(btn.dataset.id);
    });
  });


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
  cartItems = cartItems.filter((item) => item.Id !== id);
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

renderCartContents();
