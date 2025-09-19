import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

// Load header and footer on page load
loadHeaderFooter();

const cart = new ShoppingCart(document.querySelector(".product-list"));
cart.init();
