import Joi from 'joi';

import type { LoginInput, RegisterInput } from './auth.type.js';

export const registerSchema = Joi.object<RegisterInput>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  full_name: Joi.string().trim().min(2).max(100).required(),
  username: Joi.string().trim().min(3).max(50).required(),
  phone: Joi.string().trim().max(20).allow(null, '').optional(),
});

export const loginSchema = Joi.object<LoginInput>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});
