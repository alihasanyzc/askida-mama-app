const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const postValidator = require('../validators/post.validator');

// Public / Optional auth routes
router.get('/', optionalAuth, postController.getAll);
router.get('/:id', optionalAuth, postController.getById);
router.get('/user/:userId', postController.getByUser);
router.get('/:id/likes', postController.getLikes);
router.get('/:id/comments', postController.getComments);

// Protected routes
router.post('/', authenticate, validate(postValidator.createPost), postController.create);
router.put('/:id', authenticate, validate(postValidator.updatePost), postController.update);
router.delete('/:id', authenticate, postController.remove);

// Like & Comment
router.post('/:id/like', authenticate, postController.toggleLike);
router.post('/:id/comments', authenticate, validate(postValidator.addComment), postController.addComment);
router.delete('/comments/:commentId', authenticate, postController.deleteComment);

module.exports = router;
