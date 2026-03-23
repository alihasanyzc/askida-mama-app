import type { Request, Response } from 'express';

import { BadRequestError, UnauthorizedError } from '../../common/errors/base-error.js';
import { successResponse } from '../../common/http/api-response.js';
import { asyncHandler } from '../../lib/index.js';
import type {
  CreatePostCommentInput,
  CreatePostInput,
  UpdatePostInput,
} from './posts.type.js';
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

function requireCommentId(request: Request) {
  const { commentId } = request.params;

  if (!commentId || Array.isArray(commentId)) {
    throw new BadRequestError('Comment id is required');
  }

  return commentId;
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
  const viewerId = _request.user?.id;
  const data = await postsService.list(viewerId);

  response.status(200).json(
    successResponse({
      message: 'Posts fetched successfully',
      data,
    }),
  );
});

export const listFeedPosts = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await postsService.listFeed(userId);

  response.status(200).json(
    successResponse({
      message: 'Feed posts fetched successfully',
      data,
    }),
  );
});

export const getPostById = asyncHandler(async (request: Request, response: Response) => {
  const data = await postsService.getById(requirePostId(request), request.user?.id);

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

export const listSavedPosts = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await postsService.listSaved(userId);

  response.status(200).json(
    successResponse({
      message: 'Saved posts fetched successfully',
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

export const likePost = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await postsService.like(requirePostId(request), userId);

  response.status(200).json(
    successResponse({
      message: 'Post liked successfully',
      data,
    }),
  );
});

export const unlikePost = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await postsService.unlike(requirePostId(request), userId);

  response.status(200).json(
    successResponse({
      message: 'Post unliked successfully',
      data,
    }),
  );
});

export const savePost = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await postsService.save(requirePostId(request), userId);

  response.status(200).json(
    successResponse({
      message: 'Post saved successfully',
      data,
    }),
  );
});

export const unsavePost = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await postsService.unsave(requirePostId(request), userId);

  response.status(200).json(
    successResponse({
      message: 'Post unsaved successfully',
      data,
    }),
  );
});

export const listPostComments = asyncHandler(async (request: Request, response: Response) => {
  const data = await postsService.listComments(requirePostId(request), request.user?.id);

  response.status(200).json(
    successResponse({
      message: 'Post comments fetched successfully',
      data,
    }),
  );
});

export const createPostComment = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await postsService.createComment(
    requirePostId(request),
    userId,
    request.validatedBody as CreatePostCommentInput,
  );

  response.status(201).json(
    successResponse({
      message: 'Post comment created successfully',
      data,
    }),
  );
});

export const deletePostComment = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  await postsService.removeComment(requireCommentId(request), userId);

  response.status(200).json(
    successResponse({
      message: 'Post comment deleted successfully',
      data: null,
    }),
  );
});

export const likeComment = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await postsService.likeComment(requireCommentId(request), userId);

  response.status(200).json(
    successResponse({
      message: 'Comment liked successfully',
      data,
    }),
  );
});

export const unlikeComment = asyncHandler(async (request: Request, response: Response) => {
  const userId = requireUserId(request);
  const data = await postsService.unlikeComment(requireCommentId(request), userId);

  response.status(200).json(
    successResponse({
      message: 'Comment unliked successfully',
      data,
    }),
  );
});

export const listPostLikes = asyncHandler(async (request: Request, response: Response) => {
  const data = await postsService.listLikes(requirePostId(request));

  response.status(200).json(
    successResponse({
      message: 'Post likes fetched successfully',
      data,
    }),
  );
});
