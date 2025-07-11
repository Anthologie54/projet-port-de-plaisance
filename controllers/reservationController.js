const Reservation = require('../models/Reservation');

/**
 * Récupère toutes les réservations d'un catway.
 */
exports.getAll = async (req, res, next) => {
  const catwayID = req.params.id;
  try {
    const reservations = await Reservation.find({ catwayNumber: Number(catwayID) });
    return res.status(200).json(reservations);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Récupère une réservation spécifique par ID.
 */
exports.getById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.idReservation,
      catwayNumber: Number(req.params.id)
    });

    if (!reservation) {
      return res.status(404).json({ error: 'reservation_not_found' });
    }
    return res.status(200).json(reservation);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Crée une nouvelle réservation (avec contrôle de date).
 */
exports.add = async (req, res, next) => {
  const catwayID = req.params.id;
  const temp = {
    catwayNumber: Number(catwayID),
    clientName: req.body.clientName,
    boatName: req.body.boatName,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  };

  if (new Date(temp.startDate) >= new Date(temp.endDate)) {
    return res.status(400).json({ error: 'invalid_dates' });
  }

  try {
    const reservation = await Reservation.create(temp);
    return res.status(201).json(reservation);
  } catch (error) {
    return res.status(500).json(error);
  }
};

/**
 * Met à jour une réservation spécifique.
 */
exports.update = async (req, res, next) => {
  try {
    let reservation = await Reservation.findOne({
      _id: req.params.idReservation,
      catwayNumber: Number(req.params.id)
    });

    if (!reservation) return res.status(404).json({ error: 'reservation_not_found' });

    ['clientName', 'boatName', 'startDate', 'endDate'].forEach(field => {
      if (req.body[field] !== undefined) {
        reservation[field] = req.body[field];
      }
    });

    await reservation.save();
    return res.status(200).json(reservation);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Supprime une réservation spécifique.
 */
exports.delete = async (req, res, next) => {
  try {
    const result = await Reservation.deleteOne({
      _id: req.params.idReservation,
      catwayNumber: Number(req.params.id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'reservation_not_found' });
    }
    return res.status(200).json({ message: 'delete_ok' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
