// 1. Add getLocalStorage to the import
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

// 2. Replaced the original function

// function addProductToCart(product) {
//   setLocalStorage("so-cart", product);
// }

// with this one

function addProductToCart(product) {
  // Get the existing cart, or create a new empty array if nothing is there
  const cart = getLocalStorage("so-cart") || [];
  // Add the new product to the array
  cart.push(product);
  // Save the updated array back to local storage
  setLocalStorage("so-cart", cart);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
