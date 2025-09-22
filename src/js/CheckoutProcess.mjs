import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor(cartKey = "so-cart") {
    this.cartKey = cartKey;
    this.subtotal = 0;
    this.totalItems = 0;
  }

  // Calculate and display the item subtotal and number of items
  displayOrderSummary() {
    const cartItems = getLocalStorage(this.cartKey) || [];
    this.subtotal = cartItems.reduce(
      (sum, item) => sum + (item.FinalPrice || 0) * (item.quantity || 1),
      0
    );
    this.totalItems = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    document.getElementById("numberItems").textContent = this.totalItems;
    document.getElementById("cartTotal").textContent = `$${this.subtotal.toFixed(2)}`;
  }

  // Calculate and display tax, shipping, and total
  calculateAndDisplayTotals() {
    // Tax: 6% of subtotal
    const tax = this.subtotal * 0.06;
    // Shipping: $10 for first item, $2 for each additional
    const shipping = this.totalItems > 0 ? 10 + (this.totalItems - 1) * 2 : 0;
    const total = this.subtotal + tax + shipping;

    document.getElementById("tax").textContent = `$${tax.toFixed(2)}`;
    document.getElementById("shipping").textContent = `$${shipping.toFixed(2)}`;
    document.getElementById("total").textContent = `$${total.toFixed(2)}`;
  }
}