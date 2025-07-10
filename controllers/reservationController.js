const Reservation = require ('../models/Reservation')


/**
 * Récupère toutes les réservations d'un catway donné.
 * 
 * @param {Object} req - Objet requête Express.
 * @param {string} req.params.id - ID du catway.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * 
 * @returns {JSON} Liste des réservations ou erreur 500.
 */
exports.getAll = async (req, res, next) =>{
    const catwayID = req.params.id;

    try {
        console.log("catwayID reçu :", catwayID);
        const reservations = await Reservation.find({ catwayNumber: Number(catwayID) });
        console.log("Toutes les réservations:", reservations);
        return res.status(200).json(reservations);
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: error.message});
    }
};

/**
 * Récupère une réservation spécifique par son ID et catway.
 * 
 * @param {Object} req - Objet requête Express.
 * @param {string} req.params.id - ID du catway.
 * @param {string} req.params.idReservation - ID de la réservation.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * 
 * @returns {JSON} Réservation trouvée ou erreur 404/500.
 */
exports.getById = async (req, res, next) => {
    const catwayID      = req.params.id;
    const reservationID = req.params.idReservation

    try {
        const reservation = await Reservation.findOne({
            _id: reservationID,
            catwayNumber: catwayID
        });

        if(!reservation) {
            return res.status(404).json({ error: 'reservation_not_found'});
        }
            return res.status(200).json(reservation);
        } catch (error) {
            return res.status(500).json({ error: error.message});
        }
 };

/**
 * Crée une nouvelle réservation pour un catway donné.
 * 
 * @param {Object} req - Objet requête Express.
 * @param {string} req.params.id - ID du catway.
 * @param {Object} req.body - Données de la réservation.
 * @param {string} req.body.clientName - Nom du client.
 * @param {string} req.body.boatName - Nom du bateau.
 * @param {string} req.body.startDate - Date de début (ISO).
 * @param {string} req.body.endDate - Date de fin (ISO).
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * 
 * @returns {JSON} Réservation créée ou erreur 500.
 */
 exports.add = async (req, res, next) =>{
    const catwayID = req.params.id;

    const temp = { 
        catwayNumber : Number(catwayID),
        clientName   : req.body.clientName,
        boatName     : req.body.boatName,
        startDate    : req.body.startDate,
        endDate      : req.body.endDate
    }
    try {
        const reservation = await Reservation.create(temp);
        return res.status(201).json(reservation);
    } catch (error) {
        return res.status(500).json (error);
    }
    
 };
/**
 * Met à jour une réservation spécifique pour un catway donné.
 * 
 * @param {Object} req - Objet requête Express.
 * @param {string} req.params.id - ID du catway.
 * @param {string} req.params.idReservation - ID de la réservation.
 * @param {Object} req.body - Données à mettre à jour (clientName, boatName, startDate, endDate).
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * 
 * @returns {JSON} Réservation mise à jour ou erreur 404/500.
 */
exports.update = async (req, res, next) => {
    const catwayID      = req.params.id;
    const reservationID = req.params.idReservation;

    try {
        let reservation = await Reservation.findOne({
            _id: reservationID,
            catwayNumber: catwayID
        });

        if(!reservation) {
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
        return res.status(500).json ({ error: error.message });
    }
};
/**
 * Supprime une réservation spécifique pour un catway donné.
 * 
 * @param {Object} req - Objet requête Express.
 * @param {string} req.params.id - ID du catway.
 * @param {string} req.params.idReservation - ID de la réservation.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * 
 * @returns {JSON} Message de succès ou erreur 404/500.
 */

exports.delete = async (req, res, next) => {
    const catwayID      = req.params.id;
    const reservationID = req.params.idReservation;

    try{
        const result = await Reservation.deleteOne({
            _id: reservationID,
            catwayNumber: catwayID
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ errror: 'reservation_not_found' });
        }

        return res.status(200).json({message: 'delete_ok'});
    } catch (error) {
        return res.status(500).json({error: error.message });
    }
};