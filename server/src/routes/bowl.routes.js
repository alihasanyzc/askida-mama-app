const express = require('express');
const router = express.Router();
const bowlController = require('../controllers/bowl.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const bowlValidator = require('../validators/bowl.validator');

// Public routes
router.get('/', bowlController.getAll);
router.get('/nearby', validate(bowlValidator.getNearby, 'query'), bowlController.getNearby);
router.get('/qr/:qrCode', bowlController.getByQrCode);
router.get('/:id', bowlController.getById);

// Protected routes
router.post('/', authenticate, validate(bowlValidator.createBowl), bowlController.create);
router.put('/:id', authenticate, validate(bowlValidator.updateBowl), bowlController.update);
router.delete('/:id', authenticate, bowlController.remove);
router.post('/:id/fill', authenticate, bowlController.fillBowl);

module.exports = router;
