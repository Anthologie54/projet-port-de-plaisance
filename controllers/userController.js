const User = require('../models/User');
const bcrypt = require('bcrypt');

/**
 * Récupère la liste de tous les utilisateurs sans leurs mots de passe.
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
 * Récupère un utilisateur par email sans le mot de passe.
 * @param {Object} req - Objet requête Express.
 * @param {string} req.params.email - Email à rechercher.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * @returns {JSON} Utilisateur trouvé ou erreur.
 */
exports.getByEmail = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.params.email }).select('-password');
    if (user) return res.status(200).json(user);
    return res.status(404).json('user_not_found');
  } catch (error) {
    return res.status(500).json(error);
  }
};

/**
 * Crée un nouvel utilisateur (vérifie longueur du mot de passe).
 * @param {Object} req - Objet requête Express.
 * @param {string} req.body.username - Nom d'utilisateur.
 * @param {string} req.body.email - Email unique.
 * @param {string} req.body.password - Mot de passe.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * @returns {JSON} Utilisateur créé ou erreur.
 */
exports.add = async (req, res, next) => {
  const temp = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };

  if (!temp.password || temp.password.length < 8) {
    return res.status(400).json({ error: 'password_too_short' });
  }

  try {
    let user = await User.create(temp);
    user = user.toObject();
    delete user.password;
    return res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'email already used' });
    }
    return res.status(500).json(error);
  }
};

/**
 * Met à jour un utilisateur par email.
 * Vérifie si un nouveau mot de passe est trop court.
 * @param {Object} req - Objet requête Express.
 * @param {string} req.params.email - Email ciblé.
 * @param {Object} req.body - Champs à modifier.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * @returns {JSON} Utilisateur modifié ou erreur.
 */
exports.update = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: 'user_not_found' });

    if (req.body.password && req.body.password.length < 8) {
      return res.status(400).json({ error: 'password_too_short' });
    }

    // Mettre à jour uniquement les champs fournis
    ['username', 'email', 'password'].forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    user = user.toObject();
    delete user.password;

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

/**
 * Supprime un utilisateur par email.
 * @param {Object} req - Objet requête Express.
 * @param {string} req.params.email - Email ciblé.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * @returns {JSON} Message de succès ou erreur.
 */
exports.delete = async (req, res, next) => {
  try {
    await User.deleteOne({ email: req.params.email });
    return res.status(200).json({ message: 'delete_ok' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
