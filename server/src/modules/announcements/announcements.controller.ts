import type { Request, Response } from 'express';

import { BadRequestError, UnauthorizedError } from '../../common/errors/base-error.js';
import { successResponse } from '../../common/http/api-response.js';
import { asyncHandler } from '../../lib/index.js';
import type {
  AnnouncementCategory,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from './announcements.type.js';
import { announcementsService } from './announcements.service.js';

const allowedCategories = new Set<AnnouncementCategory>([
  'injured',
  'report',
  'adoption',
  'lost',
]);

function requireUserId(request: Request) {
  if (!request.user?.id) {
    throw new UnauthorizedError('Authenticated user not found');
  }

  return request.user.id;
}

function requireAnnouncementId(request: Request) {
  const { announcementId } = request.params;

  if (!announcementId || Array.isArray(announcementId)) {
    throw new BadRequestError('Announcement id is required');
  }

  return announcementId;
}

function getOptionalFilter(value: unknown) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

function getCategoryFilter(value: unknown): AnnouncementCategory | undefined {
  const filter = getOptionalFilter(value);

  if (!filter) {
    return undefined;
  }

  if (!allowedCategories.has(filter as AnnouncementCategory)) {
    throw new BadRequestError('Category filter is invalid');
  }

  return filter as AnnouncementCategory;
}

export const listAnnouncements = asyncHandler(async (request: Request, response: Response) => {
  const data = await announcementsService.list({
    category: getCategoryFilter(request.query.category),
    city: getOptionalFilter(request.query.city),
    district: getOptionalFilter(request.query.district),
  });

  response.status(200).json(
    successResponse({
      message: 'Announcements fetched successfully',
      data,
    }),
  );
});

export const getAnnouncementById = asyncHandler(async (request: Request, response: Response) => {
  const data = await announcementsService.getById(requireAnnouncementId(request));

  response.status(200).json(
    successResponse({
      message: 'Announcement fetched successfully',
      data,
    }),
  );
});

export const createAnnouncement = asyncHandler(async (request: Request, response: Response) => {
  const data = await announcementsService.create(
    requireUserId(request),
    request.validatedBody as CreateAnnouncementInput,
  );

  response.status(201).json(
    successResponse({
      message: 'Announcement created successfully',
      data,
    }),
  );
});

export const updateAnnouncement = asyncHandler(async (request: Request, response: Response) => {
  const data = await announcementsService.update(
    requireAnnouncementId(request),
    requireUserId(request),
    request.validatedBody as UpdateAnnouncementInput,
  );

  response.status(200).json(
    successResponse({
      message: 'Announcement updated successfully',
      data,
    }),
  );
});

export const deleteAnnouncement = asyncHandler(async (request: Request, response: Response) => {
  await announcementsService.remove(requireAnnouncementId(request), requireUserId(request));

  response.status(200).json(
    successResponse({
      message: 'Announcement deleted successfully',
      data: null,
    }),
  );
});
