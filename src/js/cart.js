import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  let cartItems = getLocalStorage("so-cart") || [];

  // Remove duplicates by Id and sum quantities
  const uniqueItems = [];
  const seenIds = new Map();
  for (const item of cartItems) {
    if (seenIds.has(item.Id)) {
      uniqueItems[seenIds.get(item.Id)].quantity += item.quantity || 1;
    } else {
      item.quantity = item.quantity || 1;
      seenIds.set(item.Id, uniqueItems.length);
      uniqueItems.push(item);
    }
  }

  const htmlItems = uniqueItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Calculate and display total
  const total = uniqueItems.reduce((sum, item) => sum + (item.FinalPrice || 0) * (item.quantity || 1), 0);
  let totalElement = document.querySelector(".cart-total");
  if (!totalElement) {
    totalElement = document.createElement("div");
    totalElement.className = "cart-total";
    document.querySelector(".product-list").insertAdjacentElement("afterend", totalElement);
  }
  totalElement.textContent = `Total: $${total.toFixed(2)}`;

  // Add remove listeners
  document.querySelectorAll(".cart-card__remove").forEach((btn) => {
    btn.addEventListener("click", function () {
      removeFromCart(btn.dataset.id);
    });
  });

  // Add quantity change listeners
  document.querySelectorAll(".cart-card__quantity-input").forEach((input) => {
    input.addEventListener("change", function () {
      updateQuantity(input.dataset.id, Number(input.value));
    });
  });
}

function cartItemTemplate(item) {
  const imageUrl = item.Images?.PrimaryMedium || item.PrimaryMedium || item.Image || "";
  const newItem = `<li class="cart-card divider">
    <span class="cart-card__remove" data-id="${item.Id}" style="cursor:pointer; float:right; font-size:1.5rem;">&#10006;</span>
    <a href="#" class="cart-card__image">
      <img
        src="${imageUrl}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors && item.Colors[0] ? item.Colors[0].ColorName : ""}</p>
    <label>
      qty: <input type="number" min="1" value="${item.quantity || 1}" data-id="${item.Id}" class="cart-card__quantity-input" style="width: 40px;">
    </label>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
  return newItem;
}

function removeFromCart(id) {
  let cartItems = getLocalStorage("so-cart") || [];
  cartItems = cartItems.filter(item => item.Id !== id);
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

function updateQuantity(id, newQuantity) {
  let cartItems = getLocalStorage("so-cart") || [];
  cartItems = cartItems.map(item => {
    if (item.Id === id) {
      return { ...item, quantity: newQuantity };
    }
    return item;
  });
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

renderCartContents();
