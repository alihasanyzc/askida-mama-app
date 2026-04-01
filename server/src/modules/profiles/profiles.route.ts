import { Router } from 'express';

import {
  authMiddleware,
  optionalAuthMiddleware,
} from '../../middlewares/auth.middleware.js';
import { profileImageUploadMiddleware } from '../../middlewares/upload.middleware.js';
import { validationMiddleware } from '../../middlewares/validation.middleware.js';
import {
  followProfile,
  getProfileById,
  getOwnProfile,
  listProfileAnnouncements,
  listFollowers,
  listFollowing,
  unfollowProfile,
  updateOwnProfile,
  uploadAvatar,
  uploadCoverPhoto,
} from './profiles.controller.js';
import { updateProfileSchema } from './profiles.schema.js';

const profilesRouter = Router();

profilesRouter.get('/me', authMiddleware, getOwnProfile);
profilesRouter.get('/:profileId/announcements', optionalAuthMiddleware, listProfileAnnouncements);
profilesRouter.get('/:profileId/followers', optionalAuthMiddleware, listFollowers);
profilesRouter.get('/:profileId/following', optionalAuthMiddleware, listFollowing);
profilesRouter.get('/:profileId', optionalAuthMiddleware, getProfileById);
profilesRouter.post('/:profileId/follow', authMiddleware, followProfile);
profilesRouter.patch('/me', authMiddleware, validationMiddleware(updateProfileSchema), updateOwnProfile);
profilesRouter.post('/me/avatar', authMiddleware, profileImageUploadMiddleware, uploadAvatar);
profilesRouter.post('/me/cover-photo', authMiddleware, profileImageUploadMiddleware, uploadCoverPhoto);
profilesRouter.delete('/:profileId/follow', authMiddleware, unfollowProfile);

export { profilesRouter };
