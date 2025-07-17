/**
 * @file config/mongo.js
 * @description Module de configuration et initialisation de la connexion MongoDB avec Mongoose.
 */

const mongoose = require('mongoose');
console.log('URL_MONGO:', process.env.URL_MONGO);
if (!process.env.URL_MONGO) {
  console.error('❌ La variable d\'environnement URL_MONGO est vide ou non définie !');
  process.exit(1);
}
// Log utile en dev pour vérifier que l'URL est bien chargée depuis .env
console.log('URL_MONGO:', process.env.URL_MONGO);

// Options de connexion (dbName est ici défini comme 'apinode')
const clientOptions = {
    useNewUrlParser: true, // Pour parser correctement les URI modernes MongoDB
    dbName        : 'apinode'
};

/**
 * Initialise la connexion MongoDB avec Mongoose.
 * Affiche "Connected" en cas de succès, sinon log l'erreur et la relaie.
 * 
 * @async
 * @function
 * @throws {Error} Lance une erreur si la connexion échoue.
 */
exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO, clientOptions);
        console.log('Connected');
    } catch (error) {
        console.error(error); 
        throw error;          
    }
};