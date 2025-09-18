// ShoppingCart.mjs
import { renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider" data-id="${item.Id}">
      <a href="#" class="cart-card__image">
        <img
          src="${item.Images.PrimaryMedium}"
          alt="${item.Name}"
        />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: ${item.quantity}</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <span class="cart-card__remove" data-id="${item.Id}">❌</span>
    </li>
  `;
}

export default class ShoppingCart {
  constructor(listElement, dataSource) {
    this.listElement = listElement;
    this.dataSource = dataSource;
    this.items = this.getCartContents() || [];
  }

  // Render all cart items using the template utility
  renderCartContents() {
    if (this.items.length === 0) {
      this.listElement.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
      this.updateCartTotal();
      return;
    }

    // Use the same pattern as ProductList
    renderListWithTemplate(cartItemTemplate, this.listElement, this.items);
    
    // Add event listeners for remove buttons
    this.addRemoveListeners();
    this.updateCartTotal();
  }

  // Add item to cart
  addToCart(product, quantity = 1) {
    const existingItem = this.items.find(item => item.Id === product.Id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        ...product,
        quantity: quantity
      });
    }
    
    this.saveCartContents();
    this.renderCartContents();
  }

  // Remove item from cart
  removeFromCart(productId) {
    this.items = this.items.filter(item => item.Id !== productId);
    this.saveCartContents();
    this.renderCartContents();
  }

  // Update item quantity
  updateQuantity(productId, newQuantity) {
    const item = this.items.find(item => item.Id === productId);
    if (item) {
      if (newQuantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = newQuantity;
        this.saveCartContents();
        this.renderCartContents();
      }
    }
  }

  // Add event listeners for remove buttons
  addRemoveListeners() {
    const removeButtons = this.listElement.querySelectorAll('.cart-card__remove');
    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = button.dataset.id;
        this.removeFromCart(productId);
      });
    });
  }

  // Calculate and display cart total
  updateCartTotal() {
    const total = this.items.reduce((sum, item) => {
      return sum + (item.FinalPrice * item.quantity);
    }, 0);

    const totalElement = document.querySelector('.cart-total');
    if (totalElement) {
      totalElement.textContent = `Total: $${total.toFixed(2)}`;
    }

    // Update cart count in header
    const cartCount = document.querySelector('.cart-count');
    const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
      cartCount.textContent = itemCount;
    }
  }

  // Get cart contents from localStorage
  getCartContents() {
    try {
      const cartData = localStorage.getItem('so-cart');
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  }

  // Save cart contents to localStorage
  saveCartContents() {
    try {
      localStorage.setItem('so-cart', JSON.stringify(this.items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  // Clear entire cart
  clearCart() {
    this.items = [];
    this.saveCartContents();
    this.renderCartContents();
  }

  // Get cart item count
  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Get cart total value
  getTotalValue() {
    return this.items.reduce((sum, item) => {
      return sum + (item.FinalPrice * item.quantity);
    }, 0);
  }
}