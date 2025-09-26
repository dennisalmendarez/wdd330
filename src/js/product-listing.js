import ProductList from "./ProductList.mjs";
import ExternalServices from "./ExternalServices.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

// Load header and footer on page load
loadHeaderFooter();

const category = getParam("category") || "tents";
const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");
const productList = new ProductList(category, dataSource, element);

productList.init();
