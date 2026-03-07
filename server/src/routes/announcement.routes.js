const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcement.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const announcementValidator = require('../validators/announcement.validator');

// Public routes
router.get('/', announcementController.getAll);
router.get('/:id', announcementController.getById);

// Protected routes
router.post('/', authenticate, validate(announcementValidator.createAnnouncement), announcementController.create);
router.put('/:id', authenticate, validate(announcementValidator.updateAnnouncement), announcementController.update);
router.delete('/:id', authenticate, announcementController.remove);

module.exports = router;
