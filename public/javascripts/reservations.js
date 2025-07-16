/**
 * reservations.js
 * Gère les opérations CRUD des réservations côté front.
 */

console.log('reservations.js chargé');

/**
 * Charge et affiche la liste de toutes les réservations.
 */
async function loadAllReservations() {
  try {
    const res = await fetch('/reservations', {
      headers: { Authorization: token }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur lors du chargement des réservations');
    }
    const reservations = await res.json();

    const content = document.getElementById('content');
    content.innerHTML = `
      <h3>Liste de toutes les réservations</h3>
      <button class="btn btn-success mb-3" id="addReservationBtn">Ajouter une réservation</button>
    `;

    if (!reservations.length) {
      content.innerHTML += '<p>Aucune réservation disponible.</p>';
      return;
    }

    const table = document.createElement('table');
    table.className = 'table table-striped';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Catway</th>
        <th>Nom du bateau</th>
        <th>Nom du client</th>
        <th>Date début</th>
        <th>Date fin</th>
        <th>Actions</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    reservations.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.catwayNumber}</td>
        <td>${r.boatName}</td>
        <td>${r.clientName}</td>
        <td>${new Date(r.startDate).toLocaleDateString()}</td>
        <td>${new Date(r.endDate).toLocaleDateString()}</td>
        <td>
          <button class="btn btn-primary btn-sm me-2 btn-edit" data-id="${r._id}">Modifier</button>
          <button class="btn btn-danger btn-sm btn-delete" data-id="${r._id}">Supprimer</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    content.appendChild(table);

    // Actions des boutons Modifier/Supprimer
    tbody.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const reservation = reservations.find(r => r._id === id);
        showReservationForm(reservation.catwayNumber, reservation);
      });
    });
    tbody.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const reservation = reservations.find(r => r._id === id);
        deleteReservation(reservation.catwayNumber, id);
      });
    });

    document.getElementById('addReservationBtn').onclick = () => showReservationForm();

  } catch (error) {
    alert(error.message);
  }
}

/**
 * Affiche le formulaire pour ajouter ou modifier une réservation.
 * Permet de choisir le catway pour une nouvelle réservation.
 * @param {number|null} catwayNumber - Numéro du catway (null si nouveau)
 * @param {Object|null} reservation - Données de réservation pour modification
 */
async function showReservationForm(catwayNumber = null, reservation = null) {
  const isEdit = reservation !== null;
  const content = document.getElementById('content');

  // Récupérer tous les catways pour la liste déroulante
    
  let catways = [];
  let filteredCatways = [];
  try {
    const resCatways = await fetch('/catways', { headers: { Authorization: token } });
    if (resCatways.ok) {
      catways = await resCatways.json();
      filteredCatways = catways.filter(c => c.status === 'Libre');
      filteredCatways.sort((a,b) => b.catwayNumber - a.catwayNumber);
    }
  } catch {
  //si il y a une erreur ma liste reste vide
  }

  content.innerHTML = `
    <h3>${isEdit ? 'Modifier' : 'Ajouter'} une réservation</h3>
    <form id="reservationForm" class="mb-3">
      <div class="mb-3">
        <label for="catwayNumber" class="form-label">Catway</label>
        <select id="catwayNumber" class="form-select" ${isEdit ? 'disabled' : ''} required>
          <option value="">Sélectionner un catway</option>
          ${filteredCatways.map(c => `
            <option value="${c.catwayNumber}" ${((catwayNumber ?? (reservation ? reservation.catwayNumber : null)) == c.catwayNumber) ? 'selected' : ''}>
              ${c.catwayNumber} (${c.catwayType})
            </option>`).join('')}
        </select>
      </div>
      <div class="mb-3">
        <label for="boatName" class="form-label">Nom du bateau</label>
        <input type="text" id="boatName" class="form-control" value="${isEdit ? reservation.boatName : ''}" required />
      </div>
      <div class="mb-3">
        <label for="clientName" class="form-label">Nom du client</label>
        <input type="text" id="clientName" class="form-control" value="${isEdit ? reservation.clientName : ''}" required />
      </div>
      <div class="mb-3">
        <label for="startDate" class="form-label">Date début</label>
        <input type="date" id="startDate" class="form-control" value="${isEdit ? reservation.startDate.split('T')[0] : ''}" required />
      </div>
      <div class="mb-3">
        <label for="endDate" class="form-label">Date fin</label>
        <input type="date" id="endDate" class="form-control" value="${isEdit ? reservation.endDate.split('T')[0] : ''}" required />
      </div>
      <button type="submit" class="btn btn-primary">${isEdit ? 'Modifier' : 'Ajouter'}</button>
      <button type="button" id="cancelBtn" class="btn btn-secondary ms-2">Annuler</button>
    </form>
  `;

  document.getElementById('reservationForm').addEventListener('submit', async e => {
    e.preventDefault();

    const selectedCatwayNumber = document.getElementById('catwayNumber').value;
    const boatName = document.getElementById('boatName').value.trim();
    const clientName = document.getElementById('clientName').value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!selectedCatwayNumber || !boatName || !clientName || !startDate || !endDate) {
      alert('Merci de remplir tous les champs.');
      return;
    }

    const url = isEdit
      ? `/catways/${selectedCatwayNumber}/reservations/${reservation._id}`
      : `/catways/${selectedCatwayNumber}/reservations`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({ boatName, clientName, startDate, endDate })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur serveur');
      }
      alert(`Réservation ${isEdit ? 'modifiée' : 'ajoutée'} avec succès !`);
      loadAllReservations();
    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById('cancelBtn').onclick = () => loadAllReservations();
}

/**
 * Supprime une réservation après confirmation.
 * @param {number} catwayNumber
 * @param {string} reservationId
 */
async function deleteReservation(catwayNumber, reservationId) {
  if (!confirm('Voulez-vous vraiment supprimer cette réservation ?')) return;

  try {
    const res = await fetch(`/catways/${catwayNumber}/reservations/${reservationId}`, {
      method: 'DELETE',
      headers: { Authorization: token }
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Erreur lors de la suppression');
    }
    alert('Réservation supprimée avec succès !');
    loadAllReservations();
  } catch (err) {
    alert(err.message);
  }
}