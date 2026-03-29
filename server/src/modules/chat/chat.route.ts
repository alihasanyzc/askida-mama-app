import { Router } from 'express';

import { validationMiddleware } from '../../middlewares/validation.middleware.js';
import { getChatStatus, respondChat } from './chat.controller.js';
import { chatRespondSchema } from './chat.schema.js';

const chatRouter = Router();

chatRouter.get('/', getChatStatus);
chatRouter.post('/respond', validationMiddleware(chatRespondSchema), respondChat);

export { chatRouter };
