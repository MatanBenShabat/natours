import '@babel/polyfill';
import { fetchLogin } from './login';
import { fetchSignup } from './signup';
import { displayMap } from './leaflet';
import showAlert from './alerts';
import { fetchLogout } from './logout';

// DOM ELEMENTS
const leafletMap = document.getElementById('map');
const loginForm = document.getElementById('form-login');
const signupForm = document.getElementById('form-signup');
const logoutBtn = document.getElementById('logout')

// MAP
if (leafletMap) {
  const locations = JSON.parse(leafletMap.dataset.locations);
  displayMap(locations);
}

// LOGIN
if (loginForm) {
  const handleLogin = (e) => {
    e.preventDefault();
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');

    fetchLogin(emailInput.value, passwordInput.value);
  };

  loginForm.addEventListener('submit', handleLogin);
}

// SIGN-UP
if (signupForm) {
  const handleSignUp = (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('passwordConfirm');

    if (passwordInput.value !== passwordConfirmInput.value) {
      showAlert('error', 'Passwords must match!');
      return;
    }

    const formData = {
      name: nameInput.value.toLowerCase(),
      email: emailInput.value.toLowerCase(),
      password: passwordInput.value,
      passwordConfirm: passwordConfirmInput.value,
    };

    fetchSignup(formData);
  };

  signupForm.addEventListener('submit', handleSignUp);
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', fetchLogout)
}