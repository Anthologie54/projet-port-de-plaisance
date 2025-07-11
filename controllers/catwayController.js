/**
 * @file catwayController.js
 * @description Contrôleur pour gérer les catways (CRUD).
 */

const Catway = require('../models/Catway');

/**
 * Récupère la liste de tous les catways.
 * 
 * @param {Object} req - Objet requête Express.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * @returns {JSON} Liste des catways ou erreur 500.
 */
exports.getAll = async (req, res, next) => {
    try {
        const catways = await Catway.find();
        return res.status(200).json(catways);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Récupère un catway par son ID.
 * 
 * @param {Object} req - Objet requête Express.
 * @param {Object} req.params - Paramètres de la requête.
 * @param {string} req.params.id - ID du catway recherché.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * @returns {JSON} Catway trouvé ou message d'erreur 404 / 500.
 */
exports.getById = async (req, res, next) => {
    try {
        const catway = await Catway.findById(req.params.id);
        if (catway) {
            return res.status(200).json(catway);
        }
        return res.status(404).json({ error: 'catway_not_found' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Crée un nouveau catway.
 * 
 * @param {Object} req - Objet requête Express.
 * @param {Object} req.body - Données du catway.
 * @param {string} req.body.catwayNumber - Numéro unique du catway.
 * @param {string} req.body.catwayType - Type du catway ("long" ou "short").
 * @param {string} req.body.catwayState - Etat du catway.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * @returns {JSON} Catway créé ou erreur 409 / 500.
 */
exports.add = async (req, res, next) => {
    const temp = {
        catwayNumber: req.body.catwayNumber,
        catwayType: req.body.catwayType,
        catwayState: req.body.catwayState
    };
    try {
        const catway = await Catway.create(temp);
        return res.status(201).json(catway);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: 'catway already used' });
        }
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Met à jour l'état d'un catway.
 * Le numéro et le type ne peuvent pas être modifiés.
 * 
 * @param {Object} req - Objet requête Express.
 * @param {Object} req.params - Paramètres de la requête.
 * @param {string} req.params.id - ID du catway à modifier.
 * @param {Object} req.body - Nouvel état.
 * @param {string} req.body.catwayState - Nouveau texte décrivant l'état.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * @returns {JSON} Catway modifié ou erreur 404 / 500.
 */
exports.update = async (req, res, next) => {
    try {
        const catway = await Catway.findById(req.params.id);
        if (catway) {
            catway.catwayState = req.body.catwayState || catway.catwayState;
            await catway.save();
            return res.status(200).json(catway);
        }
        return res.status(404).json({ error: 'catway_not_found' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Supprime un catway par son ID.
 * 
 * @param {Object} req - Objet requête Express.
 * @param {Object} req.params - Paramètres de la requête.
 * @param {string} req.params.id - ID du catway à supprimer.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * @returns {JSON} Message de succès ou erreur 500.
 */
exports.delete = async (req, res, next) => {
    try {
        await Catway.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: 'delete_ok' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};