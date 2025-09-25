import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();


import CheckoutProcess from "./CheckoutProcess.mjs";

const myCheckout = new CheckoutProcess("so-cart", "#checkoutSummary");
myCheckout.init();

document.querySelector('#checkoutSubmit').addEventListener('click', (e) => {
  e.preventDefault();
  const myForm = document.forms["checkout"];
  const chk_status = myForm.checkValidity();
  myForm.reportValidity();
  if (chk_status) {
    myCheckout.checkout();
  }
});