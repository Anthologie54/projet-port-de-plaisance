async function loadUsers(token) {
  try {
    const res = await fetch('/users', { headers: { Authorization: token } });
    if (!res.ok) throw new Error('Erreur lors du chargement des utilisateurs');
    const users = await res.json();

    const content = document.getElementById('content');

    if (users.length === 0) {
      content.innerHTML = '<p>Aucun utilisateur trouvé.</p>';
      return;
    }

    content.innerHTML = '';
    users.forEach(user => {
      const card = document.createElement('div');
      card.className = 'card mb-3';
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${user.username || user.email}</h5>
          <p class="card-text"><strong>Email :</strong> ${user.email}</p>
        </div>
      `;
      content.appendChild(card);
    });
  } catch (error) {
    alert(error.message);
  }
}