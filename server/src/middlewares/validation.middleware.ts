import type { NextFunction, Request, Response } from 'express';
import type { ObjectSchema } from 'joi';

import { ValidationError } from '../common/errors/base-error.js';

export function validationMiddleware<T>(schema: ObjectSchema<T>) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const payload = request.body ?? {};

    const { error, value } = schema.validate(payload, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(
        new ValidationError('Request body validation failed', {
          fields: error.details.map((detail) => ({
            message: detail.message,
            path: detail.path.join('.'),
          })),
        }),
      );
    }

    request.validatedBody = value;
    next();
  };
}
