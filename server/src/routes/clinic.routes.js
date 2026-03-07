const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinic.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', clinicController.getAll);
router.get('/:id', clinicController.getById);

// Admin routes
router.post('/', authenticate, authorize('ADMIN'), clinicController.create);
router.put('/:id', authenticate, authorize('ADMIN'), clinicController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), clinicController.remove);

module.exports = router;
