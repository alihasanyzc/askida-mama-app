import type { Request, Response } from 'express';

import { UnauthorizedError } from '../../common/errors/base-error.js';
import { successResponse } from '../../common/http/api-response.js';
import { asyncHandler } from '../../lib/index.js';
import type { UpdateProfileInput } from './profiles.type.js';
import { profilesService } from './profiles.service.js';

function requireUserId(request: Request) {
  if (!request.user?.id) {
    throw new UnauthorizedError('Authenticated user not found');
  }

  return request.user.id;
}

export const getOwnProfile = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await profilesService.getOwnProfile(userId);

  response.status(200).json(
    successResponse({
      message: 'Profile fetched successfully',
      data,
    }),
  );
});

export const updateOwnProfile = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await profilesService.updateOwnProfile(
    userId,
    request.validatedBody as UpdateProfileInput,
  );

  response.status(200).json(
    successResponse({
      message: 'Profile updated successfully',
      data,
    }),
  );
});
