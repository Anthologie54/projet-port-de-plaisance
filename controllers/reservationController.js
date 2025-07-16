const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

/**
 * Récupère toutes les réservations d'un catway donné.
 */
exports.getAll = async (req, res, next) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: Number(req.params.id) });
        if (!catway) {
            return res.status(404).json({ error: 'catway_not_found' });
        }
        const reservations = await Reservation.find({ catwayNumber: catway.catwayNumber });
        return res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Récupère une réservation spécifique par son ID et catway.
 */
exports.getById = async (req, res, next) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: Number(req.params.id) });
        if (!catway) {
            return res.status(404).json({ error: 'catway_not_found' });
        }
        const reservation = await Reservation.findOne({
            _id: req.params.idReservation,
            catwayNumber: catway.catwayNumber
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
 * Crée une nouvelle réservation pour un catway donné.
 */
exports.add = async (req, res, next) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: Number(req.params.id) });
        if (!catway) {
            return res.status(404).json({ error: 'catway_not_found' });
        }
        const temp = {
            catwayNumber: catway.catwayNumber,
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        };
        const reservation = await Reservation.create(temp);
        return res.status(201).json(reservation);
    } catch (error) {
        return res.status(500).json(error);
    }
};

/**
 * Met à jour une réservation spécifique pour un catway donné.
 */
exports.update = async (req, res, next) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: Number(req.params.id) });
        if (!catway) {
            return res.status(404).json({ error: 'catway_not_found' });
        }
        let reservation = await Reservation.findOne({
            _id: req.params.idReservation,
            catwayNumber: catway.catwayNumber
        });
        if (!reservation) {
            return res.status(404).json({ error: 'reservation_not_found' });
        }
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
 * Supprime une réservation spécifique pour un catway donné.
 */
exports.delete = async (req, res, next) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: Number(req.params.id) });
        if (!catway) {
            return res.status(404).json({ error: 'catway_not_found' });
        }
        const result = await Reservation.deleteOne({
            _id: req.params.idReservation,
            catwayNumber: catway.catwayNumber
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'reservation_not_found' });
        }
        return res.status(200).json({ message: 'delete_ok' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};