/**
 * @file app.js
 * @description Application principale Express pour le port Russell.
 * Initialise la connexion MongoDB, configure les middlewares, routes et vues.
 */

require('dotenv').config();

const express      = require('express');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const cors         = require('cors');
const path         = require('path');
const createError  = require('http-errors');

const indexRouter  = require('./routes/index');
const authRoutes   = require('./routes/authRoutes');
const { initClientDbConnection } = require('./config/mongo');
const { swaggerUi, specs } = require('./swagger/swagger');
const reservationGlobalRoutes = require('./routes/reservationGlobalRoutes');

// Initialise la connexion à MongoDB (log dans la console si succès ou erreur)
initClientDbConnection();

// Crée l'application Express
const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Définit le dossier public (pour fichiers statiques : CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Active CORS pour toutes les origines (exemple simple)
// Expose en plus le header Authorization pour le front (token JWT)
app.use(cors({
  exposedHeaders: ['Authorization'],
  origin: '*'
}));

// Logger HTTP des requêtes (dev: coloré et pratique en dev)
app.use(logger('dev'));

// Parse automatiquement JSON et URL-encoded (formulaires)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Parse les cookies envoyés par le client
app.use(cookieParser());

// Routes d'authentification
app.use('/auth', authRoutes);

// Routes globales des réservations (TOUTES réservations)
app.use('/reservations', reservationGlobalRoutes);

// Routes principales (page d'accueil, catways, users, reservations)
app.use('/', indexRouter);

// Gestion des erreurs 404 pour toutes les autres routes non trouvées
app.use(function(req, res, next) {
  res.status(404).json({ name: 'API', version: '1.0', status: 404, message: 'not_found' });
});

// Définit le dossier contenant les vues et le moteur de templates EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Exporte l'app pour qu'elle soit utilisée par bin/www ou autre serveur
module.exports = app;