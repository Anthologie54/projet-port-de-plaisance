/**
 * @file User.js
 * @description Schéma Mongoose pour les utilisateurs de la capitainerie.
 * Contient la logique de hashage du mot de passe avant sauvegarde.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

/**
 * Schéma définissant la structure d'un utilisateur.
 * @typedef {Object} User
 * @property {string} username - Nom d'utilisateur (obligatoire).
 * @property {string} email - Adresse email unique et valide (obligatoire).
 * @property {string} password - Mot de passe haché (obligatoire).
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
    match: [/.+\@.+\..+/, 'Email invalide']
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // bonne pratique: longueur minimale avant hashage
  }
});

/**
 * Middleware exécuté avant la sauvegarde d'un utilisateur.
 * Si le mot de passe a été modifié, il est automatiquement haché.
 */
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    // Hashage du mot de passe avec bcrypt (10 tours de salage)
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);