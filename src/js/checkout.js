import CheckoutProcess from "./CheckoutProcess.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess();
checkout.displayOrderSummary();

// Calculate totals after zip code is filled (or on page load for demo)
document.getElementById("zip").addEventListener("blur", () => {
  checkout.calculateAndDisplayTotals();
});

// Optionally, calculate on page load as well
checkout.calculateAndDisplayTotals();
