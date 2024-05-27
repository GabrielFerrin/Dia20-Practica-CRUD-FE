const apiUrl = window.env.API_URL_TERTERS;
const apiUsersUrl = window.env.API_URL_USERS;
const apiUserSeederUrl = window.env.API_URL_USERS_SEEDER;
const password = document.querySelector('#password');
const spinner01 = document.getElementById('spinner01');
const spinner02 = document.getElementById('spinner02');
const spinner03 = document.getElementById('spinner03');
const spinner04 = document.getElementById('spinner04');
const spinner05 = document.getElementById('spinner05');
const checkmark01 = document.getElementById('checkmark01');
const checkmark02 = document.getElementById('checkmark02');
const checkmark03 = document.getElementById('checkmark03');
const checkmark04 = document.getElementById('checkmark04');
const exmark02 = document.getElementById('exmark02');
const exmark03 = document.getElementById('exmark03');
const exmark04 = document.getElementById('exmark04');
const testerError = document.getElementById('tester-error');
const passwordError = document.getElementById('password-error');
const usernameError = document.getElementById('username-error');
const usersAvailable = document.querySelector('#users-available');
const info = document.querySelector('#info');
const accountUpdate = document.getElementById('account-update');
const dbUpdate = document.getElementById('db-update');
const fakeDataUpdate = document.getElementById('fake-data-update');
const populate = document.getElementById('populate');
const createWrapper = document.getElementById('wrapper02-2');
const redirect = document.getElementById('all-ready-redirecting');
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
    alert(error.message)
    spinner01.style.display = 'none';
  }
}

checkTestersAvailable();

const submitBtn = document.getElementById('submit-btn');

submitBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  createWrapper.style.display = 'block';

  const form = document.forms[0]
  const table = Date.now();
  const data = {
    username: form.username.value,
    password: form.password.value,
    comment: form.comment.value,
    table
  }
  // crear usuario
  try {
    accountUpdate.style.display = 'block'
    spinner03.style.display = 'block'
    spinner03.scrollIntoView({ behavior: 'smooth' });
    const res = await fetch(apiUrl + '/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const resData = await res.json()
    spinner03.style.display = 'none'
    if (!resData.success) {
      exmark02.style.display = 'block'
      const errorList = document.getElementById('error-list')
      resData.forEach(error => {
        const li = document.createElement('li')
        li.textContent = error
        errorList.appendChild(li)
      })
    } else {
      checkmark02.style.display = 'block'
      // crear base de datos
      spinner04.style.display = 'block'
      spinner04.scrollIntoView({ behavior: 'smooth' });
      const createRes = await fetch(apiUserSeederUrl + '/create-user-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table })
      })
      const createResData = await createRes.json()
      spinner04.style.display = 'none'
      if (!createResData.success) {
        exmark03.style.display = 'block'
        throw new Error('Error:', JSON.stringify(createResData))
      } else {
        // agregar datos ficticios
        checkmark03.style.display = 'block'
        if (populate.checked) {
          spinner05.style.display = 'block'
          const fake = await fetch(apiUserSeederUrl + '/seed-users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table })
          })
          const fakeData = await fake.json()
          spinner05.style.display = 'none'
          spinner05.scrollIntoView({ behavior: 'smooth' });
          if (!fakeData.success) {
            exmark04.style.display = 'block'
            throw new Error('Error:', JSON.stringify(fakeData))
          } else {
            checkmark04.style.display = 'block'
          }
        }
        redirect.style.display = 'block'
        setTimeout(() => {
          localStorage.setItem('username', form.username.value)
          localStorage.setItem('password', form.password.value)
          window.location.href = 'manage-users.html'
        }, 1500);
      }
    }
  } catch (error) {
    alert('error:', error)
  }
})

// 
const checkUsernameAvailable = async () => {
  const username = document.querySelector('#username').value
  const form = document.forms[0]
  try {
    const rawRes = await fetch(apiUrl + '/available/' + username)
    const res = await rawRes.json()
    spinner02.style.display = 'none';
    if (res.success) {
      usernameError.style.display = 'none';
      checkmark01.style.display = 'block';
      usernameAvailable = true
    } else {
      usernameError.style.display = 'block';
      checkmark01.style.display = 'none';
      submitBtn.disabled = true
      usernameAvailable = false
    }
    form.checkValidity() && usernameAvailable ?
      submitBtn.disabled = false : submitBtn.disabled = true
  } catch (error) {
    alert(error.message)
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
      checkmark01.style.display = 'none';
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
