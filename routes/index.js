var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {appName: process.env.APP_NAME });
    });

router.use('/users', require('./userRoutes'));
router.use('/catways', require('./catwayRoutes'));
router.use('/reservations', require ('./reservationRoutes'))

module.exports = router;