const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donation.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const donationValidator = require('../validators/donation.validator');

// Public routes
router.get('/', donationController.getAll);
router.get('/stats', donationController.getStats);
router.get('/:id', donationController.getById);

// Protected routes
router.post('/', authenticate, validate(donationValidator.createDonation), donationController.create);
router.get('/me/donations', authenticate, donationController.getMyDonations);

// Admin routes
router.patch('/:id/status', authenticate, authorize('ADMIN'), validate(donationValidator.updateDonationStatus), donationController.updateStatus);

module.exports = router;
