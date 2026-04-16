import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validationMiddleware } from '../../middlewares/validation.middleware.js';
import { createGeneralDonation } from './donations.controller.js';
import { createGeneralDonationSchema } from './donations.schema.js';

const donationsRouter = Router();

donationsRouter.post(
  '/',
  authMiddleware,
  validationMiddleware(createGeneralDonationSchema),
  createGeneralDonation,
);

export { donationsRouter };
