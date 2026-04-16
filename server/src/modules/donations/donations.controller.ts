import type { Request, Response } from 'express';

import { UnauthorizedError } from '../../common/errors/base-error.js';
import { successResponse } from '../../common/http/api-response.js';
import { asyncHandler } from '../../lib/index.js';
import type { CreateGeneralDonationInput } from './donations.type.js';
import { donationsService } from './donations.service.js';

function requireUserId(request: Request) {
  if (!request.user?.id) {
    throw new UnauthorizedError('Authenticated user not found');
  }

  return request.user.id;
}

export const createGeneralDonation = asyncHandler(async (request: Request, response: Response) => {
  const data = await donationsService.createGeneralDonation(
    requireUserId(request),
    request.validatedBody as CreateGeneralDonationInput,
  );

  response.status(201).json(
    successResponse({
      message: 'Donation created successfully',
      data,
    }),
  );
});
