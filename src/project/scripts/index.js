const hamburger = document.querySelector('.menu');
const nav = document.querySelector('.menu-list');
const year = document.querySelector('.year');

year.innerHTML = new Date().getFullYear();

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('show');
})