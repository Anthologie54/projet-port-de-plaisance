/**
 * @file Catway.js
 * @description Modèle Mongoose pour les catways.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CatwaySchema = new Schema({
    catwayNumber: {
        type: Number,
        unique: true,
        required: [true, 'Le numéro du Catway est requis']
    },
    catwayType: {
        type: String,
        enum: ['long', 'short'],
        required: [true, 'Le type du catway est requis']
    },
    catwayState: {
        type: String,
        required: [true, 'L\'état du catway est requis']
    }
});

module.exports = mongoose.model('Catway', CatwaySchema);