export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

/**
 * Renders a template into a parent element.
 * @param {string} template The HTML string template.
 * @param {HTMLElement} parentElement The element to render the template into.
 * @param {*} [data] Optional data to pass to the callback.
 * @param {Function} [callback] Optional callback function to run after rendering.
 */
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

/**
 * Loads an HTML template from a specified path.
 * @param {string} path The path to the HTML template file.
 * @returns {Promise<string>} A promise that resolves with the template string.
 */
export async function loadTemplate(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load template: ${path}`);
  }
  const template = await res.text();
  return template;
}

export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  // Sum the quantity of all items in the cart
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const countElement = document.querySelector(".items-count");
  if (countElement) {
    // If there are items, show the count. If not, hide the circle.
    if (count > 0) {
      countElement.style.display = "flex";
      countElement.textContent = count;
    } else {
      countElement.style.display = "none";
    }
  }
}


/**
 * Loads and renders the header and footer templates into the page.
 */
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  if (headerElement && footerElement) {
    renderWithTemplate(headerTemplate, headerElement);
    renderWithTemplate(footerTemplate, footerElement);
  }
  updateCartCount(); // Update cart count after loading header
}
