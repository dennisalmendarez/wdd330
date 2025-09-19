import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter } from "../js/utils.mjs";

loadHeaderFooter();

// Load header and footer templates
document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
});

const dataSource = new ProductData("tents");
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);
product.init();
