/**
 * @file catwayRoutes.js
 * @description Routes liées aux catways et sous-routes de réservation.
 */

const express = require('express');
const router = express.Router();

const controller = require('../controllers/catwayController');
const reservationRoutes = require('./reservationRoutes');

/**
 * @route GET /catways
 * @description Récupère la liste de tous les catways.
 * @access Public
 */
router.get('/', controller.getAll);

/**
 * @route GET /catways/:id
 * @description Récupère un catway par son ID.
 * @access Public
 */
router.get('/:id', controller.getById);

/**
 * @route POST /catways
 * @description Crée un nouveau catway.
 * @access Public
 */
router.post('/', controller.add);

/**
 * @route PUT /catways/:id
 * @description Met à jour un catway (seul l'état est modifiable).
 * @access Public
 */
router.put('/:id', controller.update);

/**
 * @route DELETE /catways/:id
 * @description Supprime un catway par son ID.
 * @access Public
 */
router.delete('/:id', controller.delete);

/**
 * Sous-routes pour les réservations associées à un catway.
 * Ex: /catways/:id/reservations
 */
router.use('/:id/reservations', reservationRoutes);

module.exports = router;