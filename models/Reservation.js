const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma Mongoose pour représenter une réservation.
 * Ajout de validations pour assurer la cohérence des dates et des champs.
 */
const ReservationSchema = new Schema({
  catwayNumber: {
    type: Number,
    required: [true, 'Le numéro du catway est nécessaire.'],
    min: [1, 'Le numéro du catway doit être supérieur à 0']
  },
  clientName: {
    type: String,
    required: [true, 'Le nom du client est nécessaire.'],
    minlength: [2, 'Le nom du client doit contenir au moins 2 caractères'],
    maxlength: [100, 'Le nom du client ne doit pas dépasser 100 caractères']
  },
  boatName: {
    type: String,
    required: [true, 'Le nom du bateau est nécessaire.'],
    minlength: [2, 'Le nom du bateau doit contenir au moins 2 caractères'],
    maxlength: [100, 'Le nom du bateau ne doit pas dépasser 100 caractères']
  },
  startDate: {
    type: Date,
    required: [true, 'La date d\'arrivée est nécessaire.']
  },
  endDate: {
    type: Date,
    required: [true, 'La date de départ est nécessaire.'],
    validate: {
      validator: function(value) {
        // Vérifie que endDate > startDate
        return this.startDate ? value > this.startDate : true;
      },
      message: 'La date de départ doit être postérieure à la date d\'arrivée.'
    }
  }
}, { collection: 'reservation' });

module.exports = mongoose.model('Reservation', ReservationSchema, 'reservation');