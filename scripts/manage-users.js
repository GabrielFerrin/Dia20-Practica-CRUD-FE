import { loging } from "./helpers.js";

if (!loging()) {
  window.location.href = 'index.html'
} else {
  document.getElementById('user-name').textContent = localStorage.getItem('username')
}

const apiUrl = window.env.API_URL_USERS;
const logoutBtn = document.querySelector('#logout-btn');
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('username');
  localStorage.removeItem('password');
  window.location.href = 'index.html'
})

const renderUsers = (users) => {
  const cardsContainer = document.querySelector('#cards-container');
  // clear cards
  Array(...cardsContainer.children).forEach(element => element.remove());
  users.forEach((user, i) => {
    // card
    const card = document.createElement('div');
    card.classList.add('card');
    // role
    const roleWrapper = document.createElement('div');
    roleWrapper.classList.add('role-wrapper');
    roleWrapper.textContent = user.role;
    card.appendChild(roleWrapper);
    // circle
    const circle = document.createElement('div');
    circle.classList.add('circle');
    card.appendChild(circle);
    // profile pic
    const profilePic = document.createElement('img');
    profilePic.classList.add('profile-pic');
    profilePic.alt = 'Foto de perfil del usuario';
    profilePic.height = '150';
    const username = localStorage.getItem('username');
    const pass = localStorage.getItem('password');
    let pic = `${apiUrl}/picture?user=${username}&pass=${pass}&id=${user.user_id}`;
    profilePic.src = pic;
    circle.appendChild(profilePic);
    // name
    const name = document.createElement('h3');
    name.textContent = user.name;
    card.appendChild(name);
    // email
    const email = document.createElement('p');
    email.textContent = user.email;
    card.appendChild(email);
    // actions
    const actions = document.createElement('div');
    actions.classList.add('buttons-wrapper');
    card.appendChild(actions);
    // edit
    const edit = document.createElement('button');
    edit.classList.add('button2');
    edit.textContent = 'Editar';
    actions.appendChild(edit);
    // delete
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.addEventListener('click', async () => {
      if (confirm(`¿Está seguro que desea eliminar el usuario ${user.name}?`)) {
        const username = localStorage.getItem('username');
        const pass = localStorage.getItem('password');
        const url = apiUrl + '/?user=' + username + '&pass=' +
          pass + '&id=' + user.user_id;
        const rawRes = await fetch(url, {
          method: 'DELETE'
        })
        const res = await rawRes.json()
        if (res.success) getUsers();
        else alert(res.message)
      }
    })
    actions.appendChild(deleteBtn);
    cardsContainer.appendChild(card);
  });
}

const getUsers = async () => {
  try {
    const user = localStorage.getItem('username');
    const pass = localStorage.getItem('password');
    const url = apiUrl + '/?user=' + user + '&pass=' + pass + ''
    const rawRes = await fetch(url);
    const res = await rawRes.json();
    renderUsers(res)
  } catch (error) {
    console.log('Error thrown:', error)
  }
}

getUsers();

// create/update user
const userForm = document.getElementById('users')
const addUserBtn = document.querySelector('#add-user-btn');
addUserBtn.addEventListener('click', () => {
  userForm.style.display = 'flex';
  checkMark.style = 'display: none';
})

// close form
const cancelBtn = document.querySelector('#cancel-btn');
const closeBtn = document.querySelector('#close-icon');
closeBtn.addEventListener('click', () => {
  document.getElementById('user-form').reset();
  userForm.style.display = 'none';
})
cancelBtn.addEventListener('click', () => {
  closeBtn.click();
})

// profile picture
const picPlaceholder = document.getElementById('form-right-side');
picPlaceholder.addEventListener('click', (event) => {
  imageInput.click();
})
const imageElement = document.getElementById('pic-placeholder');
const imageInput = document.getElementById('picture');
imageInput.addEventListener('change', (event) => {
  imageElement.src = URL.createObjectURL(event.target.files[0]);
  imageElement.style = 'border-radius: 50%';
})

/* FORM VALIDATION */

// timeout to check email validity
let emailAvailable = false;
const emailSpinner = document.getElementById('email-spinner');
const form = document.getElementById('user-form');
const submitBtn = document.getElementById('submit-btn');
const spanError = document.getElementById('email-error');
const password = document.getElementById('password');
const checkMark = document.getElementById('checkmark01');
let timoutId;
const checkEmailAvailable = async () => {
  const email = document.getElementById('email').value
  const form = document.forms[0]
  const user = localStorage.getItem('username')
  const pass = localStorage.getItem('password')
  const url = apiUrl + '/check-email/?user=' + user + '&pass=' + pass + '&email=' + email
  try {
    const rawRes = await fetch(url);
    const res = await rawRes.json();
    emailSpinner.style = 'display: none'
    if (res.success) {
      spanError.style = 'display: none'
      emailAvailable = true
      checkMark.style = 'display: block'
    } else {
      spanError.style = 'display: block'
      emailAvailable = false
      submitBtn.disabled = true
      checkMark.style = 'display: none'
    }
    form.checkValidity() && emailAvailable ?
      submitBtn.disabled = false : submitBtn.disabled = true
  } catch (error) {
    console.log(error.message)
  }
}

// check validity
Array(...form.elements).forEach((element) => {
  const avoid = ['submit', 'button', 'select-one'];
  if (!avoid.includes(element.type)) {
    element.addEventListener('input', async (event) => {
      // check email availability
      const form = document.forms[0]
      submitBtn.disabled = true
      if (event.target.id === 'email' && event.target.value.length) {
        spanError.style.display = 'none';
        emailSpinner.style = 'display: block'
        checkMark.style = 'display: none'
        clearTimeout(timoutId);
        timoutId = setTimeout(checkEmailAvailable, 1000);
      } else {
        // check validity
        form.checkValidity() && emailAvailable ?
          submitBtn.disabled = false : submitBtn.disabled = true
      }
      // if (password.value.length < 8) passwordError.style.display = 'block';
      // else passwordError.style.display = 'none';
    })
  }
})

submitBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  // prepare data
  const form = document.forms[0]
  const formData = new FormData();
  formData.append('name', form.elements.name.value);
  formData.append('email', form.elements.email.value);
  formData.append('password', form.elements.password.value);
  formData.append('role', form.elements.role.value);
  formData.append('picture', form.elements.picture.files[0]);
  const user = localStorage.getItem('username')
  const pass = localStorage.getItem('password')
  const url = `${apiUrl}?user=${user}&pass=${pass}`;
  // send
  const rawRes = await fetch(url, {
    method: 'POST',
    body: formData
  });
  const res = await rawRes.json();
  if (res.success) {
    userForm.style.display = 'none';
    form.reset(); // TODO: not working
    form.elements.picture.value = '';
    imageElement.src = './assets/pic-placeholder.svg';
    imageElement.style = 'border-radius: none';
    getUsers();
  }
})