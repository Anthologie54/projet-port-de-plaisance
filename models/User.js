const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const bcrypt   = require('bcrypt');

const UserSchema = new Schema({
    username: {
        type      : String,
        trim      : true,
        required  : [true, 'Le nom dutilisateur est requis']
    },
    email: {
        type      : String,
        trim      : true,
        required  : [true, 'Lemail est requis'],
        unique    : true,
        match     : [/.+\@.+\..+/, 'Email invalide']
    },
    password: {
        type      : String,
        required  : true,
    }
})

//Pour que le mots de passe sois haché//
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model ('User', UserSchema);