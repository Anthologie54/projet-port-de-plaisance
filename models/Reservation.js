const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ReservationSchema = new Schema({
    catwayNumber: {
        type     : Number,
        required : [true, 'Le numéro du catway est nécessaire.']
    },
    clientName: {
        type     : String,
        required : [true, 'Le nom du client est nécessaire.']
    },
    boatName: {
        type     : String,
        required : [true, 'Le nom du bateau est nécessaire.']
    },
    startDate: {
        type     : Date,
        required : [true, 'La date d\'arrivé est nécessaire.']
    },
    endDate:{
        type     : Date,
        required : [true, 'La date de départ est nécessaire.']
    }
}, { collection: 'reservation' });

module.exports = mongoose.model ('Reservation', ReservationSchema, 'reservation');