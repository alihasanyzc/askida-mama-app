import { Router } from 'express';

import {
  authMiddleware,
  optionalAuthMiddleware,
} from '../../middlewares/auth.middleware.js';
import { validationMiddleware } from '../../middlewares/validation.middleware.js';
import {
  createPostComment,
  createPost,
  deletePost,
  getPostById,
  likeComment,
  likePost,
  listFeedPosts,
  listPostLikes,
  listOwnPosts,
  listPostComments,
  listPosts,
  unlikeComment,
  unlikePost,
  updatePost,
} from './posts.controller.js';
import {
  createPostCommentSchema,
  createPostSchema,
  updatePostSchema,
} from './posts.schema.js';

const postsRouter = Router();

postsRouter.get('/feed', authMiddleware, listFeedPosts);
postsRouter.get('/', optionalAuthMiddleware, listPosts);
postsRouter.get('/me', authMiddleware, listOwnPosts);
postsRouter.get('/:postId', optionalAuthMiddleware, getPostById);
postsRouter.get('/:postId/likes', listPostLikes);
postsRouter.get('/:postId/comments', optionalAuthMiddleware, listPostComments);
postsRouter.post('/', authMiddleware, validationMiddleware(createPostSchema), createPost);
postsRouter.post(
  '/:postId/comments',
  authMiddleware,
  validationMiddleware(createPostCommentSchema),
  createPostComment,
);
postsRouter.post('/:postId/like', authMiddleware, likePost);
postsRouter.post('/comments/:commentId/like', authMiddleware, likeComment);
postsRouter.patch('/:postId', authMiddleware, validationMiddleware(updatePostSchema), updatePost);
postsRouter.delete('/comments/:commentId/like', authMiddleware, unlikeComment);
postsRouter.delete('/:postId/like', authMiddleware, unlikePost);
postsRouter.delete('/:postId', authMiddleware, deletePost);

export { postsRouter };
