import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validationMiddleware } from '../../middlewares/validation.middleware.js';
import { loginSchema, registerSchema } from './auth.schema.js';
import { login, register, verifyToken } from './auth.controller.js';

const authRouter = Router();

authRouter.post('/register', validationMiddleware(registerSchema), register);
authRouter.post('/login', validationMiddleware(loginSchema), login);
authRouter.get('/verify', authMiddleware, verifyToken);

export { authRouter };
