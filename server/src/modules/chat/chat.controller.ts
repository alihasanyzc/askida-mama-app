import type { Request, Response } from 'express';

import { successResponse } from '../../common/http/api-response.js';
import { asyncHandler } from '../../lib/index.js';
import type { ChatRespondInput } from './chat.type.js';
import { chatService } from './chat.service.js';

export const getChatStatus = asyncHandler(async (_request: Request, response: Response) => {
  const data = await chatService.getStatus();

  response.status(200).json(
    successResponse({
      message: 'Chat module is ready',
      data,
    }),
  );
});

export const respondChat = asyncHandler(async (request: Request, response: Response) => {
  const data = await chatService.respond(request.validatedBody as ChatRespondInput);

  response.status(200).json(
    successResponse({
      message: 'Chat response generated successfully',
      data,
    }),
  );
});
