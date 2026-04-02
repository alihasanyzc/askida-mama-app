import { Prisma } from '@prisma/client';

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../../common/errors/base-error.js';
import { prisma } from '../../config/prisma.js';
import type {
  CreateProfileInput,
  ProfileRecord,
  ProfileSummaryRecord,
  UpdateProfileInput,
} from './profiles.type.js';

function mapProfile(record: {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  cover_photo_url: string | null;
  bio: string | null;
  phone: string | null;
  role: string;
  created_at: Date | null;
  updated_at: Date | null;
}): ProfileRecord {
  return {
    ...record,
    created_at: record.created_at?.toISOString() ?? null,
    updated_at: record.updated_at?.toISOString() ?? null,
  };
}

function mapProfileSummary(
  record: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string | null;
    follows_as_following?: Array<{ id: string }>;
  },
  fallbackIsFollowing = false,
  viewerId?: string,
): ProfileSummaryRecord {
  return {
    id: record.id,
    full_name: record.full_name,
    name: record.full_name,
    username: record.username,
    avatar_url: record.avatar_url,
    avatar: record.avatar_url,
    is_following:
      record.follows_as_following !== undefined
        ? Boolean(record.follows_as_following.length)
        : fallbackIsFollowing,
    is_self: viewerId === record.id,
  };
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function normalizeOptionalText(value?: string | null) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue === '' ? null : normalizedValue;
}

function normalizeProfileError(error: unknown) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    return new BadRequestError('Profile data conflicts with an existing record', {
      target: error.meta?.target,
    });
  }

  if (error instanceof Error) {
    return new BadRequestError(error.message);
  }

  return new BadRequestError('Profile query failed');
}

export const profilesRepository = {
  async create(input: CreateProfileInput): Promise<ProfileRecord> {
    try {
      const data = await prisma.profile.create({
        data: {
          id: input.id,
          full_name: input.full_name.trim(),
          username: normalizeUsername(input.username),
          phone: normalizeOptionalText(input.phone) ?? null,
        },
      });

      return mapProfile(data);
    } catch (error) {
      throw normalizeProfileError(error);
    }
  },

  async getById(userId: string): Promise<ProfileRecord> {
    const data = await prisma.profile.findUnique({
      where: {
        id: userId,
      },
    });

    if (!data) {
      throw new NotFoundError('Profile not found');
    }

    return mapProfile(data);
  },

  async findByUsername(username: string): Promise<ProfileRecord | null> {
    try {
      const data = await prisma.profile.findFirst({
        where: {
          username: {
            equals: normalizeUsername(username),
            mode: 'insensitive',
          },
        },
      });

      return data ? mapProfile(data) : null;
    } catch (error) {
      throw normalizeProfileError(error);
    }
  },

  async getByUsername(username: string): Promise<ProfileRecord> {
    const data = await prisma.profile.findFirst({
      where: {
        username: {
          equals: normalizeUsername(username),
          mode: 'insensitive',
        },
      },
    });

    if (!data) {
      throw new NotFoundError('Profile not found');
    }

    return mapProfile(data);
  },

  async update(userId: string, payload: UpdateProfileInput): Promise<ProfileRecord> {
    const normalizedPayload = {
      ...payload,
      full_name: payload.full_name?.trim(),
      username: payload.username ? normalizeUsername(payload.username) : undefined,
      avatar_url: payload.avatar_url === '' ? null : payload.avatar_url,
      cover_photo_url: payload.cover_photo_url === '' ? null : payload.cover_photo_url,
      bio: payload.bio === '' ? null : payload.bio,
      phone: payload.phone === '' ? null : payload.phone,
    };

    try {
      const data = await prisma.profile.update({
        where: {
          id: userId,
        },
        data: normalizedPayload,
      });

      return mapProfile(data);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('Profile not found');
      }

      throw normalizeProfileError(error);
    }
  },

  async getStats(userId: string, viewerId?: string) {
    const data = await prisma.profile.findUnique({
      where: {
        id: userId,
      },
      include: {
        _count: {
          select: {
            follows_as_following: true,
            follows_as_follower: true,
            posts: true,
          },
        },
        ...(viewerId
          ? {
              follows_as_following: {
                where: {
                  follower_id: viewerId,
                },
                select: {
                  id: true,
                },
                take: 1,
              },
            }
          : {}),
      },
    });

    if (!data) {
      throw new NotFoundError('Profile not found');
    }

    return {
      followers_count: data._count.follows_as_following,
      following_count: data._count.follows_as_follower,
      posts_count: data._count.posts,
      is_following: Boolean(
        'follows_as_following' in data && Array.isArray(data.follows_as_following)
          ? data.follows_as_following.length
          : 0,
      ),
    };
  },

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestError('You cannot follow yourself');
    }

    const profile = await prisma.profile.findUnique({
      where: {
        id: followingId,
      },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    try {
      await prisma.follow.create({
        data: {
          follower_id: followerId,
          following_id: followingId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError('You are already following this user');
      }

      throw normalizeProfileError(error);
    }
  },

  async unfollow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestError('You cannot unfollow yourself');
    }

    const profile = await prisma.profile.findUnique({
      where: {
        id: followingId,
      },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    await prisma.follow.deleteMany({
      where: {
        follower_id: followerId,
        following_id: followingId,
      },
    });
  },

  async removeFollower(userId: string, followerId: string) {
    if (userId === followerId) {
      throw new BadRequestError('You cannot remove yourself from followers');
    }

    const profile = await prisma.profile.findUnique({
      where: {
        id: followerId,
      },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    const result = await prisma.follow.deleteMany({
      where: {
        follower_id: followerId,
        following_id: userId,
      },
    });

    if (!result.count) {
      throw new NotFoundError('Follower relationship not found');
    }

    return {
      removed_profile_id: followerId,
    };
  },

  async listFollowers(profileId: string, viewerId?: string): Promise<ProfileSummaryRecord[]> {
    const profile = await prisma.profile.findUnique({
      where: {
        id: profileId,
      },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    const data = await prisma.follow.findMany({
      where: {
        following_id: profileId,
      },
      include: {
        follower: {
          select: {
            id: true,
            full_name: true,
            username: true,
            avatar_url: true,
            ...(viewerId
              ? {
                  follows_as_following: {
                    where: {
                      follower_id: viewerId,
                    },
                    select: {
                      id: true,
                    },
                    take: 1,
                  },
                }
              : {}),
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return data.map((item) => mapProfileSummary(item.follower, false, viewerId));
  },

  async listFollowing(profileId: string, viewerId?: string): Promise<ProfileSummaryRecord[]> {
    const profile = await prisma.profile.findUnique({
      where: {
        id: profileId,
      },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    const data = await prisma.follow.findMany({
      where: {
        follower_id: profileId,
      },
      include: {
        following: {
          select: {
            id: true,
            full_name: true,
            username: true,
            avatar_url: true,
            ...(viewerId
              ? {
                  follows_as_following: {
                    where: {
                      follower_id: viewerId,
                    },
                    select: {
                      id: true,
                    },
                    take: 1,
                  },
                }
              : {}),
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return data.map((item) => mapProfileSummary(item.following, false, viewerId));
  },
};
