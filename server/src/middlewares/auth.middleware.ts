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

export async function authMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedError('Authorization token is required');
    }

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedError('Invalid or expired authorization token');
    }

    request.user = {
      id: user.id,
      email: user.email ?? null,
      raw: user,
    };

    next();
  } catch (error) {
    next(error);
  }
}
