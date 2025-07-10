const express = require ('express');
const router = express.Router()

const controller = require ('../controllers/userController');

//Pour lister tous les users.
router.get('/', controller.getAll); 

//Pour récupérer les emails.
router.get('/:email', controller.getByEmail);

// Pour Crée 
router.post('/', controller.add) 

// Pour Modifier par email
router.put('/:email', controller.update); 

// Pour Supprimer par email
router.delete('/:email', controller.delete); 

module.exports = router;