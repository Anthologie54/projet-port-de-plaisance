/**
 * @file userController.js
 * @description Contrôleur pour la gestion CRUD des utilisateurs.
 * Contient la logique métier pour créer, lire, mettre à jour et supprimer un utilisateur.
 */

const User = require('../models/User');
const bcrypt = require('bcrypt');

/**
 * Récupère la liste de tous les utilisateurs (sans leurs mots de passe).
 *
 * @param {Object} req - Objet requête Express.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * @returns {JSON} Liste des utilisateurs ou erreur 500.
 */
exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
};

/**
 * Récupère un utilisateur par email (sans le mot de passe).
 *
 * @param {Object} req - Objet requête Express.
 * @param {Object} req.params - Paramètres de la requête.
 * @param {string} req.params.email - Email de l'utilisateur recherché.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * @returns {JSON} Utilisateur trouvé ou erreur 404 / 500.
 */
exports.getByEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (user) {
      return res.status(200).json(user);
    }
    return res.status(404).json({ error: 'user_not_found' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

/**
 * Crée un nouvel utilisateur avec hashage du mot de passe.
 *
 * @param {Object} req - Objet requête Express.
 * @param {Object} req.body - Données envoyées par le client.
 * @param {string} req.body.username - Nom d'utilisateur.
 * @param {string} req.body.email - Email unique.
 * @param {string} req.body.password - Mot de passe en clair.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * @returns {JSON} Utilisateur créé (sans mot de passe) ou erreur 400/409/500.
 */
exports.add = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'password_too_short' });
  }

  try {
    const user = await User.create({ username, email, password });

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json(userObj);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'email_already_used' });
    }
    return res.status(500).json(error);
  }
};

/**
 * Met à jour les informations d'un utilisateur par email.
 * Si un mot de passe est fourni, il sera automatiquement re-hashé (grâce au middleware).
 *
 * @param {Object} req - Objet requête Express.
 * @param {Object} req.params - Paramètres de la requête.
 * @param {string} req.params.email - Email de l'utilisateur à modifier.
 * @param {Object} req.body - Données à modifier (username, email, password).
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * @returns {JSON} Utilisateur modifié (sans mot de passe) ou erreur 400/404/500.
 */
exports.update = async (req, res, next) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'user_not_found' });
    }

    if (req.body.password && req.body.password.length < 8) {
      return res.status(400).json({ error: 'password_too_short' });
    }

    // Met à jour seulement les champs envoyés
    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password;

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json(userObj);
  } catch (error) {
    return res.status(500).json(error);
  }
};

/**
 * Supprime un utilisateur par email.
 *
 * @param {Object} req - Objet requête Express.
 * @param {Object} req.params - Paramètres de la requête.
 * @param {string} req.params.email - Email de l'utilisateur à supprimer.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * @returns {JSON} Message de succès ou erreur 500.
 */
exports.delete = async (req, res, next) => {
  const email = req.params.email;

  try {
    await User.deleteOne({ email });
    return res.status(200).json({ message: 'delete_ok' });
  } catch (error) {
    return res.status(500).json(error);
  }
};