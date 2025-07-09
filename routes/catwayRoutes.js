const express = require ('express');
const router = express.Router()

const service = require ('../services/catways');

router.get('/', service.getAll);
router.get('/:id', service.getById);
router.post('/', service.add)
router.put('/:id', service.update);
router.delete('/:id', service.delete);

module.exports = router;