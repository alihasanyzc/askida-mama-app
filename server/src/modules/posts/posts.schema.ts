import Joi from 'joi';

import type {
  CreatePostCommentInput,
  CreatePostInput,
  UpdatePostInput,
} from './posts.type.js';

export const createPostSchema = Joi.object<CreatePostInput>({
  image_url: Joi.string().uri().required(),
  content: Joi.string().trim().min(1).required(),
  category: Joi.string().trim().max(50).allow(null, '').optional(),
});

export const updatePostSchema = Joi.object<UpdatePostInput>({
  image_url: Joi.string().uri().optional(),
  content: Joi.string().trim().min(1).optional(),
  category: Joi.string().trim().max(50).allow(null, '').optional(),
})
  .min(1)
  .required();

export const createPostCommentSchema = Joi.object<CreatePostCommentInput>({
  text: Joi.string().trim().min(1).required(),
});
