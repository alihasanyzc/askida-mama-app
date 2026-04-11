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

function requireProfileId(request: Request) {
  const { profileId } = request.params;

  if (!profileId || Array.isArray(profileId)) {
    throw new BadRequestError('Profile id is required');
  }

  return profileId;
}

function requireUsername(request: Request) {
  const { username } = request.params;

  if (!username || Array.isArray(username)) {
    throw new BadRequestError('Username is required');
  }

  return username;
}

function getSearchQuery(request: Request) {
  const { q } = request.query;

  if (Array.isArray(q)) {
    const [firstQuery] = q;
    return typeof firstQuery === 'string' ? firstQuery.trim() : '';
  }

  return typeof q === 'string' ? q.trim() : '';
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

export const searchProfiles = asyncHandler(async (request: Request, response: Response) => {
  const data = await profilesService.searchProfiles(getSearchQuery(request), request.user?.id);

  response.status(200).json(
    successResponse({
      message: 'Profiles searched successfully',
      data,
    }),
  );
});

export const getProfileById = asyncHandler(async (request: Request, response: Response) => {
  const data = await profilesService.getProfileById(requireProfileId(request), request.user?.id);

  response.status(200).json(
    successResponse({
      message: 'Profile fetched successfully',
      data,
    }),
  );
});

export const getProfileByUsername = asyncHandler(async (request: Request, response: Response) => {
  const data = await profilesService.getProfileByUsername(requireUsername(request), request.user?.id);

  response.status(200).json(
    successResponse({
      message: 'Profile fetched successfully',
      data,
    }),
  );
});

export const followProfile = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await profilesService.followProfile(userId, requireProfileId(request));

  response.status(200).json(
    successResponse({
      message: 'Profile followed successfully',
      data,
    }),
  );
});

export const unfollowProfile = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await profilesService.unfollowProfile(userId, requireProfileId(request));

  response.status(200).json(
    successResponse({
      message: 'Profile unfollowed successfully',
      data,
    }),
  );
});

export const removeFollower = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await profilesService.removeFollower(userId, requireProfileId(request));

  response.status(200).json(
    successResponse({
      message: 'Follower removed successfully',
      data,
    }),
  );
});

export const listFollowers = asyncHandler(async (request: Request, response: Response) => {
  const data = await profilesService.listFollowers(requireProfileId(request), request.user?.id);

  response.status(200).json(
    successResponse({
      message: 'Followers fetched successfully',
      data,
    }),
  );
});

export const listFollowing = asyncHandler(async (request: Request, response: Response) => {
  const data = await profilesService.listFollowing(requireProfileId(request), request.user?.id);

  response.status(200).json(
    successResponse({
      message: 'Following fetched successfully',
      data,
    }),
  );
});

export const listProfileAnnouncements = asyncHandler(
  async (request: Request, response: Response) => {
    const data = await profilesService.listAnnouncements(requireProfileId(request));

    response.status(200).json(
      successResponse({
        message: 'Profile announcements fetched successfully',
        data,
      }),
    );
  },
);

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
