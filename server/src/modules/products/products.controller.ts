import type { Request, Response } from 'express';

import { BadRequestError, UnauthorizedError } from '../../common/errors/base-error.js';
import { successResponse } from '../../common/http/api-response.js';
import { asyncHandler } from '../../lib/index.js';
import type {
  CreateProductDonationInput,
  CreateProductInput,
} from './products.type.js';
import { productsService } from './products.service.js';

function requireUserId(request: Request) {
  if (!request.user?.id) {
    throw new UnauthorizedError('Authenticated user not found');
  }

  return request.user.id;
}

function requireProductId(request: Request) {
  const { productId } = request.params;

  if (!productId || Array.isArray(productId)) {
    throw new BadRequestError('Product id is required');
  }

  return productId;
}

export const listProducts = asyncHandler(async (request: Request, response: Response) => {
  const animalType =
    typeof request.query.animal_type === 'string' ? request.query.animal_type : undefined;
  const data = await productsService.list(animalType);

  response.status(200).json(
    successResponse({
      message: 'Products fetched successfully',
      data,
    }),
  );
});

export const getProductById = asyncHandler(async (request: Request, response: Response) => {
  const data = await productsService.getById(requireProductId(request));

  response.status(200).json(
    successResponse({
      message: 'Product fetched successfully',
      data,
    }),
  );
});

export const createProduct = asyncHandler(async (request: Request, response: Response) => {
  const data = await productsService.create(
    requireUserId(request),
    request.validatedBody as CreateProductInput,
  );

  response.status(201).json(
    successResponse({
      message: 'Product created successfully',
      data,
    }),
  );
});

export const createProductDonation = asyncHandler(
  async (request: Request, response: Response) => {
    const data = await productsService.createDonation(
      requireProductId(request),
      requireUserId(request),
      request.validatedBody as CreateProductDonationInput,
    );

    response.status(201).json(
      successResponse({
        message: 'Product donation created successfully',
        data,
      }),
    );
  },
);

export const deleteProduct = asyncHandler(async (request: Request, response: Response) => {
  await productsService.remove(requireProductId(request));

  response.status(200).json(
    successResponse({
      message: 'Product deleted successfully',
      data: null,
    }),
  );
});
