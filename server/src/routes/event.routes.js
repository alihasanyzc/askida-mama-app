const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', eventController.getAll);
router.get('/upcoming', eventController.getUpcoming);
router.get('/:id', eventController.getById);

// Admin routes
router.post('/', authenticate, authorize('ADMIN'), eventController.create);
router.put('/:id', authenticate, authorize('ADMIN'), eventController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), eventController.remove);

module.exports = router;
