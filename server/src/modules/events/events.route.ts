import { Router } from 'express';

import {
  authMiddleware,
  optionalAuthMiddleware,
  adminMiddleware,
} from '../../middlewares/auth.middleware.js';
import { validationMiddleware } from '../../middlewares/validation.middleware.js';
import {
  createEvent,
  getEventById,
  listEvents,
  registerForEvent,
} from './events.controller.js';
import { createEventSchema } from './events.schema.js';

const eventsRouter = Router();

eventsRouter.get('/', optionalAuthMiddleware, listEvents);
eventsRouter.get('/:eventId', optionalAuthMiddleware, getEventById);
eventsRouter.post('/', authMiddleware, adminMiddleware, validationMiddleware(createEventSchema), createEvent);
eventsRouter.post('/:eventId/register', authMiddleware, registerForEvent);

export { eventsRouter };
