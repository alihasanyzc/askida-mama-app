import type { Request, Response } from 'express';

import { successResponse } from '../../common/http/api-response.js';
import { asyncHandler } from '../../lib/index.js';
import type { LoginInput, RegisterInput } from './auth.type.js';
import { authService } from './auth.service.js';

export const register = asyncHandler(async (request: Request, response: Response) => {
  const data = await authService.register(request.validatedBody as RegisterInput);

  response.status(201).json(
    successResponse({
      message: 'User registered successfully',
      data,
    }),
  );
});

export const login = asyncHandler(async (request: Request, response: Response) => {
  const data = await authService.login(request.validatedBody as LoginInput);

  response.status(200).json(
    successResponse({
      message: 'Login successful',
      data,
    }),
  );
});

export const verifyToken = asyncHandler(async (request: Request, response: Response) => {
  response.status(200).json(
    successResponse({
      message: 'Token is valid',
      data: {
        user: request.user
          ? {
              id: request.user.id,
              email: request.user.email,
            }
          : null,
      },
    }),
  );
});
