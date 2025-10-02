import { renderListWithTemplate, addProductToCart, getDiscountBadge } from "./utils.mjs";

function productCardTemplate(product) {
  // NEW: Updated price display logic directly in the template
  const discountBadge = getDiscountBadge(product);
  let priceHtml = `<p class="product-card__price">$${product.FinalPrice}</p>`;
  if (discountBadge) {
      priceHtml = `<p class="product-card__price"><span style='text-decoration:line-through;color:#888;'>$${product.SuggestedRetailPrice}</span> <span style='color:#d32f2f;font-weight:bold;'>$${product.FinalPrice}</span></p>`;
  }
  
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        ${discountBadge} 
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        ${priceHtml}
      </a>
      <button class="quick-view-btn" data-id="${product.Id}">Quick View</button>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement, filTerm=null) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.filTerm = filTerm;
  }

  async init() {
    const list = await this.dataSource.getData(this.category, this.filTerm);
    this.renderList(list);
    document.querySelector(".title").textContent = this.category;
    this.addQuickViewListeners(list);
  }

  addQuickViewListeners(list) {
    const quickViewBtns = document.querySelectorAll(".quick-view-btn");
    const modal = document.querySelector(".quick-view-modal");
    const modalCard = modal.querySelector(".quick-view-card");
    const closeBtn = document.querySelector(".close-btn");

    quickViewBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const product = list.find((p) => p.Id === btn.dataset.id);

        // --- DISCOUNT LOGIC (from your new file) ---
        const discountBadge = getDiscountBadge(product);
        let priceHtml = `<p class="product-card__price">$${product.FinalPrice}</p>`;
        if (discountBadge) {
          priceHtml = `<p class="product-card__price"><span style='text-decoration:line-through;color:#888;'>$${product.SuggestedRetailPrice}</span> <span style='color:#d32f2f;font-weight:bold;'>$${product.FinalPrice}</span></p>`;
        }
        
        // --- CAROUSEL LOGIC ---
        const allImages = [
          product.Images.PrimaryMedium,
          ...(product.Images.ExtraImages?.map(img => img.Src) || [])
        ];
        let imageHtml = "";
        if (allImages.length > 1) {
          imageHtml = `
            <div class="carousel">
              <div class="carousel-main">
                <img id="modal-carousel-img" src="${allImages[0]}" alt="${product.NameWithoutBrand}">
                <button class="carousel-btn prev">&lt;</button>
                <button class="carousel-btn next">&gt;</button>
              </div>
              <div class="carousel-thumbnails">
                ${allImages.map((src, index) => 
                  `<img src="${src}" alt="Thumbnail ${index + 1}" class="${index === 0 ? "active" : ""}" data-index="${index}">`
                ).join("")}
              </div>
            </div>`;
        } else {
          imageHtml = `<img src="${allImages[0]}" alt="${product.NameWithoutBrand}">`;
        }
        
        // --- COMBINE EVERYTHING INTO THE MODAL ---
        modalCard.innerHTML = `
          ${imageHtml}
          <h3>${product.Brand.Name}</h3>
          <p>${product.NameWithoutBrand}</p>
          ${priceHtml}
          ${discountBadge}
          <p><strong>Color:</strong> ${product.Colors[0]?.ColorName}</p>
          <div class="quick-view-desc">${product.DescriptionHtmlSimple}</div>
        `;
        
        modal.classList.add("open");

        // Set up carousel listeners for the modal IF it exists
        this.setupModalCarousel(modal);

        document.getElementById("quickViewAddToCart").onclick = () => {
          addProductToCart(product);
          modal.classList.remove("open");
        };
      });
    });

    closeBtn.addEventListener("click", () => modal.classList.remove("open"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  }
  
  // This helper method is still needed
  setupModalCarousel(modal) {
    const mainImg = modal.querySelector("#modal-carousel-img");
    const thumbnails = modal.querySelectorAll(".carousel-thumbnails img");
    const prevBtn = modal.querySelector(".carousel-btn.prev");
    const nextBtn = modal.querySelector(".carousel-btn.next");

    if (!mainImg) return; 

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

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}