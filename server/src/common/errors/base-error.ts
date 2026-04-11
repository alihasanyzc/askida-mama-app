export class BaseError extends Error {
  statusCode: number;
  code: string;
  details: unknown;

  constructor({
    name = 'BaseError',
    message = 'Application error',
    statusCode = 500,
    code = 'INTERNAL_SERVER_ERROR',
    details = null,
  }: {
    name?: string;
    message?: string;
    statusCode?: number;
    code?: string;
    details?: unknown;
  } = {}) {
    super(message);

    this.name = name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class BadRequestError extends BaseError {
  constructor(message = 'Bad request', details: unknown = null) {
    super({
      name: 'BadRequestError',
      message,
      statusCode: 400,
      code: 'BAD_REQUEST',
      details,
    });
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized') {
    super({
      name: 'UnauthorizedError',
      message,
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = 'Forbidden') {
    super({
      name: 'ForbiddenError',
      message,
      statusCode: 403,
      code: 'FORBIDDEN',
    });
  }
}

export class ConflictError extends BaseError {
  constructor(message = 'Conflict', details: unknown = null) {
    super({
      name: 'ConflictError',
      message,
      statusCode: 409,
      code: 'CONFLICT',
      details,
    });
  }
}

export class NotFoundError extends BaseError {
  constructor(message = 'Resource not found') {
    super({
      name: 'NotFoundError',
      message,
      statusCode: 404,
      code: 'NOT_FOUND',
    });
  }
}

export class ValidationError extends BaseError {
  constructor(message = 'Validation failed', details: unknown = null) {
    super({
      name: 'ValidationError',
      message,
      statusCode: 422,
      code: 'VALIDATION_ERROR',
      details,
    });
  }
}

export class ServiceUnavailableError extends BaseError {
  constructor(message = 'Service temporarily unavailable', details: unknown = null) {
    super({
      name: 'ServiceUnavailableError',
      message,
      statusCode: 503,
      code: 'SERVICE_UNAVAILABLE',
      details,
    });
  }
}
