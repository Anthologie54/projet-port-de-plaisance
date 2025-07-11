const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

/**
 * Schéma User
 * @typedef {Object} User
 * @property {string} username - Nom d'utilisateur (obligatoire, trim).
 * @property {string} email - Adresse email unique, format validé.
 * @property {string} password - Mot de passe hashé (min 8 caractères, au moins 1 majuscule et 1 chiffre).
 */
const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: [true, 'Le nom d\'utilisateur est requis']
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Email invalide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
    validate: {
      validator: function (value) {
        // Au moins une majuscule et un chiffre
        return /^(?=.*[A-Z])(?=.*\d).+$/.test(value);
      },
      message: 'Le mot de passe doit contenir au moins une majuscule et un chiffre'
    }
  }
});

/**
 * Middleware pré-save : hash du mot de passe si modifié.
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema);