const User = require ('../models/User')
const bcrypt = require('bcrypt')
/**
 * Récupère la liste de tous les utilisateurs sans leurs mots de pass
 * 
 * @param {Object} req - Objet requête Express.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * 
 * @returns {JSON} Liste des utilisateurs ou erreur 500.
 */

exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
};


/**
 * Récupère un utilisateur par email sans mot de passe.
 * 
 * @param {Object} req  - Objet requête Express.
 * @param {Object} req.params - Paramètre de la requête.
 * @param {string} req.params.email - Email de l'utilisateur à chercher.
 * @param {Objet} res  - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 * 
 * @returns {JSON} Utilisateur trouvé ou message d'erreur 404 / 500.
 */
exports.getByEmail = async (req, res, next) => {
    
    try {
        let user = await User.findOne({email: req.params.email}).select('-password');
        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(500).json(error)
    }
};

/**
 * 
 * Créer un utilisateur avec le hask du mot de passe 
 * @param {Object} req  - Objet requête Express.
 * @param {Object} req.body - Données envoyées.
 * @param {string} req.body.usernam - Nom d'utilisateur.
 * @param {string} req.body.email - Email unique de l'utilisateur.
 * @param {string} req.body.password - Mot de passe en clair.
 * @param {Object} res -Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 *  
 * @returns {JSON} Utilisateur crée (sans le mot de passe) ou erreur 409/500.
 */
exports.add = async (req, res, next) => {
        const temp = {
            username  : req.body.username,
            email     : req.body.email,
            password  : req.body.password
        };
        try {
// Hashage du mot de passe.
            temp.password = await bcrypt.hash(temp.password, 10);
            let user = await User.create(temp);

            //Ne pas renvoyer le mot de passe
            user = user.toObject();
            delete user.password;

            return res.status(201).json(user);
        } catch (error) {
        if (error.code === 11000) {
         return res.status(409).json({error: 'email already used'});
        }
        return res.status(500).json(error);
    }
};

/**
 * Permet de mettre à jour un utilisateur par email.
 * 
 * @param {Object} req - Objet requête Express.
 * @param {Object} req.params - Paramètre de la requête.
 * @param {string} req.params.email - Email de l'utilisateur à modifier.
 * @param {Object} req.body - Données à modifier.
 * @param {string} [req.body.username] - Nouveau mot de passe.
 * @param {string} [req.body.email] - Nouvel email.
 * @param {string} [req.body.password] - Nouveau mot de passe.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next -Middleware suivant.
 * 
 * @returns {JSON} Utilisateur modifié ou erreur 404 / 500.
 */
exports.update = async (req, res, next) => {
    const email = req.params.email;

    const temp = {
        username   : req.body.username,
        email      : req.body.email,
        password   : req.body.password 
    };
    
    try {  
        if (temp.password) {
            temp.password = await bcrypt.hash(temp.password, 10)
        };

        let user = await User.findOne ({ email });

        if (user) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    user[key] = temp[key];
                }
            });

            await user.save()
            
            user = user.toObject();
            delete user.password;

            return res.status (200).json(user);
        }

        return res.status(404).json({error :'user_not_found'});
    } catch (error) {
        return res.status(500).json(error);
    }
};

/**
 * Supprime un utilisateur par email.
 * 
 * @param {Object} req - Objet requête Express.
 * @param {Object} req.params - Paramètres de la requête.
 * @param {string} req.params.email - Email de l'utilisateur à supprimer.
 * @param {Object} res  - Objet réponse Express.
 * @param {Function} next - Middleware suivant.
 *  
 * @returns {JSON} Message de succès ou erreur 500. 
 */

exports.delete = async (req, res, next) => {
    const email = req.params.email

    try{
        await User.deleteOne({ email });
        return res.status (200).json({message: 'delete_ok'})
    } catch (error) {
        return res.status (500).json(error);
    }
};