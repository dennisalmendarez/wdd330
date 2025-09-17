export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}


// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get the product id from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);

  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template(data);
  if (callback) {
    callback();
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load template: ${path}`);
  return await response.text();
}

export async function loadHeaderFooter() {
  const headerHTML = await loadTemplate("/partials/header.html");
  const footerHTML = await loadTemplate("/partials/footer.html");

  const headerElement = document.getElementById("header-placeholder");
  const footerElement = document.getElementById("footer-placeholder");

  renderWithTemplate(() => headerHTML, headerElement);
  renderWithTemplate(() => footerHTML, footerElement);
}