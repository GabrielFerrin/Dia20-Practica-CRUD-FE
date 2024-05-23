const apiUrl = window.env.API_URL_TERTERS;
const password = document.querySelector('#password');
const spinner01 = document.getElementById('spinner01');
const spinner02 = document.getElementById('spinner02');
const checkmark = document.getElementById('checkmark');
const testerError = document.getElementById('tester-error');
const passwordError = document.getElementById('password-error');
const usernameError = document.getElementById('username-error');
const usersAvailable = document.querySelector('#users-available');
const info = document.querySelector('#info');
let usernameAvailable = false;

// check availability for new testers
const checkTestersAvailable = async () => {
  spinner01.style.display = 'block';
  // check available users
  try {
    const res = await fetch(apiUrl + '/check')
    const data = await res.json()
    spinner01.style.display = 'none';
    if (data.testers) {
      usersAvailable.textContent = data.testers
      testerError.style.display = 'none';
    } else {
      info.style.display = 'none';
      testerError.style.display = 'block';
    }
  } catch (error) {
    console.log(error.message)
    spinner01.style.display = 'none';
  }
}

checkTestersAvailable();

const submitBtn = document.getElementById('submit-btn');

submitBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  const form = document.forms[0]
  const data = {
    username: form.username.value,
    password: form.password.value,
    comment: form.comment.value
  }
  try {
    const res = await fetch(apiUrl + '/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resData = await res.json()
    console.log('resData:', resData.success)
    if (!resData.success) {
      const errorList = document.getElementById('error-list')
      resData.forEach(error => {
        const li = document.createElement('li')
        li.textContent = error
        errorList.appendChild(li)
      })
    } else {
      alert('success')
    }
  } catch (error) {
    console.log('error:', error)
  }
})

// 
const checkUsernameAvailable = async () => {
  const username = document.querySelector('#username').value
  const form = document.forms[0]
  try {
    const res = await fetch(apiUrl + '/available/' + username)
    const data = await res.json()
    spinner02.style.display = 'none';
    if (data.success) {
      usernameError.style.display = 'none';
      checkmark.style.display = 'block';
      usernameAvailable = true
    } else {
      usernameError.style.display = 'block';
      checkmark.style.display = 'none';
      submitBtn.disabled = true
      usernameAvailable = false
    }
    form.checkValidity() && usernameAvailable ?
    submitBtn.disabled = false : submitBtn.disabled = true
  } catch (error) {
    console.log(error.message)
  }
}

const elements = document.querySelectorAll('input[type="text"], input[type="password"]');
let timoutId;
elements.forEach(element => {
  element.addEventListener('input', async (event) => {
    const form = document.forms[0]
    submitBtn.disabled = true
    // check username availability
    if (event.target.id === 'username' && event.target.value.length) {
      spinner02.style.display = 'block';
      checkmark.style.display = 'none';
      usernameError.style.display = 'none';
      clearTimeout(timoutId);
      timoutId = setTimeout(checkUsernameAvailable, 1000);
    } else {
      form.checkValidity() && usernameAvailable ?
      submitBtn.disabled = false : submitBtn.disabled = true
    }
    if (password.value.length < 8) passwordError.style.display = 'block';
    else passwordError.style.display = 'none';
  })
});
