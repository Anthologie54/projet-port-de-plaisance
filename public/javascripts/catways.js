/**
 * catways.js
 * Gère l'affichage, la création, modification et suppression des catways côté front.
 */
// La variable token est globale (récupérée dans dashboard.js ou ailleurs)

async function loadCatways() {
  try {
    const res = await fetch('/catways', {
      headers: { Authorization: token }
    });
    if (!res.ok) throw new Error('Erreur lors du chargement des catways');
    const catways = await res.json();

    const content = document.getElementById('content');
    content.innerHTML = '';

    // Bouton pour ajouter un nouveau catway
    const addBtn = document.createElement('button');
    addBtn.textContent = ' Ajouter un catway';
    addBtn.className = 'btn btn-success mb-3';
    addBtn.onclick = () => showCatwayForm();
    content.appendChild(addBtn);

    if (catways.length === 0) {
      content.innerHTML += '<p>Aucun catway disponible.</p>';
      return;
    }

    catways.forEach(catway => {
      const card = document.createElement('div');
      card.className = 'card mb-3';
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">Catway ${catway.catwayNumber} (${catway.catwayType})</h5>
          <p class="card-text"><strong>État :</strong> ${catway.catwayState}</p>
          <p class="card-text"><strong>Statut :</strong> ${catway.status || 'Libre'}</p>
          <button class="btn btn-primary btn-sm me-2" onclick='showCatwayForm(${JSON.stringify(catway)})'>Modifier</button>
          <button class="btn btn-danger btn-sm me-2" onclick='deleteCatway(${catway.catwayNumber})'>Supprimer</button>
          <button class="btn btn-secondary btn-sm" onclick='loadAllReservations(${catway.catwayNumber})'>Voir réservations</button>
        </div>
      `;
      content.appendChild(card);
    });
  } catch (error) {
    alert(error.message);
  }
}

/**
 * Affiche formulaire ajout/modification catway.
 * @param {Object|null} catway 
 */
function showCatwayForm(catway = null) {
  const content = document.getElementById('content');
  const isEdit = catway !== null;

  const formHtml = `
    <h3>${isEdit ? 'Modifier' : 'Ajouter'} un catway</h3>
    <form id="catwayForm" class="mb-3">
      <div class="mb-3">
        <label for="catwayNumber" class="form-label">Numéro du catway</label>
        <input type="number" id="catwayNumber" class="form-control" value="${isEdit ? catway.catwayNumber : ''}" ${isEdit ? 'readonly' : ''} required />
      </div>
      <div class="mb-3">
        <label for="catwayType" class="form-label">Type</label>
        <select id="catwayType" class="form-select" ${isEdit ? 'disabled' : ''} required>
          <option value="">Sélectionner</option>
          <option value="long">Long</option>
          <option value="short">Court</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="catwayState" class="form-label">État</label>
        <input type="text" id="catwayState" class="form-control" value="${isEdit ? catway.catwayState : ''}" required />
      </div>
      <button type="submit" class="btn btn-primary">${isEdit ? 'Modifier' : 'Ajouter'}</button>
      <button type="button" class="btn btn-secondary ms-2" id="cancelBtn">Annuler</button>
    </form>
  `;

  content.innerHTML = formHtml;

  if (isEdit) {
    document.getElementById('catwayType').value = catway.catwayType;
  }

  document.getElementById('catwayForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const catwayNumber = Number(document.getElementById('catwayNumber').value);
    const catwayType = document.getElementById('catwayType').value;
    const catwayState = document.getElementById('catwayState').value.trim();

    if (!catwayNumber || !catwayType || !catwayState) {
      alert('Merci de remplir tous les champs.');
      return;
    }

    try {
      const url = isEdit ? `/catways/${catwayNumber}` : '/catways';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({ catwayNumber, catwayType, catwayState })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erreur serveur');
      }

      alert(`Catway ${isEdit ? 'modifié' : 'ajouté'} avec succès !`);
      loadCatways();

    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById('cancelBtn').addEventListener('click', () => {
    loadCatways();
  });
}

/**
 * Supprime un catway après confirmation.
 * @param {number} catwayNumber 
 */
async function deleteCatway(catwayNumber) {
  if (!confirm(`Voulez-vous vraiment supprimer le catway ${catwayNumber} ?`)) return;

  try {
    const res = await fetch(`/catways/${catwayNumber}`, {
      method: 'DELETE',
      headers: { Authorization: token }
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Erreur lors de la suppression');
    }

    alert('Catway supprimé avec succès !');
    loadCatways();

  } catch (err) {
    alert(err.message);
  }
}