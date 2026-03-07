const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', blogController.getAll);
router.get('/:id', blogController.getById);

// Admin routes
router.post('/', authenticate, authorize('ADMIN'), blogController.create);
router.put('/:id', authenticate, authorize('ADMIN'), blogController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), blogController.remove);

module.exports = router;
