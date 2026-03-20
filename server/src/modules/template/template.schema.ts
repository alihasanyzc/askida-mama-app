import Joi from 'joi';

import type { TemplateCreateInput } from './template.type.js';

export const templateCreateSchema = Joi.object<TemplateCreateInput>({
  name: Joi.string().trim().min(2).max(100).required(),
});
