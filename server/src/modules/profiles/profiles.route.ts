import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validationMiddleware } from '../../middlewares/validation.middleware.js';
import { getOwnProfile, updateOwnProfile } from './profiles.controller.js';
import { updateProfileSchema } from './profiles.schema.js';

const profilesRouter = Router();

profilesRouter.get('/me', authMiddleware, getOwnProfile);
profilesRouter.patch('/me', authMiddleware, validationMiddleware(updateProfileSchema), updateOwnProfile);

export { profilesRouter };
