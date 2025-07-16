const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma Mongoose pour représenter un catway.
 * Contient des règles de validation supplémentaires pour renforcer la cohérence des données.
 */
const CatwaySchema = new Schema({
  catwayNumber: {
    type: Number,
    unique: true,
    required: [true, 'Le numéro du Catway est requis'],
    min: [1, 'Le numéro du catway doit être supérieur à 0'] 
  },
  catwayType: {
    type: String,
    enum: ['long', 'short'],
    required: [true, 'Le type du catway est requis']
  },
  catwayState: {
    type: String,
    required: [true, 'L\'état du catway est requis'],
    minlength: [3, 'La description de l\'état doit contenir au moins 3 caractères'],
    maxlength: [200, 'La description de l\'état ne doit pas dépasser 200 caractères']
  }
});

module.exports = mongoose.model('Catway', CatwaySchema);