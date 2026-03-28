import type { Request, Response } from 'express';

import { BadRequestError, UnauthorizedError } from '../../common/errors/base-error.js';
import { successResponse } from '../../common/http/api-response.js';
import { asyncHandler } from '../../lib/index.js';
import type { CreatePaymentMethodInput } from './payment-methods.type.js';
import { paymentMethodsService } from './payment-methods.service.js';

function requireUserId(request: Request) {
  if (!request.user?.id) {
    throw new UnauthorizedError('Authenticated user not found');
  }

  return request.user.id;
}

function requirePaymentMethodId(request: Request) {
  const { paymentMethodId } = request.params;

  if (!paymentMethodId || Array.isArray(paymentMethodId)) {
    throw new BadRequestError('Payment method id is required');
  }

  return paymentMethodId;
}

export const listPaymentMethods = asyncHandler(async (request: Request, response: Response) => {
  const data = await paymentMethodsService.list(requireUserId(request));

  response.status(200).json(
    successResponse({
      message: 'Payment methods fetched successfully',
      data,
    }),
  );
});

export const createPaymentMethod = asyncHandler(async (request: Request, response: Response) => {
  const data = await paymentMethodsService.create(
    requireUserId(request),
    request.validatedBody as CreatePaymentMethodInput,
  );

  response.status(201).json(
    successResponse({
      message: 'Payment method created successfully',
      data,
    }),
  );
});

export const deletePaymentMethod = asyncHandler(async (request: Request, response: Response) => {
  await paymentMethodsService.remove(
    requirePaymentMethodId(request),
    requireUserId(request),
  );

  response.status(200).json(
    successResponse({
      message: 'Payment method deleted successfully',
      data: null,
    }),
  );
});
