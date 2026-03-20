import { Router } from 'express';

import { createTemplate, getTemplateStatus } from './template.controller.js';
import { templateCreateSchema } from './template.schema.js';
import { validationMiddleware } from '../../middlewares/validation.middleware.js';

const templateRouter = Router();

templateRouter.get('/', getTemplateStatus);
templateRouter.post('/', validationMiddleware(templateCreateSchema), createTemplate);

export { templateRouter };
