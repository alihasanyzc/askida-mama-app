import { Prisma } from '@prisma/client';

import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../../common/errors/base-error.js';
import { prisma } from '../../config/prisma.js';
import type {
  CreatePostCommentInput,
  CreatePostInput,
  PostAuthorRecord,
  PostCommentRecord,
  PostLikeUserRecord,
  PostRecord,
  UpdatePostInput,
} from './posts.type.js';

function mapAuthor(record: {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
}): PostAuthorRecord {
  return record;
}

function mapLikeUser(record: {
  user: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string | null;
  };
}): PostLikeUserRecord {
  return mapAuthor(record.user);
}

function mapPost(record: {
  id: string;
  user_id: string;
  image_url: string;
  content: string;
  category: string | null;
  is_priority: boolean;
  created_at: Date | null;
  updated_at: Date | null;
  user: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string | null;
  };
  _count: {
    post_likes: number;
    post_comments: number;
  };
  post_likes?: Array<{ user_id: string }>;
  post_saves?: Array<{ user_id: string }>;
}): PostRecord {
  return {
    id: record.id,
    user_id: record.user_id,
    image_url: record.image_url,
    thumbnail_url: record.image_url,
    content: record.content,
    category: record.category,
    is_priority: record.is_priority,
    created_at: record.created_at?.toISOString() ?? null,
    updated_at: record.updated_at?.toISOString() ?? null,
    author: mapAuthor(record.user),
    likes_count: record._count.post_likes,
    comments_count: record._count.post_comments,
    is_liked: Boolean(record.post_likes?.length),
    is_saved: Boolean(record.post_saves?.length),
  };
}

function mapComment(record: {
  id: string;
  post_id: string;
  user_id: string;
  text: string;
  created_at: Date | null;
  user: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string | null;
  };
  _count: {
    comment_likes: number;
  };
  comment_likes?: Array<{ user_id: string }>;
}): PostCommentRecord {
  return {
    id: record.id,
    post_id: record.post_id,
    user_id: record.user_id,
    text: record.text,
    created_at: record.created_at?.toISOString() ?? null,
    author: mapAuthor(record.user),
    likes_count: record._count.comment_likes,
    is_liked: Boolean(record.comment_likes?.length),
  };
}

function normalizePostError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return new NotFoundError('Post not found');
    }

    if (error.code === 'P2002') {
      return new ConflictError('Post action conflicts with an existing record', {
        target: error.meta?.target,
      });
    }
  }

  if (error instanceof Error) {
    return new BadRequestError(error.message);
  }

  return new BadRequestError('Post query failed');
}

const postInclude = (viewerId?: string) =>
  ({
    user: {
      select: {
        id: true,
        full_name: true,
        username: true,
        avatar_url: true,
      },
    },
    _count: {
      select: {
        post_likes: true,
        post_comments: true,
      },
    },
    ...(viewerId
      ? {
          post_likes: {
            where: {
              user_id: viewerId,
            },
            select: {
              user_id: true,
            },
            take: 1,
          },
          post_saves: {
            where: {
              user_id: viewerId,
            },
            select: {
              user_id: true,
            },
            take: 1,
          },
        }
      : {}),
  }) satisfies Prisma.PostInclude;

