'use strict'

function login() {
  const u = document.getElementById("admin-username").value;
  const p = document.getElementById("admin-password").value;
  const dbUsuario = readUsuario();

  var adm = JSON.stringify('Administrador');
  var user = JSON.stringify(u);
  var passw = JSON.stringify(p);
  var tipo, email, cpf;
  for (var i = 0; i < dbUsuario.length; i++) {
    tipo = JSON.stringify(dbUsuario[i].tipo);
    if (tipo === adm) {
      email = JSON.stringify(dbUsuario[i].email);
      cpf = JSON.stringify(dbUsuario[i].cpf);
      if (email === user && cpf === passw) {
        window.location = "cadastro.html";
      }
    }
  }
};

const openModal = () => document.getElementById('modal').classList.add('active');

const closeModal = () => {
  clearFields();
  document.getElementById('modal').classList.remove('active');
};

const readUsuario = () => JSON.parse(localStorage.getItem('db_usuario')) ?? [];
const setLocalStorage = (dbUsuario) => localStorage.setItem("db_usuario", JSON.stringify(dbUsuario));

const deleteUsuario = (index) => {
  const dbUsuario = readUsuario();
  dbUsuario.splice(index, 1);
  setLocalStorage(dbUsuario);
};

const updateUsuario = (index, usuario) => {
  const dbUsuario = readUsuario();
  dbUsuario[index] = usuario;
  setLocalStorage(dbUsuario);
};

const createUsuario = (usuario) => {
  const dbUsuario = readUsuario();
  dbUsuario.push(usuario);
  setLocalStorage(dbUsuario);
};

const isValidFields = () => {
  return document.getElementById('form').reportValidity();
}

const clearFields = () => {
  const fields = document.querySelectorAll('.modal-field');
  fields.forEach(field => field.value = "");
  document.getElementById('nome').dataset.index = 'new';
  document.querySelector(".modal-header>h2").textContent = 'Novo usuario/administrador';
};

const saveUsuario = () => {
  if (isValidFields()) {
    const usuario = {
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      cpf: document.getElementById('cpf').value,
      telefone: document.getElementById('telefone').value,
      tipo: document.getElementById('tipo').value
    }
    const index = document.getElementById('nome').dataset.index;
    if (index == 'new') {
      createUsuario(usuario);
      updateTable();
      closeModal();
    } else {
      updateUsuario(index, usuario);
      updateTable();
      closeModal();
    }
  }
};

const createRow = (usuario, index) => {
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
        <td>${usuario.nome}</td>
        <td>${usuario.email}</td>
        <td>${usuario.cpf}</td>
        <td>${usuario.telefone}</td>
        <td>${usuario.tipo}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `;
  document.querySelector('#table-usuario>tbody').appendChild(newRow);
}

const clearTable = () => {
  const rows = document.querySelectorAll('#table-usuario>tbody tr');
  rows.forEach(row => row.parentNode.removeChild(row));
};

const updateTable = () => {
  const dbUsuario = readUsuario();
  clearTable();
  dbUsuario.forEach(createRow);
};

const fillFields = (usuario) => {
  document.getElementById('nome').value = usuario.nome;
  document.getElementById('email').value = usuario.email;
  document.getElementById('cpf').value = usuario.cpf;
  document.getElementById('telefone').value = usuario.telefone;
  document.getElementById('tipo').value = usuario.tipo;
  document.getElementById('nome').dataset.index = usuario.index;
};

const editUsuario = (index) => {
  const usuario = readUsuario()[index];
  usuario.index = index;
  fillFields(usuario);
  document.querySelector(".modal-header>h2").textContent = `Editando ${usuario.nome}`;
  openModal();
};

const editDelete = (event) => {
  if (event.target.type == 'button') {

    const [action, index] = event.target.id.split('-');

    if (action == 'edit') {
      editUsuario(index);
    } else {
      const usuario = readUsuario()[index];
      const response = confirm(`Deseja realmente excluir o usuario/administrador ${usuario.nome}`);
      if (response) {
        deleteUsuario(index);
        updateTable();
      }
    }
  }
};

updateTable();

document.getElementById('cadastrarUsuario').addEventListener('click', openModal);
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('salvar').addEventListener('click', saveUsuario);
document.querySelector('#table-usuario>tbody').addEventListener('click', editDelete);
document.getElementById('cancelar').addEventListener('click', closeModal);