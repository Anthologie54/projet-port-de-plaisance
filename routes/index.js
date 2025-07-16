/**
 * @file index.js
 * @description Router principal de l'application.
 */

const express = require('express');
const router = express.Router();
const { checkJWT } = require('../middlewares/authMiddleware');

/**
 * @route GET /
 * @description Page d'accueil : formulaire de connexion et présentation.
 * @access Public
 */
router.get('/', (req, res) => {
  res.render('index', { appName: process.env.APP_NAME });
});

/**
 * @route GET /
 * @description Page de documentation 
 * @access Public
 */
router.get('/doc', (req, res) => {
  res.render('doc', { appName: process.env.APP_NAME });
});

/**
 * @route GET /
 * @description Tableau de bord avec les fonctionnalité demandé.
 * @access Protégé
 */
router.get('/dashboard', (req, res) => {
  res.render('dashboard', { appName: process.env.APP_NAME });
});


// Routes principales
router.use('/users', require('./userRoutes'));
router.use('/catways', require('./catwayRoutes'));
router.use('/reservations', require('./reservationRoutes'));

module.exports = router;