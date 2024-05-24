// evironment
const prod = false
let url = '';
url = prod ? 'https://funval-users.onrender.com' :
  'http://localhost:3001'

window.env = window.env || {};
window.env.API_URL = url;
window.env.API_URL_CHECK = url + '/is-alive';
window.env.API_URL_TERTERS = url + '/testers'
window.env.API_URL_USERS = url + '/users'

const apiUrl = window.env.API_URL_TERTERS;
const user = localStorage.getItem('username');
const pass = localStorage.getItem('password');

// login
export const loging = async () => {
  try {
    if (user && pass) {
      const reqUrl = apiUrl + '/login/?user=' + user + '&pass=' + pass + '';
      console.log('From login:', reqUrl)
      const rawRes = await fetch(reqUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const res = await rawRes.json();
      console.log('Login successful', res)
      return res.success
    }
  } catch (error) {
    console.log('Error thrown:', error.message)
  }
}

// check server
const serverCheck = document.querySelector('#server-check');
const apiTest = window.env.API_URL_CHECK;

export const checkServer = async () => {
  try {
    const res = await fetch(apiTest);
    const data = await res.json();
    if (data.success) serverCheck.style.display = 'none'
    console.log('Server active:', data.success)
  } catch (error) {
    serverCheck.style.display = 'flex';
    console.log('Url of error:', apiTest)
    console.log('Error thrown checking server:', error.message);
  }
}

setInterval(checkServer, 3000);