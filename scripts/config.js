const prod = true
prod ? ulr = 'https://funval-users.onrender.com' : 
url = 'http://localhost:3001'

  window.env = window.env || {};
  window.env.API_URL = url;
  window.env.API_URL_CHECK = url + '/is-alive';
  window.env.API_URL_TERTERS = url +'/testers'
  window.env.API_URL_USERS = url + '/users'