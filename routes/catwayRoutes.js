const express = require('express');
const router = express.Router();
const controller = require('../controllers/catwayController');
const reservationRoutes = require('./reservationRoutes');
const { checkJWT } = require('../middlewares/authMiddleware');

/**
 * @route GET /catways
 * @description Récupère tous les catways
 * @access Public
 */
router.get('/', controller.getAll);

/**
 * @route GET /catways/:id
 * @description Récupère un catway par son ID
 * @access Public
 */
router.get('/:id', controller.getById);

/**
 * @route POST /catways
 * @description Crée un catway
 * @access Protégée
 */
router.post('/', checkJWT, controller.add);

/**
 * @route PUT /catways/:id
 * @description Met à jour l'état d'un catway
 * @access Protégée
 */
router.put('/:id', checkJWT, controller.update);

/**
 * @route DELETE /catways/:id
 * @description Supprime un catway
 * @access Protégée
 */
router.delete('/:id', checkJWT, controller.delete);

// Sous-routes pour les réservations liées à un catway
router.use('/:id/reservations', reservationRoutes);

module.exports = router;