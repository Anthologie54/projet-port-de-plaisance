const User = require ('../models/User')
exports.getByEmail = async (req, res, next) => {
    
    try {
        let user = await User.findOne({email: req.params.email});

        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(500).json(error)
    }
}

exports.add = async (req, res, next) => {

    const temp = ({
        username  : req.body.username,
        email     : req.body.email,
        password  : req.body.password
    });

    try {
        let user = await User.create(temp);

        return res.status(201).json(user);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({error: 'email already used'})
        }
        return res.status(500).json(error);
        
  // Code 409 gestion des emails dans le cas ou celui ci serais déjà utilisé.
    
    }
}

exports.update = async (req, res, next) => {
    const id = req.params.id
    const temp = ({
        username   : req.body.username,
        email      : req.body.email,
        password   : req.body.password
    });

    try {
        let user = await User.findOne({_id : id});

        if (user) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    user[key] = temp[key];
                }
            })

            await user.save()
            return res.status (200).json(user);
        }

        return res.status(404).json({error :'user_not_found'});
    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.delete = async (req, res, next) => {
    const id = req.params.id

    try{
        await User.deleteOne({ _id: id});

        return res.status (200).json({message: 'delete_ok'})
    } catch (error) {
        return res.status (501).json(error);
    }
}