import { renderListWithTemplate, addProductToCart } from "./utils.mjs";


function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h3>${product.Brand.Name}</h3>
        <p>${product.NameWithoutBrand}</p>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
      <button class="quick-view-btn" data-id="${product.Id}">Quick View</button>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    document.querySelector(".title").textContent = this.category;

    // Add Quick View Listeners
    this.addQuickViewListeners(list);
  }

  addQuickViewListeners(list) {
    const quickViewBtns = document.querySelectorAll(".quick-view-btn");
    const modal = document.querySelector(".quick-view-modal");
    const modalCard = modal.querySelector(".quick-view-card");
    const closeBtn = document.querySelector(".close-btn");

    quickViewBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const product = list.find((p) =>p.Id === btn.dataset.id);

      modalCard.innerHTML = `
          <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
          <h3>${product.Brand.Name}</h3>
          <p>${product.NameWithoutBrand}</p>
          <p class="product-card__price">$${product.FinalPrice}</p>
              <p><strong>Color:</strong> ${product.Colors[0]?.ColorName}</p>
              <div class="quick-view-desc">
        ${product.DescriptionHtmlSimple}
      </div>
      `;

      // Open modal
      modal.classList.add("open");

      // Handle Add To cart
      document.getElementById("quickViewAddToCart").onclick = () => {
        addProductToCart(product);
        modal.classList.remove("open");
      };
      });
    });

    closeBtn.addEventListener("click", () => {
      modal.classList.remove("open");
    });

    // Close modal on overlay click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
      }
    });
  }

  renderList(list) {
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

    // apply use new utility function instead of the commented code above
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}