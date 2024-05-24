const prod = true
let url = '';
url = prod ? 'https://funval-users.onrender.com' : 
'http://localhost:3001'

  window.env = window.env || {};
  window.env.API_URL = url;
  window.env.API_URL_CHECK = url + '/is-alive';
  window.env.API_URL_TERTERS = url +'/testers'
  window.env.API_URL_USERS = url + '/users'