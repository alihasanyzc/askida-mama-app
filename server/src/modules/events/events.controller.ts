import type { Request, Response } from 'express';

import { BadRequestError, UnauthorizedError } from '../../common/errors/base-error.js';
import { successResponse } from '../../common/http/api-response.js';
import { asyncHandler } from '../../lib/index.js';
import { prisma } from '../../config/prisma.js';
import type { CreateEventInput } from './events.type.js';
import { eventsService } from './events.service.js';

function requireUserId(request: Request) {
  if (!request.user?.id) {
    throw new UnauthorizedError('Authenticated user not found');
  }

  return request.user.id;
}

function requireEventId(request: Request) {
  const { eventId } = request.params;

  if (!eventId || Array.isArray(eventId)) {
    throw new BadRequestError('Event id is required');
  }

  return eventId;
}

export const listEvents = asyncHandler(async (request: Request, response: Response) => {
  const data = await eventsService.list(request.user?.id);

  response.status(200).json(
    successResponse({
      message: 'Events fetched successfully',
      data,
    }),
  );
});

export const getEventById = asyncHandler(async (request: Request, response: Response) => {
  const data = await eventsService.getById(requireEventId(request), request.user?.id);

  response.status(200).json(
    successResponse({
      message: 'Event fetched successfully',
      data,
    }),
  );
});

export const createEvent = asyncHandler(async (request: Request, response: Response) => {
  const data = await eventsService.create(
    requireUserId(request),
    request.validatedBody as CreateEventInput,
  );

  response.status(201).json(
    successResponse({
      message: 'Event created successfully',
      data,
    }),
  );
});

export const registerForEvent = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const profile = await prisma.profile.findUnique({
    where: {
      id: userId,
    },
    select: {
      full_name: true,
    },
  });

  if (!profile) {
    throw new UnauthorizedError('Authenticated profile not found');
  }

  const data = await eventsService.register(
    requireEventId(request),
    userId,
    request.user?.email ?? null,
    profile.full_name,
  );

  response.status(201).json(
    successResponse({
      message: 'Event registration created successfully',
      data,
    }),
  );
});
