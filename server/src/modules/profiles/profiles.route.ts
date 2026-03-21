import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { profileImageUploadMiddleware } from '../../middlewares/upload.middleware.js';
import { validationMiddleware } from '../../middlewares/validation.middleware.js';
import {
  getOwnProfile,
  updateOwnProfile,
  uploadAvatar,
  uploadCoverPhoto,
} from './profiles.controller.js';
import { updateProfileSchema } from './profiles.schema.js';

const profilesRouter = Router();

profilesRouter.get('/me', authMiddleware, getOwnProfile);
profilesRouter.patch('/me', authMiddleware, validationMiddleware(updateProfileSchema), updateOwnProfile);
profilesRouter.post('/me/avatar', authMiddleware, profileImageUploadMiddleware, uploadAvatar);
profilesRouter.post('/me/cover-photo', authMiddleware, profileImageUploadMiddleware, uploadCoverPhoto);

export { profilesRouter };
