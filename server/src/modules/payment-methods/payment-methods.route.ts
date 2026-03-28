import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validationMiddleware } from '../../middlewares/validation.middleware.js';
import {
  createPaymentMethod,
  deletePaymentMethod,
  listPaymentMethods,
} from './payment-methods.controller.js';
import { createPaymentMethodSchema } from './payment-methods.schema.js';

const paymentMethodsRouter = Router();

paymentMethodsRouter.get('/', authMiddleware, listPaymentMethods);
paymentMethodsRouter.post(
  '/',
  authMiddleware,
  validationMiddleware(createPaymentMethodSchema),
  createPaymentMethod,
);
paymentMethodsRouter.delete('/:paymentMethodId', authMiddleware, deletePaymentMethod);

export { paymentMethodsRouter };
