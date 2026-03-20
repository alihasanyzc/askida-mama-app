import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validationMiddleware } from '../../middlewares/validation.middleware.js';
import {
  createPost,
  deletePost,
  getPostById,
  listOwnPosts,
  listPosts,
  updatePost,
} from './posts.controller.js';
import { createPostSchema, updatePostSchema } from './posts.schema.js';

const postsRouter = Router();

postsRouter.get('/', listPosts);
postsRouter.get('/me', authMiddleware, listOwnPosts);
postsRouter.get('/:postId', getPostById);
postsRouter.post('/', authMiddleware, validationMiddleware(createPostSchema), createPost);
postsRouter.patch('/:postId', authMiddleware, validationMiddleware(updatePostSchema), updatePost);
postsRouter.delete('/:postId', authMiddleware, deletePost);

export { postsRouter };
