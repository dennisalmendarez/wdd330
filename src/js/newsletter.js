// newsletter.js

export default class Newsletter {
  constructor(formSelector, messageSelector) {
    this.form = document.querySelector(formSelector);
    this.message = document.querySelector(messageSelector);
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = this.form.querySelector("input[type='email']");
      const email = emailInput.value.trim();

      if (!this.validateEmail(email)) {
        this.message.textContent = "Please enter a valid email address.";
        this.message.className = "message error";
        return;
      }

      // Save locally for now (could be replaced with API call later)
      this.saveEmail(email);

      this.message.textContent = `Thanks for subscribing, ${email}!`;
      this.message.className = "message success";

      this.form.reset();
    });
  }

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  saveEmail(email) {
    let subscribers = JSON.parse(localStorage.getItem("subscribers")) || [];
    subscribers.push({ email, date: new Date().toISOString() });
    localStorage.setItem("subscribers", JSON.stringify(subscribers));
  }
}
