import Joi from 'joi';

import type { ChatRespondInput } from './chat.type.js';

export const chatRespondSchema = Joi.object<ChatRespondInput>({
  message: Joi.string().trim().min(1).max(2000).required(),
  animal_type: Joi.string().trim().allow(null, '').optional(),
  messages: Joi.array()
    .items(
      Joi.object({
        role: Joi.string().valid('user', 'assistant').required(),
        content: Joi.string().trim().min(1).max(2000).required(),
      }),
    )
    .max(12)
    .optional(),
}).required();
