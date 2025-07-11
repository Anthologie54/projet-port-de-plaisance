const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/reservationController');
const { checkJWT } = require('../middlewares/authMiddleware');

/**
 * @route GET /catways/:id/reservations
 * @description Récupère toutes les réservations d'un catway
 * @access Public
 */
router.get('/', controller.getAll);

/**
 * @route GET /catways/:id/reservations/:idReservation
 * @description Récupère une réservation spécifique
 * @access Public
 */
router.get('/:idReservation', controller.getById);

/**
 * @route POST /catways/:id/reservations
 * @description Crée une réservation
 * @access Protégée
 */
router.post('/', checkJWT, controller.add);

/**
 * @route PUT /catways/:id/reservations/:idReservation
 * @description Met à jour une réservation
 * @access Protégée
 */
router.put('/:idReservation', checkJWT, controller.update);

/**
 * @route DELETE /catways/:id/reservations/:idReservation
 * @description Supprime une réservation
 * @access Protégée
 */
router.delete('/:idReservation', checkJWT, controller.delete);

module.exports = router;