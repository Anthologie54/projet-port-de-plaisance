const Catway = require ('../models/Catway')

/**
 * Récupère la liste de tous les Catways
 * 
 * @param {Object} req - Objet requête Express.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * 
 * @returns {JSON} Liste des catways ou erreur 500.
 */
exports.getAll = async (req, res, next) => {
    try {
        const Catways = await Catway.find();
        return res.status(200).json(Catways);
    } catch (error) {
        console.error(error);
        return res.status (500).json({error: error.message});
    }
};
/**
 * Récupère un Catways
 * 
 * @param {Object} req  - Objet requête Express.
 * @param {Object} req.params - Paramètre de la requête.
 * @param {string} req.params.id - Id du Catways recherché
 * @param {Objet} res  - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * 
 * @returns {JSON} Catway trouvé ou message d'erreur 404 / 500.
 */
exports.getById = async (req, res, next) => {
    try{
        let catway = await Catway.findById (req.params.id);

        if (catway) {
            return res.status(200).json(catway);
        }
        return res.status(404).json('catway_not_found');
    } catch (error) {
        return res.status(500).json(error);
    }
},
/**
 * 
 * Créer un Catway 
 * @param {Object} req  - Objet requête Express.
 * @param {Object} req.body - Données envoyées.
 * @param {string} req.body.catwayNumber - Numéro du Catway.
 * @param {string} req.body.catwayType - Type de Catway.
 * @param {string} req.body.catwayState - Etat du Catway.
 * @param {Object} res -Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 *  
 * @returns {JSON} Catway crée ou erreur 409/500.
 */
exports.add = async (req, res, next) => {
    const temp = {
        catwayNumber   : req.body.catwayNumber,
        catwayType     : req.body.catwayType,
        catwayState    : req.body.catwayState
    };
    try {
        let catway = await Catway.create(temp);
        return res.status(201).json (catway);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({error: 'catway already used'});
        }
        return res.status(500).json (error);
    }
};

/**
 * Met à jour l'état d'un catway (le numéro et le type ne sont pas modifiable)
 * 
 * @param {Object} req  -Objet requête Express.
 * @param {string} req.body.catwayState - Nouvel état du catway.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant
 * 
 * @returns {JSON} - Etat d'un catway modifé ou erreur 404 / 500
 */
exports.update = async (req, res, next) => {
    const temp = {
        catwayState    : req.body.catwayState
    };

    try {
        let catway = await Catway.findById (req.params.id);
        if (catway){
            if (catway.catwayState) {
                catway.catwayState = temp.catwayState;
            }
        
            await catway.save()

            return res.status(200).json(catway);
        }
        return res.status(404).json ({error: 'catway_not_found'});
    } catch (error) {
        return res.status(500).json(error);
    }
};

/**
 * @param {Object} req - Objet requête Express.
 * @param {Object} req.params - Paramètre de la requête.
 * @param {string} req.params.id - ID du catway a supprimé
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * 
 * @returns {Object} - Message de succés ou erreur 500
 */
exports.delete = async (req, res, next) => {
    const id = req.params.id

    try {
        await Catway.deleteOne({_id: id});
        return res.status(200).json({message: 'delete_ok'})
    } catch (error) {
        return res.status(500).json(error)
    }
};