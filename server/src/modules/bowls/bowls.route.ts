import { Router } from 'express';

import {
  authMiddleware,
  optionalAuthMiddleware,
} from '../../middlewares/auth.middleware.js';
import { validationMiddleware } from '../../middlewares/validation.middleware.js';
import {
  createBowlDonation,
  getBowlDetail,
  getBowlDetailByQrCode,
  listMapBowls,
  updateBowlAddress,
  updateBowlStatus,
} from './bowls.controller.js';
import {
  createBowlDonationSchema,
  updateBowlAddressSchema,
  updateBowlStatusSchema,
} from './bowls.schema.js';

const bowlsRouter = Router();

bowlsRouter.get('/', listMapBowls);
bowlsRouter.get('/qr/:qrCode', optionalAuthMiddleware, getBowlDetailByQrCode);
bowlsRouter.get('/:bowlId', optionalAuthMiddleware, getBowlDetail);
bowlsRouter.patch(
  '/:bowlId/status',
  authMiddleware,
  validationMiddleware(updateBowlStatusSchema),
  updateBowlStatus,
);
bowlsRouter.patch(
  '/:bowlId/address',
  authMiddleware,
  validationMiddleware(updateBowlAddressSchema),
  updateBowlAddress,
);
bowlsRouter.post(
  '/:bowlId/donations',
  authMiddleware,
  validationMiddleware(createBowlDonationSchema),
  createBowlDonation,
);

export { bowlsRouter };
