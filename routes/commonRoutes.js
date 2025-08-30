const express = require('express');
const router = express.Router();
const { deleteItem, activateItem, deactivateItem } = require('../controllers/admin/commonController');
const authenticateAdmin = require('../middleware/authenticateAdmin');
const { validateId } = require('../validations/validations');

// Route to delete an item
router.delete('/delete/:model/:id', authenticateAdmin, validateId, deleteItem);
// Route to activate an item
router.put('/active/:model/:id', authenticateAdmin, validateId, activateItem);
// Route to deactivate an item
router.put('/inactive/:model/:id', authenticateAdmin, validateId, deactivateItem);


module.exports = router;