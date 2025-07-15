/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connecte un utilisateur et renvoie un token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentification réussie
 */
router.post('/login', controller.login);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Déconnecte l'utilisateur
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.get('/logout', controller.logout);

module.exports = router;