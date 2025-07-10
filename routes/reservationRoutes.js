const express = require ('express');
const router = express.Router({ mergeParams: true});

const controller = require ('../controllers/reservationController');

/**
 * @route GET /catways/:id/reservations
 * @description Récupère toutes les réservation d'un catway donné.
 * @access Public
 */
router.get('/', controller.getAll);

/**
 * @route GET /catways/:id/reservations/:idReservation
 * @description Récupère une réservation spécifique par son ID pour un catway donné
 * @access Public
 */
router.get('/:idReservation', controller.getById);

/**
 * @route POST /catways/:id/reservations
 * @description Créer une nouvelle résérvation pour un catway donné
 * @access Public
 */
router.post('/', controller.add);

/**
 * @route PUT /catways/:id/reservations/:idReservation
 * @description Met à jour une réservation spécifique pour un catway donné
 * @access Public
 */
router.put('/:idReservation', controller.update);

/**
 * @route DELETE /catways/:id/reservations/:idReservation
 * @description Supprimer une réservation spécifique pour un catway donné.
 * @access Public
 */
router.delete('/:idReservation', controller.delete);

module.exports = router;