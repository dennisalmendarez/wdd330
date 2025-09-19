import ProductList from "./ProductList.mjs";
import ProductData from "./ProductData.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();
const dataSource = new ProductData("tents");

const element = document.querySelector(".product-list");

const productList = new ProductList("Tents", dataSource, element);

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
});

productList.init();
