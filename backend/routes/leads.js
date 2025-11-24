const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/leadsController');

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.get('/:id', ctrl.getById);
router.delete('/:id', ctrl.remove);
router.put('/:id', ctrl.update);
router.post('/:id/convert', ctrl.convertLeadToCustomer);

module.exports = router;