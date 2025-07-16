/**
 * @function loadUsers
 * @description Charge et affiche tous les utilisateurs depuis l'API
 */
async function loadUsers() {
  try {
    const res = await fetch('/users', { headers: { Authorization: token } });
    if (!res.ok) throw new Error('Erreur lors du chargement des utilisateurs');
    const users = await res.json();

    const content = document.getElementById('content');
    content.innerHTML = `
      <h3>Utilisateurs</h3>
      <button class="btn btn-success mb-3" id="addUserBtn">Ajouter un utilisateur</button>
    `;

    users.forEach(user => {
      const card = document.createElement('div');
      card.className = 'card mb-2';
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${user.username || '(sans nom)'}</h5>
          <p class="card-text"><strong>Email:</strong> ${user.email}</p>
          <button class="btn btn-primary btn-sm me-2 btn-edit" data-email="${user.email}">Modifier</button>
          <button class="btn btn-danger btn-sm btn-delete" data-email="${user.email}">Supprimer</button>
        </div>
      `;
      content.appendChild(card);

      // Boutons
      card.querySelector('.btn-edit').addEventListener('click', () => showUserForm(user.email));
      card.querySelector('.btn-delete').addEventListener('click', () => deleteUser(user.email));
    });

    // Bouton pour ajouter
    document.getElementById('addUserBtn').addEventListener('click', () => showUserForm());
  } catch (error) {
    alert(error.message);
  }
}

/**
 * @function showUserForm
 * @description Affiche le formulaire pour ajouter ou modifier un utilisateur
 * @param {string} [email] Email de l'utilisateur à modifier, ou vide pour ajout
 */
async function showUserForm(email) {
  let user = { username: '', email: '' };

  if (email) {
    try {
      const res = await fetch(`/users/${encodeURIComponent(email)}`, { headers: { Authorization: token } });
      if (!res.ok) throw new Error('Utilisateur non trouvé');
      user = await res.json();
    } catch (error) {
      alert(error.message);
      return;
    }
  }

  const content = document.getElementById('content');
  content.innerHTML = `
    <h3>${email ? 'Modifier' : 'Ajouter'} un utilisateur</h3>
    <form id="userForm">
      <div class="mb-3">
        <label for="username" class="form-label">Nom d'utilisateur</label>
        <input type="text" id="username" class="form-control" value="${user.username || ''}" />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" class="form-control" value="${user.email || ''}" />
      </div>
      ${!email ? `
      <div class="mb-3">
        <label for="password" class="form-label">Mot de passe</label>
        <input type="password" id="password" class="form-control" />
      </div>` : ''}
      <button type="submit" class="btn btn-primary">${email ? 'Modifier' : 'Ajouter'}</button>
      <button type="button" id="cancelBtn" class="btn btn-secondary ms-2">Annuler</button>
    </form>
  `;

  // Soumission du formulaire
  document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const newEmail = document.getElementById('email').value.trim();
    const password = !email ? document.getElementById('password').value.trim() : null;

    try {
      if (email) {
        // Modification
        const resUpdate = await fetch(`/users/${encodeURIComponent(email)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: token },
          body: JSON.stringify({ username, email: newEmail })
        });
        if (!resUpdate.ok) throw new Error('Erreur lors de la modification');
        alert('Utilisateur modifié avec succès !');
      } else {
        // Ajout
        const resAdd = await fetch('/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: token },
          body: JSON.stringify({ username, email: newEmail, password })
        });
        if (!resAdd.ok) throw new Error('Erreur lors de la création');
        alert('Utilisateur ajouté avec succès !');
      }
      loadUsers();
    } catch (error) {
      alert(error.message);
    }
  });

  // Bouton Annuler
  document.getElementById('cancelBtn').addEventListener('click', loadUsers);
}

/**
 * @function deleteUser
 * @description Supprime un utilisateur après confirmation
 * @param {string} email Email de l'utilisateur à supprimer
 */
async function deleteUser(email) {
  if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
  try {
    const res = await fetch(`/users/${encodeURIComponent(email)}`, {
      method: 'DELETE',
      headers: { Authorization: token }
    });
    if (!res.ok) throw new Error('Erreur lors de la suppression');
    alert('Utilisateur supprimé avec succès !');
    loadUsers();
  } catch (error) {
    alert(error.message);
  }
}

// Au chargement de la page
loadUsers();