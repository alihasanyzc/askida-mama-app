const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const userValidator = require('../validators/user.validator');

// Public routes
router.get('/:id', userController.getProfile);
router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);

// Protected routes
router.put('/profile', authenticate, validate(userValidator.updateProfile), userController.updateProfile);
router.post('/:id/follow', authenticate, userController.follow);
router.delete('/:id/follow', authenticate, userController.unfollow);

module.exports = router;
