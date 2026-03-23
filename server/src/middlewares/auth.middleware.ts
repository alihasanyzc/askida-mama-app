import type { NextFunction, Request, Response } from 'express';

import { UnauthorizedError } from '../common/errors/base-error.js';
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

  return {
    id: user.id,
    email: user.email ?? null,
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
