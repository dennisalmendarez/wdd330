import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById("add-to-cart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Category.charAt(0).toUpperCase() + product.Category.slice(1);
  document.querySelector("#p-brand").textContent = product.Brand.Name;
  document.querySelector("#p-name").textContent = product.NameWithoutBrand;

  const productImage = document.querySelector("#p-image");
  productImage.src = product.Images.PrimaryExtraLarge;
  productImage.alt = product.NameWithoutBrand;
  const euroPrice = new Intl.NumberFormat('de-DE',
    {
      style: 'currency', currency: 'EUR',
    }).format(Number(product.FinalPrice) * 0.85);
  document.querySelector("#p-price").textContent = `${euroPrice}`;
  document.querySelector("#p-color").textContent = product.Colors[0].ColorName;
  document.querySelector("#p-description").innerHTML = product.DescriptionHtmlSimple;

  document.querySelector("#add-to-cart").dataset.id = product.Id;
}


function getProductId() {
  // Adjust this to get the product ID from your URL or page context
  const params = new URLSearchParams(window.location.search);
  return params.get('product');
}

function getComments(productId) {
  return JSON.parse(localStorage.getItem(`comments_${productId}`)) || [];
}

function saveComment(productId, comment) {
  const comments = getComments(productId);
  comments.push({ text: comment, date: new Date().toISOString() });
  localStorage.setItem(`comments_${productId}`, JSON.stringify(comments));
}

function renderComments(productId) {
  const commentsList = document.getElementById('comments-list');
  commentsList.innerHTML = '';
  const comments = getComments(productId);
  comments.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `${c.text} (${new Date(c.date).toLocaleString()})`;
    commentsList.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const productId = getProductId();
  renderComments(productId);

  document.getElementById('comment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const commentInput = document.getElementById('comment-input');
    if (commentInput.value.trim()) {
      saveComment(productId, commentInput.value.trim());
      commentInput.value = '';
      renderComments(productId);
    }
  });
});
