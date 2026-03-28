import type { Request, Response } from 'express';

import { BadRequestError, UnauthorizedError } from '../../common/errors/base-error.js';
import { successResponse } from '../../common/http/api-response.js';
import { asyncHandler } from '../../lib/index.js';
import type {
  CreateClinicDonationInput,
  CreateClinicInput,
} from './clinics.type.js';
import { clinicsService } from './clinics.service.js';

function requireUserId(request: Request) {
  if (!request.user?.id) {
    throw new UnauthorizedError('Authenticated user not found');
  }

  return request.user.id;
}

function requireClinicId(request: Request) {
  const { clinicId } = request.params;

  if (!clinicId || Array.isArray(clinicId)) {
    throw new BadRequestError('Clinic id is required');
  }

  return clinicId;
}

export const listClinics = asyncHandler(async (request: Request, response: Response) => {
  const city = typeof request.query.city === 'string' ? request.query.city : undefined;
  const district =
    typeof request.query.district === 'string' ? request.query.district : undefined;
  const data = await clinicsService.list({ city, district });

  response.status(200).json(
    successResponse({
      message: 'Clinics fetched successfully',
      data,
    }),
  );
});

export const getClinicById = asyncHandler(async (request: Request, response: Response) => {
  const data = await clinicsService.getById(requireClinicId(request), request.user?.id);

  response.status(200).json(
    successResponse({
      message: 'Clinic fetched successfully',
      data,
    }),
  );
});

export const createClinicDonation = asyncHandler(async (request: Request, response: Response) => {
  const data = await clinicsService.createDonation(
    requireClinicId(request),
    requireUserId(request),
    request.validatedBody as CreateClinicDonationInput,
  );

  response.status(201).json(
    successResponse({
      message: 'Clinic donation created successfully',
      data,
    }),
  );
});

export const createClinic = asyncHandler(async (request: Request, response: Response) => {
  const data = await clinicsService.create(
    requireUserId(request),
    request.validatedBody as CreateClinicInput,
  );

  response.status(201).json(
    successResponse({
      message: 'Clinic created successfully',
      data,
    }),
  );
});

export const deleteClinic = asyncHandler(async (request: Request, response: Response) => {
  await clinicsService.remove(requireClinicId(request));

  response.status(200).json(
    successResponse({
      message: 'Clinic deleted successfully',
      data: null,
    }),
  );
});
