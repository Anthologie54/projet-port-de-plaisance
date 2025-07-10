const express = require ('express');
const router = express.Router()
const controller = require ('../controllers/catwayController');

/**
 * @route GET /catways
 * @description Récupère la liste de tous les catways
 * @access Public
 */
router.get('/', controller.getAll);

/**
 * @route GET /catways/:id
 * @description Récupère un catway par son ID 
 * @access Public
 */
router.get('/:id', controller.getById);

/**
 * @route POST /catways
 * @description Crée un nouveau catway
 * @access Public
 */
router.post('/', controller.add)

/**
 * @route PUT /catways/:id
 * @description Met à a jour un catway (seule la description de l'état est modifiable)
 * @access Public
 */
router.put('/:id', controller.update);

/**
 * @route DELETE /catways/:id
 * @description Supprime un catway par son ID
 * @access Public
 */
router.delete('/:id', controller.delete);

module.exports = router;