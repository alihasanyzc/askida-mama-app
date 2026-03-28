import { Router } from 'express';

import { authRouter } from '../modules/auth/auth.route.js';
import { bowlsRouter } from '../modules/bowls/bowls.route.js';
import { clinicsRouter } from '../modules/clinics/clinics.route.js';
import { paymentMethodsRouter } from '../modules/payment-methods/payment-methods.route.js';
import { productsRouter } from '../modules/products/products.route.js';
import { postsRouter } from '../modules/posts/posts.route.js';
import { profilesRouter } from '../modules/profiles/profiles.route.js';
import { templateRouter } from '../modules/template/template.route.js';

const router = Router();

router.get('/', (_request, response) => {
  response.status(200).json({
    success: true,
    message: 'API is ready',
  });
});

router.use('/auth', authRouter);
router.use('/bowls', bowlsRouter);
router.use('/clinics', clinicsRouter);
router.use('/payment-methods', paymentMethodsRouter);
router.use('/products', productsRouter);
router.use('/posts', postsRouter);
router.use('/profiles', profilesRouter);
router.use('/template', templateRouter);

export { router };
