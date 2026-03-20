export type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T | null;
  meta: Record<string, unknown> | null;
};

export type ErrorResponse = {
  success: false;
  message: string;
  error: {
    code: string;
    details: unknown;
  };
};

export function successResponse<T>({
  message = 'Request successful',
  data = null,
  meta = null,
}: {
  message?: string;
  data?: T | null;
  meta?: Record<string, unknown> | null;
} = {}): SuccessResponse<T> {
  return {
    success: true,
    message,
    data,
    meta,
  };
}

export function errorResponse({
  message = 'Request failed',
  code = 'INTERNAL_SERVER_ERROR',
  details = null,
}: {
  message?: string;
  code?: string;
  details?: unknown;
} = {}): ErrorResponse {
  return {
    success: false,
    message,
    error: {
      code,
      details,
    },
  };
}
