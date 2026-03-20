import type { NextFunction, Request, Response } from 'express';

function stripTrailingControlChars(value: string) {
  return value.replace(/(?:(?:%0A|%0D|%09)|[\r\n\t])+$/gi, '');
}

export function normalizeUrlMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  request.url = stripTrailingControlChars(request.url);
  next();
}
