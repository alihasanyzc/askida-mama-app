import { Router } from 'express';

import {
  authMiddleware,
  optionalAuthMiddleware,
} from '../../middlewares/auth.middleware.js';
import { validationMiddleware } from '../../middlewares/validation.middleware.js';
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
  listAnnouncements,
  updateAnnouncement,
} from './announcements.controller.js';
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from './announcements.schema.js';

const announcementsRouter = Router();

announcementsRouter.get('/', optionalAuthMiddleware, listAnnouncements);
announcementsRouter.get('/:announcementId', optionalAuthMiddleware, getAnnouncementById);
announcementsRouter.post(
  '/',
  authMiddleware,
  validationMiddleware(createAnnouncementSchema),
  createAnnouncement,
);
announcementsRouter.patch(
  '/:announcementId',
  authMiddleware,
  validationMiddleware(updateAnnouncementSchema),
  updateAnnouncement,
);
announcementsRouter.delete('/:announcementId', authMiddleware, deleteAnnouncement);

export { announcementsRouter };
