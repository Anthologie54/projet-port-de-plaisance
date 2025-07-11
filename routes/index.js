/**
 * @file index.js
 * @description Router principal de l'application.
 */

var express = require('express');
var router = express.Router();

/**
 * @route GET /
 * @description Page d'accueil : formulaire de connexion et présentation.
 * @access Public
 */
router.get('/', (req, res) => {
    res.render('index', { appName: process.env.APP_NAME });
});

// Routes principales
router.use('/users', require('./userRoutes'));
router.use('/catways', require('./catwayRoutes'));
router.use('/reservations', require('./reservationRoutes'));

module.exports = router;