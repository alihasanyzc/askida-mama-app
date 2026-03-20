import { Router } from 'express';

import { authRouter } from '../modules/auth/auth.route.js';
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
router.use('/posts', postsRouter);
router.use('/profiles', profilesRouter);
router.use('/template', templateRouter);

export { router };
