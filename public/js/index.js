/* eslint-disable */

//this file here is more to get data from user interface and then delegate de action!
import '@babel/polyfill';
import { displayMap } from './mapBox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

//Dom Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const loggedBtn = document.querySelector('.nav__el--logout');
const dataForm = document.querySelector('.form.form-user-data');
const passwordForm = document.querySelector('.form-user-password');
//Values

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);

  displayMap(locations);
}

////*************Login Form */
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

/**** Settings form */
if (dataForm) {
  dataForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    updateSettings({ name, email }, 'data');
  });
}

if (passwordForm) {
  passwordForm.addEventListener('submit', async e => {
    e.preventDefault();

    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const confirmNewPassword = document.getElementById('password-confirm')
      .value;

    await updateSettings(
      { currentPassword, newPassword, confirmNewPassword },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
