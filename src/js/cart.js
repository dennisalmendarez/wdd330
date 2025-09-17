import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
} from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
});

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotalElement = document.querySelector(".cart-total");
  const productList = document.querySelector(".product-list");

  if (cartItems.length > 0) {
    cartFooter.classList.remove("hide");

    const total = cartItems.reduce((acc, item) => acc + item.FinalPrice, 0);
    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;

    productList.innerHTML = cartItems.map(cartItemTemplate).join("");
  } else {
    cartFooter.classList.add("hide");
    cartTotalElement.textContent = "";
    productList.textContent =
      "Your cart is empty. Please add items before checking out.";
  }
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
  cartItems = cartItems.filter((item) => item.Id !== id);
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}
// added for removing items from cart cleanly.
document.querySelector(".product-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("cart-card__remove")) {
    removeFromCart(e.target.dataset.id);
  }
});

renderCartContents();
