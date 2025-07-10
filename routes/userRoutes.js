const express = require ('express');
const router = express.Router()
const controller = require ('../controllers/userController');

/**
 * @route GET /users
 * @description Récupère la liste de tous les utilisateurs (sans les mots de passe)
 * @access Public (à sécuriser plus tard si besoin)
 */
router.get('/', controller.getAll); 

/**
 * @route GET /user/:email
 * @description Récupère un utilisateur par email (sans le mot de passe)
 * @access Public (à sécuriser plus tard si besoin)
 */
router.get('/:email', controller.getByEmail);

/**
 * @route POST /users
 * @description Crée un nouvel utilisateur
 * @access Public
 */
router.post('/', controller.add) 

/**
 * @route PUT /users/:email
 * @description Mettre à jour un utilisateur par email
 * @access Public (à sécuriser plus tard)
 */
router.put('/:email', controller.update); 

/**
 * @route DELETE /users/:email
 * @description Supprime un utilisateur par email
 * @access Public (à sécuriser plus tard)
 */
router.delete('/:email', controller.delete); 

module.exports = router;