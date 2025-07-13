const wrapper = document.querySelector('.wrapper');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const loginForm = document.querySelector('.form-box.login form');
const registerForm = document.querySelector('.form-box.register form');

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});

// Handle login form submission
loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission
    console.log('Login form submitted');
    // Redirect to the gallery page
    window.location.href = 'gallery.html';
});

// Handle registration form submission
registerForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission
    console.log('Registration form submitted');
    // Redirect to the gallery page
    window.location.href = 'gallery.html';
});