const token = localStorage.getItem('token');

function setupEventListeners() {
  document.getElementById('btnCatways').addEventListener('click', () => {
    loadCatways(token);
  });
  document.getElementById('btnReservations').addEventListener('click', () => {
    loadAllReservations();
  });
  document.getElementById('btnUsers').addEventListener('click', () => {
    loadUsers();
  });
  document.getElementById('btnLogout').addEventListener('click', () => {
    logout();
  });
}
// Décoder un JWT
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

// Récupérer et afficher le nom et l'email
const payload = parseJwt(token);
if (payload) {
  document.getElementById('username').textContent = payload.username || '';
  document.getElementById('userEmail').textContent = payload.email || '';
}

// Appelle setupEventListeners après chargement complet du DOM
window.addEventListener('DOMContentLoaded', setupEventListeners);

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}

document.getElementById('currentDate').textContent = new Date().toLocaleDateString();

async function loadDashboardReservations() {
  try {
    const res = await fetch('/reservations', {
      headers: { Authorization: token }
    });
    if (!res.ok) throw new Error('Erreur lors du chargement des réservations');
    const allReservations = await res.json();

    // Filtrer les réservations en cours (date de fin >= aujourd'hui)
    const today = new Date();
    const reservationsEnCours = allReservations.filter(r => new Date(r.endDate) >= today);

    const tbody = document.getElementById('dashboardReservationsTbody');
    tbody.innerHTML = '';

    if (!reservationsEnCours.length) {
      tbody.innerHTML = '<tr><td colspan="5">Aucune réservation en cours.</td></tr>';
      return;
    }

    reservationsEnCours.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.catwayNumber}</td>
        <td>${r.boatName}</td>
        <td>${r.clientName}</td>
        <td>${new Date(r.startDate).toLocaleDateString()}</td>
        <td>${new Date(r.endDate).toLocaleDateString()}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    alert(err.message);
  }
}

// Appel au chargement de la page
loadDashboardReservations();