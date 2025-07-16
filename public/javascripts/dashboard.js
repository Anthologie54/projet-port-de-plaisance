console.log('dashboard chargé');
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

// Appelle setupEventListeners après chargement complet du DOM
window.addEventListener('DOMContentLoaded', setupEventListeners);

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}