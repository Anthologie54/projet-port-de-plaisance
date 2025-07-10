const express = require ('express');
const router = express.Router()
const controller = require ('../controllers/reservationController');

/**
 * @route GET /catways/:id/reservations
 * @description Récupère toutes les réservation d'un catway donné.
 * @access Public
 */
router.get('/catways/:id/reservations', controller.getAll);

/**
 * @route GET /catways/:id/reservations/:idReservation
 * @description Récupère une réservation spécifique par son ID pour un catway donné
 * @access Public
 */
router.get('/catways/:id/reservations/:idReservation', controller.getById);

/**
 * @route POST /catways/:id/reservations
 * @description Créer une nouvelle résérvation pour un catway donné
 * @access Public
 */
router.post('/catways/:id/reservations', controller.add);

/**
 * @route PUT /catways/:id/reservations/:idReservation
 * @description Met à jour une réservation spécifique pour un catway donné
 * @access Public
 */
router.put('/catways/:id/reservations/:idReservation', controller.update);

/**
 * @route DELETE /catways/:id/reservations/:idReservation
 * @description Supprimer une réservation spécifique pour un catway donné.
 * @access Public
 */
router.delete('/catways/:id/reservations/:idReservation', controller.delete);

module.exports = router;