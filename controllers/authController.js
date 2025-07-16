const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

/**
 * @function login
 * @description
 * Authentifie un utilisateur avec son email et son mot de passe.
 * Si l'authentification réussit, génère et renvoie un JWT (JSON Web Token) valable 24h,
 * ainsi que les données publiques de l'utilisateur.
 * 
 * @async
 * @route POST /login
 * @param {import('express').Request} req - Objet requête Express (req.body.email et req.body.password sont requis).
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * 
 * @returns {Promise<void>} 
 * - En cas de succès, code 200 avec message, token JWT (préfixé "Bearer ") et données utilisateur.
 * - Code 400 si email ou mot de passe manquant.
 * - Code 404 si utilisateur non trouvé.
 * - Code 403 si mot de passe incorrect.
 * - Code 500 en cas d’erreur serveur.
 */
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email_and_password_required' });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'user_not_found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(403).json({ message: 'wrong_credentials' });

    const payloadUser = { id: user._id, email: user.email, username: user.username };
    const token = jwt.sign(payloadUser, SECRET_KEY, { expiresIn: '24h' });

    return res.status(200).json({
      message: 'authenticate_succeeded',
      token: 'Bearer ' + token,
      user: payloadUser
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * @function logout
 * @description
 * Déconnecte un utilisateur.  
 * Note : Ici la déconnexion côté serveur ne nécessite pas d’action particulière
 * car le JWT est stateless. C’est plutôt côté client que le token est supprimé.
 * 
 * @async
 * @route POST /logout
 * @param {import('express').Request} req - Objet requête Express.
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * 
 * @returns {Promise<void>} Code 200 avec message de succès.
 */
exports.logout = async (req, res, next) => {
  return res.status(200).json({ message: 'logout_success' });
};