// Function to find an element in the DOM
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// Save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// Get the product id from the query string
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

export function renderWithTemplate(template, parentElement, data, callback) {
    if (parentElement) {
        parentElement.innerHTML = template;
        if (callback) {
            callback(data);
        }
    }
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load template: ${path}`);
  return await response.text();
}

export function updateCartCount() {
    const cartItems = getLocalStorage("so-cart") || [];
    const count = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const countElement = document.querySelector(".items-count");
    if (countElement) {
        countElement.textContent = count;
    }
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("header");
  const footerElement = document.querySelector("footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
  
  updateCartCount();
}