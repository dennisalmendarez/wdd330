import { getLocalStorage } from "./utils.mjs";
// NEW: Import the ExternalServices module
import ExternalServices from "./ExternalServices.mjs";

// NEW HELPER: takes a form element and returns an object where the key is the "name" of the form input.
function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

// NEW HELPER: takes the items currently stored in the cart and returns them in a simplified form.
function packageItems(items) {
  return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.quantity,
    }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    // NEW: Create an instance of ExternalServices
    this.services = new ExternalServices();
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document
      .querySelector("#zip")
      .addEventListener("blur", () => this.calculateOrderTotal());

    // UPDATED: The event listener now calls the new checkout method
    document.getElementById("checkout-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.checkout(e.target);
    });
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (total, item) => total + item.FinalPrice * item.quantity,
      0
    );
    this.displaySubtotal();
  }

  displaySubtotal() {
    const subtotalElement = document.querySelector(
      `${this.outputSelector} #subtotal`
    );
    if (subtotalElement) {
      subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    }
    this.displayOrderTotals();
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    const totalItems = this.list.reduce((sum, item) => sum + item.quantity, 0);
    this.shipping = totalItems > 0 ? 10 + (totalItems - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const subtotalEl = document.querySelector(
      `${this.outputSelector} #subtotal`
    );
    const taxEl = document.querySelector(`${this.outputSelector} #tax`);
    const shippingEl = document.querySelector(
      `${this.outputSelector} #shipping`
    );
    const totalEl = document.querySelector(`${this.outputSelector} #orderTotal`);

    if (subtotalEl && taxEl && shippingEl && totalEl) {
      subtotalEl.innerText = `$${this.itemTotal.toFixed(2)}`;
      taxEl.innerText = `$${this.tax.toFixed(2)}`;
      shippingEl.innerText = `$${this.shipping.toFixed(2)}`;
      totalEl.innerText = `$${this.orderTotal.toFixed(2)}`;
  }
  }

  // NEW METHOD: Prepares and sends the order
  async checkout(form) {
    // build the data object to send to the server
    const json = formDataToJSON(form);
    json.orderDate = new Date().toISOString();
    json.orderTotal = this.orderTotal.toFixed(2);
    json.tax = this.tax.toFixed(2);
    json.shipping = this.shipping.toFixed(2);
    json.items = packageItems(this.list);
    
    try {
      // call the checkout method in the ExternalServices module and send it the data
      const res = await this.services.checkout(json);
      console.log(res); 
      // on success redirect to success page.
      localStorage.removeItem(this.key);
      window.location.href = "/checkout/success.html";
    } catch (err) {
      // if there is an error, display a message
      console.log(err);
      const errorMessages = Object.values(err.message).join("\n");
      alert(`There was an error: \n${errorMessages}`);
    }
  }
}