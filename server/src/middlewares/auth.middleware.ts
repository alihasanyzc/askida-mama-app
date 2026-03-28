import type { NextFunction, Request, Response } from 'express';

import { ForbiddenError, UnauthorizedError } from '../common/errors/base-error.js';
import { prisma } from '../config/prisma.js';
import { supabaseAdmin } from '../config/supabase.js';

function getTokenFromRequest(request: Request) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice('Bearer '.length).trim();
}

async function resolveAuthenticatedUser(request: Request) {
  const token = getTokenFromRequest(request);

  if (!token) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    throw new UnauthorizedError('Invalid or expired authorization token');
  }

  const profile = await prisma.profile.findUnique({
    where: {
      id: user.id,
    },
    select: {
      role: true,
    },
  });

  if (!profile) {
    throw new UnauthorizedError('Authenticated profile not found');
  }

  return {
    id: user.id,
    email: user.email ?? null,
    role: profile.role,
    raw: user,
  };
}

export async function authMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  try {
    const user = await resolveAuthenticatedUser(request);

    if (!user) {
      throw new UnauthorizedError('Authorization token is required');
    }

    request.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuthMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  try {
    const user = await resolveAuthenticatedUser(request);

    if (user) {
      request.user = user;
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function adminMiddleware(request: Request, _response: Response, next: NextFunction) {
  if (!request.user?.id) {
    return next(new UnauthorizedError('Authorization token is required'));
  }

  if (request.user.role !== 'admin') {
    return next(new ForbiddenError('Admin access is required'));
  }

  next();
}
