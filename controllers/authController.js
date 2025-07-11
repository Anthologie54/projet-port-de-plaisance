/**
 * @file authController.js
 * @description Contrôleur pour l'authentification (connexion et déconnexion des utilisateurs).
 */

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Connecte un utilisateur existant :
 * Vérifie l'email et le mot de passe puis renvoie un token JWT.
 *
 * @param {Object} req - Objet requête Express.
 * @param {Object} req.body - Données envoyées par le client.
 * @param {string} req.body.email - Email de l'utilisateur.
 * @param {string} req.body.password - Mot de passe de l'utilisateur.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * @returns {JSON} Message de succès avec token et infos utilisateur,
 *                 ou erreur 400/403/404/500.
 */
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Vérification des champs requis
  if (!email || !password) {
    return res.status(400).json({ message: 'email_and_password_required' });
  }

  try {
    // Recherche de l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'user_not_found' });
    }

    // Comparaison du mot de passe fourni avec le hash en base
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: 'wrong_credentials' });
    }

    // Création du payload pour le token
    const payloadUser = {
      id: user._id,
      email: user.email,
      username: user.username
    };

    // Génération du token avec une durée de validité de 24h
    const token = jwt.sign(payloadUser, SECRET_KEY, { expiresIn: '24h' });

    // Réponse avec le token et les infos utilisateur
    return res.status(200).json({
      message: 'authenticate_succeeded',
      token: 'Bearer ' + token,
      user: payloadUser
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Déconnecte un utilisateur.
 * Comme l'API est stateless, cela consiste simplement à répondre par un message de succès.
 *
 * @param {Object} req - Objet requête Express.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * @returns {JSON} Message de succès.
 */
exports.logout = async (req, res, next) => {
  return res.status(200).json({ message: 'logout_success' });
};