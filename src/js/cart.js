import { loadHeaderFooter } from "../js/utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";


loadHeaderFooter();
const cart = new ShoppingCart(document.querySelector(".product-list"));
cart.init();

//refactored to use ShoppingCart class in ShoppingCart.mjs