const apiUrl = window.env.API_URL_TERTERS;
const user = localStorage.getItem('username');
const pass = localStorage.getItem('password');

export const loging = async () => {
  if (user && pass) {
    const url = apiUrl + '/login/?user=' + user + '&pass=' + pass + '';
    const rawRes = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await rawRes.json();
    return res.success
  }
}