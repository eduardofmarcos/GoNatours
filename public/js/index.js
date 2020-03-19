/* eslint-disable */

//this file here is more to get data from user interface and then delegate de action!
import '@babel/polyfill';
import { displayMap } from './mapBox';
import { login, logout } from './login';

//Dom Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const loggedBtn = document.querySelector('.nav__el--logout');

//Values

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);

  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (loggedBtn) {
  loggedBtn.addEventListener('click', logout);
}
