import { Prisma } from '@prisma/client';

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ServiceUnavailableError,
} from '../../common/errors/base-error.js';
import { prisma } from '../../config/prisma.js';
import type {
  AnnouncementAuthorRecord,
  AnnouncementFilters,
  AnnouncementRecord,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from './announcements.type.js';

function buildMapsUrl(latitude: number, longitude: number) {
  const query = encodeURIComponent(`${latitude},${longitude}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function mapAuthor(record: AnnouncementAuthorRecord): AnnouncementAuthorRecord {
  return record;
}

function normalizeNullableString(value: string | null | undefined) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

function mergeNullableString(
  nextValue: string | null | undefined,
  currentValue: string | null,
) {
  return nextValue === undefined ? currentValue : (normalizeNullableString(nextValue) ?? null);
}

function normalizeAnnouncementError(error: unknown) {
  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  ) {
    return new ServiceUnavailableError('Database service is temporarily unavailable', {
      provider: 'postgres',
      message: error.message,
    });
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    ['P1001', 'P1002'].includes(error.code)
  ) {
    return new ServiceUnavailableError('Database service is temporarily unavailable', {
      provider: 'postgres',
      code: error.code,
      message: error.message,
    });
  }

  if (error instanceof Error) {
    return new BadRequestError(error.message);
  }

  return new BadRequestError('Announcement query failed');
}

function mapAnnouncement(record: {
  id: string;
  user_id: string;
  category: string;
  title: string;
  description: string;
  latitude: Prisma.Decimal;
  longitude: Prisma.Decimal;
  address: string | null;
  city: string | null;
  district: string | null;
  location_note: string | null;
  phone: string | null;
  email: string | null;
  status: string;
  is_priority: boolean;
  report_type: string | null;
  animal_type: string | null;
  age: string | null;
  gender: string | null;
  neutered: string | null;
  vaccination: string | null;
  health_status: string | null;
  environment: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  user: AnnouncementAuthorRecord;
  announcement_images: Array<{
    id: string;
    image_url: string;
    display_order: number;
  }>;
}): AnnouncementRecord {
  const latitude = record.latitude.toNumber();
  const longitude = record.longitude.toNumber();

  return {
    id: record.id,
    user_id: record.user_id,
    category: record.category as AnnouncementRecord['category'],
    title: record.title,
    description: record.description,
    cover_image_url: record.announcement_images[0]?.image_url ?? null,
    latitude,
    longitude,
    address: record.address,
    city: record.city,
    district: record.district,
    location_note: record.location_note,
    maps_url: buildMapsUrl(latitude, longitude),
    phone: record.phone,
    email: record.email,
    status: record.status,
    is_priority: record.is_priority,
    report_type: record.report_type as AnnouncementRecord['report_type'],
    animal_type: record.animal_type as AnnouncementRecord['animal_type'],
    age: record.age as AnnouncementRecord['age'],
    gender: record.gender as AnnouncementRecord['gender'],
    neutered: record.neutered as AnnouncementRecord['neutered'],
    vaccination: record.vaccination as AnnouncementRecord['vaccination'],
    health_status: record.health_status as AnnouncementRecord['health_status'],
    environment: record.environment as AnnouncementRecord['environment'],
    created_at: record.created_at?.toISOString() ?? null,
    updated_at: record.updated_at?.toISOString() ?? null,
    author: mapAuthor(record.user),
    images: record.announcement_images,
  };
}

function mapCreateData(payload: CreateAnnouncementInput, isPriority: boolean) {
  return {
    category: payload.category,
    title: payload.title,
    description: payload.description,
    latitude: payload.latitude,
    longitude: payload.longitude,
    address: normalizeNullableString(payload.address),
    city: normalizeNullableString(payload.city),
    district: normalizeNullableString(payload.district),
    location_note: normalizeNullableString(payload.location_note ?? payload.locationDescription),
    phone: normalizeNullableString(payload.phone),
    email: normalizeNullableString(payload.email),
    is_priority: isPriority,
    report_type: normalizeNullableString(payload.report_type),
    animal_type: normalizeNullableString(payload.animal_type),
    age: normalizeNullableString(payload.age),
    gender: normalizeNullableString(payload.gender),
    neutered: normalizeNullableString(payload.neutered),
    vaccination: normalizeNullableString(payload.vaccination),
    health_status: normalizeNullableString(payload.health_status),
    environment: normalizeNullableString(payload.environment),
  };
}

function mapUpdateData(payload: UpdateAnnouncementInput, isPriority: boolean) {
  return {
    category: payload.category,
    title: payload.title,
    description: payload.description,
    latitude: payload.latitude,
    longitude: payload.longitude,
    address: normalizeNullableString(payload.address),
    city: normalizeNullableString(payload.city),
    district: normalizeNullableString(payload.district),
    location_note: normalizeNullableString(payload.location_note ?? payload.locationDescription),
    phone: normalizeNullableString(payload.phone),
    email: normalizeNullableString(payload.email),
    is_priority: isPriority,
    report_type: normalizeNullableString(payload.report_type),
    animal_type: normalizeNullableString(payload.animal_type),
    age: normalizeNullableString(payload.age),
    gender: normalizeNullableString(payload.gender),
    neutered: normalizeNullableString(payload.neutered),
    vaccination: normalizeNullableString(payload.vaccination),
    health_status: normalizeNullableString(payload.health_status),
    environment: normalizeNullableString(payload.environment),
  };
}

function assertAnnouncementRequirements(
  payload: {
    category: string;
    phone: string | null;
    email: string | null;
    images: string[];
    report_type: string | null;
    animal_type: string | null;
    age: string | null;
    gender: string | null;
    neutered: string | null;
    vaccination: string | null;
    health_status: string | null;
    environment: string | null;
  },
) {
  if (!payload.phone && !payload.email) {
    throw new BadRequestError('Either phone or email is required');
  }

  if (payload.images.length < 1 || payload.images.length > 4) {
    throw new BadRequestError('Announcements must include between 1 and 4 images');
  }

  if (payload.category === 'report' && !payload.report_type) {
    throw new BadRequestError('Report type is required for report announcements');
  }

  if (payload.category === 'adoption') {
    const requiredFields = [
      ['animal_type', payload.animal_type],
      ['age', payload.age],
      ['gender', payload.gender],
      ['neutered', payload.neutered],
      ['vaccination', payload.vaccination],
      ['health_status', payload.health_status],
      ['environment', payload.environment],
    ] as const;

    const missingField = requiredFields.find(([, value]) => !value);

    if (missingField) {
      throw new BadRequestError(
        `${missingField[0].replace('_', ' ')} is required for adoption announcements`,
      );
    }
  }
}

async function hasActiveSubscription(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      user_id: userId,
      end_date: {
        gte: new Date(),
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(subscription);
}

const announcementInclude = {
  user: {
    select: {
      id: true,
      full_name: true,
      username: true,
      avatar_url: true,
    },
  },
  announcement_images: {
    select: {
      id: true,
      image_url: true,
      display_order: true,
    },
    orderBy: {
      display_order: 'asc' as const,
    },
  },
};

export const announcementsRepository = {
  async findMany(filters: AnnouncementFilters): Promise<AnnouncementRecord[]> {
    const data = await prisma.announcement.findMany({
      where: {
        status: 'active',
        ...(filters.category ? { category: filters.category } : {}),
        ...(filters.city ? { city: filters.city } : {}),
        ...(filters.district ? { district: filters.district } : {}),
      },
      include: announcementInclude,
      orderBy: [{ is_priority: 'desc' }, { created_at: 'desc' }],
    });

    return data.map(mapAnnouncement);
  },

  async findById(announcementId: string): Promise<AnnouncementRecord> {
    const data = await prisma.announcement.findUnique({
      where: {
        id: announcementId,
      },
      include: announcementInclude,
    });

    if (!data) {
      throw new NotFoundError('Announcement not found');
    }

    return mapAnnouncement(data);
  },

  async findByUserId(userId: string): Promise<AnnouncementRecord[]> {
    try {
      const data = await prisma.announcement.findMany({
        where: {
          user_id: userId,
        },
        include: announcementInclude,
        orderBy: [{ is_priority: 'desc' }, { created_at: 'desc' }],
      });

      return data.map(mapAnnouncement);
    } catch (error) {
      throw normalizeAnnouncementError(error);
    }
  },

  async create(userId: string, payload: CreateAnnouncementInput): Promise<AnnouncementRecord> {
    const isPriority = await hasActiveSubscription(userId);

    assertAnnouncementRequirements({
      category: payload.category,
      phone: normalizeNullableString(payload.phone) ?? null,
      email: normalizeNullableString(payload.email) ?? null,
      images: payload.images,
      report_type: normalizeNullableString(payload.report_type) ?? null,
      animal_type: normalizeNullableString(payload.animal_type) ?? null,
      age: normalizeNullableString(payload.age) ?? null,
      gender: normalizeNullableString(payload.gender) ?? null,
      neutered: normalizeNullableString(payload.neutered) ?? null,
      vaccination: normalizeNullableString(payload.vaccination) ?? null,
      health_status: normalizeNullableString(payload.health_status) ?? null,
      environment: normalizeNullableString(payload.environment) ?? null,
    });

    const data = await prisma.$transaction(async (tx) => {
      const announcement = await tx.announcement.create({
        data: {
          user_id: userId,
          ...mapCreateData(payload, isPriority),
          announcement_images: {
            create: payload.images.map((imageUrl, index) => ({
              image_url: imageUrl,
              display_order: index,
            })),
          },
        },
        include: announcementInclude,
      });

      return announcement;
    });

    return mapAnnouncement(data);
  },

  async update(
    announcementId: string,
    userId: string,
    payload: UpdateAnnouncementInput,
  ): Promise<AnnouncementRecord> {
    const existing = await prisma.announcement.findUnique({
      where: {
        id: announcementId,
      },
      include: {
        announcement_images: {
          select: {
            image_url: true,
          },
          orderBy: {
            display_order: 'asc',
          },
        },
      },
    });

    if (!existing) {
      throw new NotFoundError('Announcement not found');
    }

    if (existing.user_id !== userId) {
      throw new ForbiddenError('You can only update your own announcements');
    }

    const isPriority = await hasActiveSubscription(userId);
    const mergedImages =
      payload.images ?? existing.announcement_images.map((image) => image.image_url);
    const mergedCategory = payload.category ?? existing.category;
    const mergedPhone = mergeNullableString(payload.phone, existing.phone);
    const mergedEmail = mergeNullableString(payload.email, existing.email);
    const mergedReportType = mergeNullableString(payload.report_type, existing.report_type);
    const mergedAnimalType = mergeNullableString(payload.animal_type, existing.animal_type);
    const mergedAge = mergeNullableString(payload.age, existing.age);
    const mergedGender = mergeNullableString(payload.gender, existing.gender);
    const mergedNeutered = mergeNullableString(payload.neutered, existing.neutered);
    const mergedVaccination = mergeNullableString(payload.vaccination, existing.vaccination);
    const mergedHealthStatus =
      mergeNullableString(payload.health_status, existing.health_status);
    const mergedEnvironment = mergeNullableString(payload.environment, existing.environment);

    assertAnnouncementRequirements({
      category: mergedCategory,
      phone: mergedPhone,
      email: mergedEmail,
      images: mergedImages,
      report_type: mergedReportType,
      animal_type: mergedAnimalType,
      age: mergedAge,
      gender: mergedGender,
      neutered: mergedNeutered,
      vaccination: mergedVaccination,
      health_status: mergedHealthStatus,
      environment: mergedEnvironment,
    });

    const data = await prisma.$transaction(async (tx) => {
      if (payload.images) {
        await tx.announcementImage.deleteMany({
          where: {
            announcement_id: announcementId,
          },
        });
      }

      const announcement = await tx.announcement.update({
        where: {
          id: announcementId,
        },
        data: {
          ...mapUpdateData(payload, isPriority),
          ...(payload.images
            ? {
                announcement_images: {
                  create: payload.images.map((imageUrl, index) => ({
                    image_url: imageUrl,
                    display_order: index,
                  })),
                },
              }
            : {}),
        },
        include: announcementInclude,
      });

      return announcement;
    });

    return mapAnnouncement(data);
  },

  async remove(announcementId: string, userId: string): Promise<void> {
    const existing = await prisma.announcement.findUnique({
      where: {
        id: announcementId,
      },
      select: {
        id: true,
        user_id: true,
      },
    });

    if (!existing) {
      throw new NotFoundError('Announcement not found');
    }

    if (existing.user_id !== userId) {
      throw new ForbiddenError('You can only delete your own announcements');
    }

    await prisma.announcement.delete({
      where: {
        id: announcementId,
      },
    });
  },
};
