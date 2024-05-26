import { loging } from "./helpers.js";

if(await loging()) {
  window.location.href = 'manage-users.html'
} else {
  document.getElementById('profile-pic').style.display = 'none'
  document.getElementById('user-name').style.display = 'none'
}  

const testerUrl = window.env.API_URL_TERTERS
const errorSpan = document.getElementById('error-span')
document.getElementById('submit-btn').addEventListener('click', async (e) => {
  e.preventDefault()
  errorSpan.style.display = 'none'
  const user = document.getElementById('username').value.trim()
  const pass = document.getElementById('password').value.trim()
  try {
    const rawRes = await fetch(testerUrl + '/login/?user=' + user + '&pass=' + pass)
    const res = await rawRes.json()
    if (res.success) {
      localStorage.setItem('username', user)
      localStorage.setItem('password', pass)
      window.location.href = 'manage-users.html'
    } else {
      errorSpan.style.display = 'block'
    }
  } catch (error) {
    console.log('Error thrown:', error)
    errorSpan.style.display = 'block'
  }
})