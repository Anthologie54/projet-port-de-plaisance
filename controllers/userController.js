const User = require('../models/User');
const bcrypt = require('bcrypt');

/**
 * @function getAll
 * @description
 * Récupère la liste de tous les utilisateurs en excluant leurs mots de passe.
 * 
 * @async
 * @route GET /users
 * @param {import('express').Request} req - Objet requête Express.
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * 
 * @returns {Promise<void>} Code 200 avec tableau des utilisateurs sans mot de passe,
 * ou code 500 en cas d’erreur serveur.
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
 * @function getByEmail
 * @description
 * Récupère un utilisateur par email en excluant le mot de passe.
 * Renvoie 404 si utilisateur introuvable.
 * 
 * @async
 * @route GET /users/:email
 * @param {import('express').Request} req - Objet requête Express (req.params.email = email recherché).
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * 
 * @returns {Promise<void>} Code 200 avec utilisateur trouvé, 404 si non trouvé,
 * ou 500 en cas d’erreur serveur.
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
 * @function add
 * @description
 * Crée un nouvel utilisateur avec les données du corps de la requête.
 * Vérifie que le mot de passe a au moins 8 caractères.
 * Renvoie 409 si l’email est déjà utilisé.
 * 
 * @async
 * @route POST /users
 * @param {import('express').Request} req - Objet requête Express (req.body contient username, email, password).
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * 
 * @returns {Promise<void>} Code 201 avec utilisateur créé (sans mot de passe),
 * 400 si mot de passe trop court,
 * 409 si email déjà utilisé,
 * ou 500 en cas d’erreur serveur.
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
 * @function update
 * @description
 * Met à jour un utilisateur identifié par email.
 * Vérifie que le nouveau mot de passe (si présent) a au moins 8 caractères.
 * Met à jour uniquement les champs fournis (username, email, password).
 * Renvoie 404 si utilisateur non trouvé.
 * 
 * @async
 * @route PUT /users/:email
 * @param {import('express').Request} req - Objet requête Express (req.params.email = email ciblé, req.body = champs à modifier).
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * 
 * @returns {Promise<void>} Code 200 avec utilisateur mis à jour (sans mot de passe),
 * 400 si mot de passe trop court,
 * 404 si utilisateur non trouvé,
 * ou 500 en cas d’erreur serveur.
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
 * @function delete
 * @description
 * Supprime un utilisateur identifié par email.
 * 
 * @async
 * @route DELETE /users/:email
 * @param {import('express').Request} req - Objet requête Express (req.params.email = email ciblé).
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * 
 * @returns {Promise<void>} Code 200 avec message de succès,
 * ou 500 en cas d’erreur serveur.
 */
exports.delete = async (req, res, next) => {
  try {
    await User.deleteOne({ email: req.params.email });
    return res.status(200).json({ message: 'delete_ok' });
  } catch (error) {
    return res.status(500).json(error);
  }
};
