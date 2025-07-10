const User = require ('../models/User')
const bcrypt = require('bcrypt')

// Liste tous les utilisateurs (Sans le mot de passe)
exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Récupérer un utilisateur par email (Sans le mot de passe)
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

// Créer un utilisateur avec le hask du mot de passe
exports.add = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await User.create({
            username  : req.body.username,
            email     : req.body.email,
            password  : req.body.password
        });
        
        return res.status(201).json(user)
// Aujout du code 409 gestion des emails dans le cas ou celui ci serais déjà utilisé.
    } catch (error) {
        if (error.code === 11000) {
         return res.status(409).json({error: 'email already used'});
        }
        return res.status(500).json(error);
    }
};
        

// Mettre à jour un utilisateur par email 
exports.update = async (req, res, next) => {
    const email = req.params.email;

    const temp = ({
        username   : req.body.username,
        email      : req.body.email,
        password   : req.body.password 
    });
    
    try {  
        if (temp.password) {
            temp.password = await bcrypt.hash(temp.password, 10)
        };
    //Hash du mots de passe , si il est fourni, lorsque celui est modifié   

        const user = await User.findOne({ email });

        if (user) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    user[key] = temp[key];
                }
            });

            await user.save()
            return res.status (200).json(user);
        }

        return res.status(404).json({error :'user_not_found'});
    } catch (error) {
        return res.status(500).json(error);
    }
};

// Supprimer un utilisateur par email. 

exports.delete = async (req, res, next) => {
    const email = req.params.email

    try{
        await User.deleteOne({ email });
        return res.status (200).json({message: 'delete_ok'})
    } catch (error) {
        return res.status (500).json(error);
    }
};