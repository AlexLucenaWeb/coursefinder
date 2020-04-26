import '@babel/polyfill';
import {login} from './login';

//DOM elements
const loginForm = document.querySelector('.form--login');

// if (loginForm) {
//   loginForm.submit(function(event) {
//     event.preventDefault();
//     const email = $('#email').val();
//     const password = $('#password').val();
//     login(email, password);
//   });
// }
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
