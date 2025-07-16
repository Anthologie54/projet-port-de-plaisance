const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

/**
 * @function getAll
 * @description
 * Récupère toutes les réservations associées à un catway donné, identifié par son numéro.
 * Renvoie une liste des réservations si le catway existe.
 * 
 * @async
 * @route GET /catway/:id/reservations/
 * @param {import('express').Request} req - Requête HTTP (req.params.id = numéro du catway).
 * @param {import('express').Response} res - Réponse HTTP.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * 
 * @returns {Promise<void>} En cas de succès, code 200 avec tableau des réservations.
 * En cas d'erreur ou si catway introuvable, code 404 ou 500 avec message d'erreur.
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
 * @function getAllGlobal
 * @description
 * Récupère toutes les réservations, tous catways confondus.
 * 
 * @async
 * @route GET /reservations
 * @param {import('express').Request} req - Requête HTTP.
 * @param {import('express').Response} res - Réponse HTTP.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * 
 * @returns {Promise<void>} En cas de succès, code 200 avec tableau de toutes les réservations.
 * En cas d'erreur, code 500 avec message d'erreur.
 */
exports.getAllGlobal = async (req, res, next) => {
  try {
    const reservations = await Reservation.find();
    return res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * @function getById
 * @description
 * Récupère une réservation spécifique par son ID et le numéro de catway associé.
 * Renvoie la réservation si trouvée.
 *
 * @async
 * @route GET /catways/:id/reservations/:idReservation
 * @param {import('express').Request} req - Requête HTTP (req.params.id = numéro du catway, req.params.idReservation = ID réservation).
 * @param {import('express').Response} res - Réponse HTTP.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * 
 * @returns {Promise<void>} En cas de succès, code 200 avec la réservation.
 * En cas d'erreur ou introuvable, code 404 ou 500 avec message d'erreur.
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
 * @function add
 * @description
 * Crée une nouvelle réservation pour un catway donné.
 * Les données de la réservation sont extraites du corps de la requête.
 * 
 * @async
 * @route POST /catways/:id/reservations/:idreservation
 * @param {import('express').Request} req - Requête HTTP (req.params.id = numéro du catway, données réservation dans req.body).
 * @param {import('express').Response} res - Réponse HTTP.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * 
 * @returns {Promise<void>} En cas de succès, code 201 avec la réservation créée.
 * En cas d'erreur ou catway introuvable, code 404 ou 500 avec message d'erreur.
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
        return res.status(500).json({error: error.message });
    }
};

/**
 * @function update
 * @description
 * Met à jour une réservation spécifique d’un catway donné.
 * Seuls les champs clientName, boatName, startDate et endDate peuvent être mis à jour.
 * 
 * @async
 * @route PUT /catways/:id/reservations/:idReservation
 * @param {import('express').Request} req - Requête HTTP (req.params.id = numéro du catway, req.params.idReservation = ID réservation, champs à modifier dans req.body).
 * @param {import('express').Response} res - Réponse HTTP.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * 
 * @returns {Promise<void>} En cas de succès, code 200 avec la réservation mise à jour.
 * En cas d'erreur ou introuvable, code 404 ou 500 avec message d'erreur.
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
 * @function delete
 * @description
 * Supprime une réservation spécifique d’un catway donné.
 * Renvoie un message de confirmation si suppression réussie.
 * 
 * @async
 * @route DELETE /catways/:id/reservations/:idReservation
 * @param {import('express').Request} req - Requête HTTP (req.params.id = numéro du catway, req.params.idReservation = ID réservation).
 * @param {import('express').Response} res - Réponse HTTP.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * 
 * @returns {Promise<void>} En cas de succès, code 200 avec message « delete_ok ».
 * En cas d'erreur ou introuvable, code 404 ou 500 avec message d'erreur.
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