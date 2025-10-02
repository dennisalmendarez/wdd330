// Import getDiscountBadge, which is new for this file
import { getLocalStorage, setLocalStorage, updateCartCount, getDiscountBadge } from "./utils.mjs";

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
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
    // After rendering, set up the carousel if it exists
    this.setupCarousel();
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    const existingItem = cartItems.find((item) => item.Id === this.product.Id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const newItem = { ...this.product, quantity: 1 };
      cartItems.push(newItem);
    }
    
    setLocalStorage("so-cart", cartItems);
    updateCartCount();
  }

  renderProductDetails() {
    document.querySelector("h2").textContent = this.product.Brand.Name;
    document.querySelector("h3").textContent = this.product.NameWithoutBrand;
    document.getElementById("productColor").textContent = this.product.Colors[0].ColorName;
    document.getElementById("productDesc").innerHTML = this.product.DescriptionHtmlSimple;
    document.getElementById("addToCart").dataset.id = this.product.Id;

    // --- NEW: DISCOUNT LOGIC ---
    const discountBadge = getDiscountBadge(this.product);
    const priceElement = document.getElementById("productPrice");
    if (discountBadge) {
      priceElement.innerHTML = `<span style='text-decoration:line-through;color:#888;'>$${this.product.SuggestedRetailPrice}</span> <span style='color:#d32f2f;font-weight:bold;'>$${this.product.FinalPrice}</span>`;
      // Add the badge after the price
      priceElement.insertAdjacentHTML("afterend", discountBadge);
    } else {
      priceElement.textContent = `$${this.product.FinalPrice}`;
    }

    // --- CAROUSEL LOGIC ---
    const carouselContainer = document.getElementById("image-carousel-container");
    const allImages = [
      this.product.Images.PrimaryMedium,
      ...(this.product.Images.ExtraImages?.map(img => img.Src) || [])
    ];

    if (allImages.length > 1) {
      carouselContainer.innerHTML = `
        <div class="carousel-main">
          <img id="carousel-main-img" src="${allImages[0]}" alt="${this.product.NameWithoutBrand}">
          <button class="carousel-btn prev">&lt;</button>
          <button class="carousel-btn next">&gt;</button>
        </div>
        <div class="carousel-thumbnails">
          ${allImages.map((src, index) => 
            `<img src="${src}" alt="Thumbnail ${index + 1}" class="${index === 0 ? "active" : ""}" data-index="${index}">`
          ).join("")}
        </div>
      `;
    } else {
      carouselContainer.innerHTML = `<img src="${allImages[0]}" alt="${this.product.NameWithoutBrand}" class="divider">`;
    }
  }

  setupCarousel() {
    const mainImg = document.getElementById("carousel-main-img");
    const thumbnails = document.querySelectorAll(".carousel-thumbnails img");
    const prevBtn = document.querySelector(".carousel-btn.prev");
    const nextBtn = document.querySelector(".carousel-btn.next");

    if (!mainImg) return; // No carousel to set up

    let currentIndex = 0;
    const totalImages = thumbnails.length;

    function updateCarousel(index) {
      mainImg.src = thumbnails[index].src;
      thumbnails.forEach(thumb => thumb.classList.remove("active"));
      thumbnails[index].classList.add("active");
      currentIndex = index;
    }

    thumbnails.forEach(thumb => {
      thumb.addEventListener("click", () => updateCarousel(parseInt(thumb.dataset.index)));
    });

    prevBtn.addEventListener("click", () => {
      const newIndex = (currentIndex - 1 + totalImages) % totalImages;
      updateCarousel(newIndex);
    });

    nextBtn.addEventListener("click", () => {
      const newIndex = (currentIndex + 1) % totalImages;
      updateCarousel(newIndex);
    });
  }
}