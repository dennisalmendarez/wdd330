
import ProductList from "./ProductList.mjs";
import ExternalServices from "./ExternalServices.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

// Load header and footer on page load
const sorter = document.querySelector("#sorter");
const options = document.querySelector("#sort-options");
const price_sort = document.querySelector(".price");
const name_sort = document.querySelector(".alphabet");

loadHeaderFooter();

sorter.addEventListener("click", () => {
    options.classList.toggle("show");
});

price_sort.addEventListener("click", () => {
    element.innerHTML = "";
    options.classList.toggle("show");
    new ProductList(category, dataSource, element, "price").init();
    
});
name_sort.addEventListener("click", () => {
    element.innerHTML = "";
    options.classList.toggle("show");
    new ProductList(category, dataSource, element, "name").init();
});

const category = getParam("category") || "tents";
const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");
const productList = new ProductList(category, dataSource, element);


productList.init();
