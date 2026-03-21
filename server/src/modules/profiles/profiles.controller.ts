import type { Request, Response } from 'express';

import { BadRequestError, UnauthorizedError } from '../../common/errors/base-error.js';
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

function requireUploadedFile(request: Request) {
  if (!request.file) {
    throw new BadRequestError('Image file is required');
  }

  return request.file;
}

export const uploadAvatar = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await profilesService.uploadAvatar(userId, requireUploadedFile(request));

  response.status(200).json(
    successResponse({
      message: 'Avatar uploaded successfully',
      data,
    }),
  );
});

export const uploadCoverPhoto = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await profilesService.uploadCoverPhoto(userId, requireUploadedFile(request));

  response.status(200).json(
    successResponse({
      message: 'Cover photo uploaded successfully',
      data,
    }),
  );
});
