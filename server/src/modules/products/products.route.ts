import { Router } from 'express';

import { adminMiddleware, authMiddleware } from '../../middlewares/auth.middleware.js';
import { validationMiddleware } from '../../middlewares/validation.middleware.js';
import {
  createProduct,
  createProductDonation,
  deleteProduct,
  getProductById,
  listProducts,
} from './products.controller.js';
import {
  createProductDonationSchema,
  createProductSchema,
} from './products.schema.js';

const productsRouter = Router();

productsRouter.get('/', listProducts);
productsRouter.get('/:productId', getProductById);
productsRouter.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validationMiddleware(createProductSchema),
  createProduct,
);
productsRouter.post(
  '/:productId/donations',
  authMiddleware,
  validationMiddleware(createProductDonationSchema),
  createProductDonation,
);
productsRouter.delete('/:productId', authMiddleware, adminMiddleware, deleteProduct);

export { productsRouter };
