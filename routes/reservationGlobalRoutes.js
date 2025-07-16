const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const { checkJWT } = require('../middlewares/authMiddleware');

/**
 * Route GET /reservations
 * Renvoie toutes les réservations, sans filtre.
 */
router.get('/', checkJWT, async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;