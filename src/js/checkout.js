import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

// Load header and footer on page load
loadHeaderFooter();

// create an instance of our checkout process class
const myCheckout = new CheckoutProcess("so-cart", ".order-summary");

// and call the init method to get it running
myCheckout.init();