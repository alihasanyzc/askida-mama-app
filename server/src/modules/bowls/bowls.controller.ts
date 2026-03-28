import type { Request, Response } from 'express';

import { BadRequestError, UnauthorizedError } from '../../common/errors/base-error.js';
import { successResponse } from '../../common/http/api-response.js';
import { asyncHandler } from '../../lib/index.js';
import type {
  CreateBowlDonationInput,
  UpdateBowlAddressInput,
  UpdateBowlStatusInput,
} from './bowls.type.js';
import { bowlsService } from './bowls.service.js';

function requireBowlId(request: Request) {
  const { bowlId } = request.params;

  if (!bowlId || Array.isArray(bowlId)) {
    throw new BadRequestError('Bowl id is required');
  }

  return bowlId;
}

function requireQrCode(request: Request) {
  const { qrCode } = request.params;

  if (!qrCode || Array.isArray(qrCode)) {
    throw new BadRequestError('QR code is required');
  }

  return qrCode;
}

function requireUserId(request: Request) {
  if (!request.user?.id) {
    throw new UnauthorizedError('Authenticated user not found');
  }

  return request.user.id;
}

export const listMapBowls = asyncHandler(async (_request: Request, response: Response) => {
  const data = await bowlsService.listMapBowls();

  response.status(200).json(
    successResponse({
      message: 'Bowls fetched successfully',
      data,
    }),
  );
});

export const getBowlDetail = asyncHandler(async (request: Request, response: Response) => {
  const data = await bowlsService.getBowlDetail(requireBowlId(request), request.user?.id);

  response.status(200).json(
    successResponse({
      message: 'Bowl fetched successfully',
      data,
    }),
  );
});

export const getBowlDetailByQrCode = asyncHandler(async (request: Request, response: Response) => {
  const data = await bowlsService.getBowlDetailByQrCode(requireQrCode(request), request.user?.id);

  response.status(200).json(
    successResponse({
      message: 'Bowl fetched successfully',
      data,
    }),
  );
});

export const updateBowlStatus = asyncHandler(async (request: Request, response: Response) => {
  const data = await bowlsService.updateStatus(
    requireBowlId(request),
    requireUserId(request),
    request.validatedBody as UpdateBowlStatusInput,
  );

  response.status(200).json(
    successResponse({
      message: 'Bowl status updated successfully',
      data,
    }),
  );
});

export const updateBowlAddress = asyncHandler(async (request: Request, response: Response) => {
  const data = await bowlsService.updateAddress(
    requireBowlId(request),
    requireUserId(request),
    request.validatedBody as UpdateBowlAddressInput,
  );

  response.status(200).json(
    successResponse({
      message: 'Bowl address updated successfully',
      data,
    }),
  );
});

export const createBowlDonation = asyncHandler(async (request: Request, response: Response) => {
  const data = await bowlsService.createDonation(
    requireBowlId(request),
    requireUserId(request),
    request.validatedBody as CreateBowlDonationInput,
  );

  response.status(201).json(
    successResponse({
      message: 'Bowl donation created successfully',
      data,
    }),
  );
});
