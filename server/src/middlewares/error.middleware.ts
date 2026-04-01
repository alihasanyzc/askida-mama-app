import type { NextFunction, Request, Response } from 'express';

import { BadRequestError, BaseError, NotFoundError } from '../common/errors/base-error.js';
import { errorResponse } from '../common/http/api-response.js';
import { env } from '../config/env.js';

export function notFoundMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  next(new NotFoundError(`Route not found: ${request.method} ${request.originalUrl}`));
}

export function errorMiddleware(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  const bodyParserSyntaxError =
    error instanceof SyntaxError &&
    'status' in error &&
    typeof error.status === 'number' &&
    error.status === 400;

  const normalizedError =
    bodyParserSyntaxError
      ? new BadRequestError('Malformed JSON request body')
      : error instanceof BaseError
      ? error
      : new BaseError({
          message: error instanceof Error ? error.message : 'Unexpected error',
        });

  const payload = errorResponse({
    message: normalizedError.message,
    code: normalizedError.code,
    details:
      env.NODE_ENV === 'production'
        ? normalizedError.details
        : {
            ...(normalizedError.details &&
            typeof normalizedError.details === 'object' &&
            !Array.isArray(normalizedError.details)
              ? normalizedError.details
              : { details: normalizedError.details }),
            stack: normalizedError.stack,
          },
  });

  response.status(normalizedError.statusCode).json(payload);
}