const commentInclude = (viewerId?: string) =>
  ({
    user: {
      select: {
        id: true,
        full_name: true,
        username: true,
        avatar_url: true,
      },
    },
    _count: {
      select: {
        comment_likes: true,
      },
    },
    ...(viewerId
      ? {
          comment_likes: {
            where: {
              user_id: viewerId,
            },
            select: {
              user_id: true,
            },
            take: 1,
          },
        }
      : {}),
  }) satisfies Prisma.PostCommentInclude;

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
        include: postInclude(userId),
      });

      return mapPost(data);
    } catch (error) {
      throw normalizePostError(error);
    }
  },

  async findMany(viewerId?: string): Promise<PostRecord[]> {
    const data = await prisma.post.findMany({
      include: postInclude(viewerId),
      orderBy: {
        created_at: 'desc',
      },
    });

    return data.map(mapPost);
  },

  async findFeed(userId: string): Promise<PostRecord[]> {
    const data = await prisma.post.findMany({
      where: {
        user: {
          OR: [
            {
              id: userId,
            },
            {
              follows_as_following: {
                some: {
                  follower_id: userId,
                },
              },
            },
          ],
        },
      },
      include: postInclude(userId),
      orderBy: {
        created_at: 'desc',
      },
    });

    return data.map(mapPost);
  },

  async findById(postId: string, viewerId?: string): Promise<PostRecord> {
    const data = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: postInclude(viewerId),
    });

    if (!data) {
      throw new NotFoundError('Post not found');
    }

    return mapPost(data);
  },

  async findByUserId(userId: string, viewerId?: string): Promise<PostRecord[]> {
    const data = await prisma.post.findMany({
      where: {
        user_id: userId,
      },
      include: postInclude(viewerId),
      orderBy: {
        created_at: 'desc',
      },
    });

    return data.map(mapPost);
  },

  async findSavedByUserId(userId: string): Promise<PostRecord[]> {
    const profile = await prisma.profile.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    const data = await prisma.postSave.findMany({
      where: {
        user_id: userId,
      },
      include: {
        post: {
          include: postInclude(userId),
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return data.map((item) => mapPost(item.post));
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
        include: postInclude(userId),
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

  async like(postId: string, userId: string): Promise<PostRecord> {
    await this.findById(postId, userId);

    try {
      await prisma.postLike.create({
        data: {
          post_id: postId,
          user_id: userId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code !== 'P2002'
      ) {
        throw normalizePostError(error);
      }
    }

    return this.findById(postId, userId);
  },

  async unlike(postId: string, userId: string): Promise<PostRecord> {
    await this.findById(postId, userId);

    await prisma.postLike.deleteMany({
      where: {
        post_id: postId,
        user_id: userId,
      },
    });

    return this.findById(postId, userId);
  },

  async save(postId: string, userId: string): Promise<PostRecord> {
    await this.findById(postId, userId);

    try {
      await prisma.postSave.create({
        data: {
          post_id: postId,
          user_id: userId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code !== 'P2002'
      ) {
        throw normalizePostError(error);
      }
    }

    return this.findById(postId, userId);
  },

  async unsave(postId: string, userId: string): Promise<PostRecord> {
    await this.findById(postId, userId);

    await prisma.postSave.deleteMany({
      where: {
        post_id: postId,
        user_id: userId,
      },
    });

    return this.findById(postId, userId);
  },

  async createComment(
    postId: string,
    userId: string,
    payload: CreatePostCommentInput,
  ): Promise<PostCommentRecord> {
    await this.findById(postId, userId);

    try {
      const data = await prisma.postComment.create({
        data: {
          post_id: postId,
          user_id: userId,
          text: payload.text,
        },
        include: commentInclude(userId),
      });

      return mapComment(data);
    } catch (error) {
      throw normalizePostError(error);
    }
  },

  async findComments(postId: string, viewerId?: string): Promise<PostCommentRecord[]> {
    await this.findById(postId, viewerId);

    const data = await prisma.postComment.findMany({
      where: {
        post_id: postId,
      },
      include: commentInclude(viewerId),
      orderBy: {
        created_at: 'desc',
      },
    });

    return data.map(mapComment);
  },

  async removeComment(commentId: string, userId: string): Promise<void> {
    const comment = await prisma.postComment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        id: true,
        user_id: true,
        post: {
          select: {
            user_id: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundError('Comment not found');
    }

    const canDelete = comment.user_id === userId || comment.post.user_id === userId;

    if (!canDelete) {
      throw new ForbiddenError('You can only delete your own comments or comments on your posts');
    }

    await prisma.postComment.delete({
      where: {
        id: commentId,
      },
    });
  },

  async likeComment(commentId: string, userId: string): Promise<PostCommentRecord> {
    const existing = await prisma.postComment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Comment not found');
    }

    try {
      await prisma.commentLike.create({
        data: {
          comment_id: commentId,
          user_id: userId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code !== 'P2002'
      ) {
        throw normalizePostError(error);
      }
    }

    const data = await prisma.postComment.findUnique({
      where: {
        id: commentId,
      },
      include: commentInclude(userId),
    });

    if (!data) {
      throw new NotFoundError('Comment not found');
    }

    return mapComment(data);
  },

  async unlikeComment(commentId: string, userId: string): Promise<PostCommentRecord> {
    const existing = await prisma.postComment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Comment not found');
    }

    await prisma.commentLike.deleteMany({
      where: {
        comment_id: commentId,
        user_id: userId,
      },
    });

    const data = await prisma.postComment.findUnique({
      where: {
        id: commentId,
      },
      include: commentInclude(userId),
    });

    if (!data) {
      throw new NotFoundError('Comment not found');
    }

    return mapComment(data);
  },

  async findPostLikes(postId: string): Promise<PostLikeUserRecord[]> {
    await this.findById(postId);

    const data = await prisma.postLike.findMany({
      where: {
        post_id: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            username: true,
            avatar_url: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return data.map(mapLikeUser);
  },
};
