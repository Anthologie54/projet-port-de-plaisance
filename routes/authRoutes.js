/**
 * @file authRoutes.js
 * @description Routes liées à l'authentification.
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

/**
 * @route POST /auth/login
 * @description Authentifie un utilisateur et renvoie un token.
 * @access Public
 */
router.post('/login', controller.login);

/**
 * @route GET /auth/logout
 * @description Déconnecte l'utilisateur (stateless, réponse simple).
 * @access Public
 */
router.get('/logout', controller.logout);

module.exports = router;