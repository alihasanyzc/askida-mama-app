import { Prisma } from '@prisma/client';

import { BadRequestError, NotFoundError } from '../../common/errors/base-error.js';
import { prisma } from '../../config/prisma.js';
import type {
  CreateProfileInput,
  ProfileRecord,
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
          full_name: input.full_name,
          username: input.username,
          phone: input.phone ?? null,
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
      const data = await prisma.profile.findUnique({
        where: {
          username,
        },
      });

      return data ? mapProfile(data) : null;
    } catch (error) {
      throw normalizeProfileError(error);
    }
  },

  async update(userId: string, payload: UpdateProfileInput): Promise<ProfileRecord> {
    const normalizedPayload = {
      ...payload,
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
};
