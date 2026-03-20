import type { Request, Response } from 'express';

import { successResponse } from '../../common/http/api-response.js';
import { asyncHandler } from '../../lib/index.js';
import type { TemplateCreateInput } from './template.type.js';
import { templateService } from './template.service.js';

export const getTemplateStatus = asyncHandler(async (_request: Request, response: Response) => {
  const data = await templateService.getStatus();

  response.status(200).json(
    successResponse({
      message: 'Template module is ready',
      data,
    }),
  );
});

export const createTemplate = asyncHandler(async (request: Request, response: Response) => {
  const data = await templateService.create(
    request.validatedBody as TemplateCreateInput,
  );

  response.status(201).json(
    successResponse({
      message: 'Template payload accepted',
      data,
    }),
  );
});
