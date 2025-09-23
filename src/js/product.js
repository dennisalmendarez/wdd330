import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// Load header and footer on page load
loadHeaderFooter();

const dataSource = new ProductData("category");
const productID = getParam("product");
const product = new ProductDetails(productID, dataSource);

product.init();
