import type { Request, Response } from 'express';

import { UnauthorizedError } from '../../common/errors/base-error.js';
import { successResponse } from '../../common/http/api-response.js';
import { asyncHandler } from '../../lib/index.js';
import type { CreatePostInput, UpdatePostInput } from './posts.type.js';
import { postsService } from './posts.service.js';

function requireUserId(request: Request) {
  if (!request.user?.id) {
    throw new UnauthorizedError('Authenticated user not found');
  }

  return request.user.id;
}

function requirePostId(request: Request) {
  const { postId } = request.params;

  if (!postId || Array.isArray(postId)) {
    throw new UnauthorizedError('Post id is required');
  }

  return postId;
}

export const createPost = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await postsService.create(userId, request.validatedBody as CreatePostInput);

  response.status(201).json(
    successResponse({
      message: 'Post created successfully',
      data,
    }),
  );
});

export const listPosts = asyncHandler(async (_request: Request, response: Response) => {
  const data = await postsService.list();

  response.status(200).json(
    successResponse({
      message: 'Posts fetched successfully',
      data,
    }),
  );
});

export const getPostById = asyncHandler(async (request: Request, response: Response) => {
  const data = await postsService.getById(requirePostId(request));

  response.status(200).json(
    successResponse({
      message: 'Post fetched successfully',
      data,
    }),
  );
});

export const listOwnPosts = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await postsService.listOwn(userId);

  response.status(200).json(
    successResponse({
      message: 'Own posts fetched successfully',
      data,
    }),
  );
});

export const updatePost = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await postsService.update(
    requirePostId(request),
    userId,
    request.validatedBody as UpdatePostInput,
  );

  response.status(200).json(
    successResponse({
      message: 'Post updated successfully',
      data,
    }),
  );
});

export const deletePost = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  await postsService.remove(requirePostId(request), userId);

  response.status(200).json(
    successResponse({
      message: 'Post deleted successfully',
      data: null,
    }),
  );
});
