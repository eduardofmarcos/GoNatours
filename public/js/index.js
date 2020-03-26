/* eslint-disable */

//this file here is more to get data from user interface and then delegate de action!
import "@babel/polyfill";
import { displayMap } from "./mapBox";
import { login, logout } from "./login";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";
import { showAlert } from "./alerts";

//Dom Elements
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const loggedBtn = document.querySelector(".nav__el--logout");
const dataForm = document.querySelector(".form.form-user-data");
const passwordForm = document.querySelector(".form-user-password");
const bookBtn = document.getElementById("book-tour");
//Values

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);

  displayMap(locations);
}

////*************Login Form */
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });
}

if (loggedBtn) {
  loggedBtn.addEventListener("click", logout);
}

/**** Settings form */
if (dataForm) {
  dataForm.addEventListener("submit", e => {
    e.preventDefault();

    const form = new FormData();

    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    console.log(form);
    updateSettings(form, "data");
  });
}

if (passwordForm) {
  passwordForm.addEventListener("submit", async e => {
    e.preventDefault();

    document.querySelector(".btn--save-password").textContent = "Updating...";

    const currentPassword = document.getElementById("password-current").value;
    const newPassword = document.getElementById("password").value;
    const confirmNewPassword = document.getElementById("password-confirm")
      .value;

    await updateSettings(
      { currentPassword, newPassword, confirmNewPassword },
      "password"
    );

    document.querySelector(".btn--save-password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}

/*********** Checking out button */
if (bookBtn) {
  bookBtn.addEventListener("click", async e => {
    e.target.textContent = "Processing...";
    const tourToGet = e.target.dataset.tourId;
    bookTour(tourToGet);
  });
}

const alertMessage = document.querySelector("body").dataset.alert;
if (alertMessage) showAlert("success", alertMessage, 10);
