import Joi from 'joi';

import type { UpdateProfileInput } from './profiles.type.js';

export const updateProfileSchema = Joi.object<UpdateProfileInput>({
  full_name: Joi.string().trim().min(2).max(100).optional(),
  username: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9._]+$/)
    .min(3)
    .max(50)
    .optional(),
  avatar_url: Joi.string().uri().allow(null, '').optional(),
  cover_photo_url: Joi.string().uri().allow(null, '').optional(),
  bio: Joi.string().trim().max(150).allow(null, '').optional(),
  phone: Joi.string().trim().max(20).allow(null, '').optional(),
})
  .min(1)
  .required();
