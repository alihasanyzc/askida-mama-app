import { Router } from 'express';

import {
  adminMiddleware,
  authMiddleware,
  optionalAuthMiddleware,
} from '../../middlewares/auth.middleware.js';
import { validationMiddleware } from '../../middlewares/validation.middleware.js';
import {
  createClinic,
  createClinicDonation,
  deleteClinic,
  getClinicById,
  listClinics,
} from './clinics.controller.js';
import {
  createClinicDonationSchema,
  createClinicSchema,
} from './clinics.schema.js';

const clinicsRouter = Router();

clinicsRouter.get('/', optionalAuthMiddleware, listClinics);
clinicsRouter.get('/:clinicId', optionalAuthMiddleware, getClinicById);
clinicsRouter.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validationMiddleware(createClinicSchema),
  createClinic,
);
clinicsRouter.post(
  '/:clinicId/donations',
  authMiddleware,
  validationMiddleware(createClinicDonationSchema),
  createClinicDonation,
);
clinicsRouter.delete('/:clinicId', authMiddleware, adminMiddleware, deleteClinic);

export { clinicsRouter };
