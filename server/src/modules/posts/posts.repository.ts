import { Prisma } from '@prisma/client';

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../../common/errors/base-error.js';
import { prisma } from '../../config/prisma.js';
import type { CreatePostInput, PostRecord, UpdatePostInput } from './posts.type.js';

function mapPost(record: {
  id: string;
  user_id: string;
  image_url: string;
  content: string;
  category: string | null;
  is_priority: boolean;
  created_at: Date | null;
  updated_at: Date | null;
}): PostRecord {
  return {
    ...record,
    created_at: record.created_at?.toISOString() ?? null,
    updated_at: record.updated_at?.toISOString() ?? null,
  };
}

function normalizePostError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return new NotFoundError('Post not found');
    }
  }

  if (error instanceof Error) {
    return new BadRequestError(error.message);
  }

  return new BadRequestError('Post query failed');
}

export const postsRepository = {
  async create(userId: string, payload: CreatePostInput): Promise<PostRecord> {
    try {
      const data = await prisma.post.create({
        data: {
          user_id: userId,
          image_url: payload.image_url,
          content: payload.content,
          category: payload.category === '' ? null : (payload.category ?? null),
        },
      });

      return mapPost(data);
    } catch (error) {
      throw normalizePostError(error);
    }
  },

  async findMany(): Promise<PostRecord[]> {
    const data = await prisma.post.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    return data.map(mapPost);
  },

  async findById(postId: string): Promise<PostRecord> {
    const data = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!data) {
      throw new NotFoundError('Post not found');
    }

    return mapPost(data);
  },

  async findByUserId(userId: string): Promise<PostRecord[]> {
    const data = await prisma.post.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return data.map(mapPost);
  },

  async update(postId: string, userId: string, payload: UpdatePostInput): Promise<PostRecord> {
    const existing = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Post not found');
    }

    if (existing.user_id !== userId) {
      throw new ForbiddenError('You can only update your own posts');
    }

    try {
      const data = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          image_url: payload.image_url,
          content: payload.content,
          category:
            payload.category === undefined
              ? undefined
              : payload.category === ''
                ? null
                : payload.category,
        },
      });

      return mapPost(data);
    } catch (error) {
      throw normalizePostError(error);
    }
  },

  async remove(postId: string, userId: string): Promise<void> {
    const existing = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Post not found');
    }

    if (existing.user_id !== userId) {
      throw new ForbiddenError('You can only delete your own posts');
    }

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
  },
};
