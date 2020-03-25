/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      //alert('Logged in successfully!');
      showAlert('success', 'Successfully logged in!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });
    console.log(res);
    if (res.data.status === 'success') {
      location.reload(true);
      showAlert('success', 'Logged Out!');
    }
  } catch (err) {
    console.log(res.data.message.status);
    showAlert('error', 'Error Logging out!');
  }
};
