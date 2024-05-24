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
    let pic = '';
    if ((i + 1) % 1 === 0) pic = './assets/profile-pic-04.jpg';
    if ((i + 1) % 2 === 0) pic = './assets/profile-pic-03.jpg';
    if ((i + 1) % 3 === 0) pic = './assets/profile-pic-02.jpg';
    if ((i + 1) % 4 === 0) pic = './assets/profile-pic-01.jpg';
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
    actions.appendChild(deleteBtn);
    cardsContainer.appendChild(card);
  });
}

const getUsers = async() => {
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