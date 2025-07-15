const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const { checkJWT } = require('../middlewares/authMiddleware');

/**
 * @route GET /users
 * @description Récupère la liste de tous les utilisateurs (sans les mots de passe)
 * @access Public (ou protégée si besoin)
 */
router.get('/', checkJWT, controller.getAll);

/**
 * @route GET /users/:email
 * @description Récupère un utilisateur par email (sans le mot de passe)
 * @access Public (ou protégée si besoin)
 */
router.get('/:email', checkJWT, controller.getByEmail);

/**
 * @route POST /users
 * @description Crée un nouvel utilisateur
 * @access Protégée
 */
router.post('/', controller.add);

/**
 * @route PUT /users/:email
 * @description Mettre à jour un utilisateur par email
 * @access Protégée
 */
router.put('/:email', checkJWT, controller.update);

/**
 * @route DELETE /users/:email
 * @description Supprime un utilisateur par email
 * @access Protégée
 */
router.delete('/:email', checkJWT, controller.delete);

module.exports = router;