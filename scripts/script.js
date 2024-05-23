const serverCheck = document.querySelector('#server-check');
const apiTest = window.env.API_URL_CHECK;

const checkServer = async () => {
  try {
    const res = await fetch(apiTest);
    const data = await res.json();
    if (data.success) serverCheck.style.display = 'none'
  } catch (error) {
      serverCheck.style.display = 'flex';
    console.log(error.message);
  }
}

setInterval(checkServer, 3000);