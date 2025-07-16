/**
 * @swagger
 * tags:
 *   name: ReservationsGlobal
 *   description: Gestion globale des réservations (toutes catways confondues)
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservationController');
const { checkJWT } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Récupère toutes les réservations (toutes catways confondues)
 *     tags: [ReservationsGlobal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de toutes les réservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', checkJWT, async (req, res) => {
  try {
    const reservations = await controller.getAllGlobal(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;