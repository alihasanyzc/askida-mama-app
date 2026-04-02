import { Prisma } from '@prisma/client';

import { BadRequestError, ConflictError, NotFoundError } from '../../common/errors/base-error.js';
import { prisma } from '../../config/prisma.js';
import type {
  CreateEventInput,
  EventRecord,
  EventRegistrationRecord,
} from './events.type.js';

function mapEvent(record: {
  id: string;
  title: string;
  description: string;
  image_url: string;
  organizer: string;
  event_date: Date;
  latitude: Prisma.Decimal;
  longitude: Prisma.Decimal;
  address: string | null;
  city: string | null;
  district: string | null;
  location_note: string | null;
  status: string;
  is_active: boolean;
  created_by: string;
  created_at: Date | null;
  updated_at: Date | null;
  creator: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string | null;
  };
  _count: {
    event_registrations: number;
  };
  event_registrations?: Array<{ id: string }>;
}): EventRecord {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    image_url: record.image_url,
    organizer: record.organizer,
    event_date: record.event_date.toISOString(),
    latitude: record.latitude.toNumber(),
    longitude: record.longitude.toNumber(),
    address: record.address,
    city: record.city,
    district: record.district,
    location_note: record.location_note,
    status: record.status,
    is_active: record.is_active,
    created_by: record.created_by,
    created_at: record.created_at?.toISOString() ?? null,
    updated_at: record.updated_at?.toISOString() ?? null,
    creator: record.creator,
    registrations_count: record._count.event_registrations,
    is_registered: Boolean(record.event_registrations?.length),
  };
}

const eventInclude = (viewerId?: string) =>
  ({
    creator: {
      select: {
        id: true,
        full_name: true,
        username: true,
        avatar_url: true,
      },
    },
    _count: {
      select: {
        event_registrations: true,
      },
    },
    ...(viewerId
      ? {
          event_registrations: {
            where: {
              user_id: viewerId,
            },
            select: {
              id: true,
            },
            take: 1,
          },
        }
      : {}),
  }) satisfies Prisma.EventInclude;

function normalizeEventError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return new ConflictError('Event registration already exists');
    }

    if (error.code === 'P2025') {
      return new NotFoundError('Event not found');
    }
  }

  if (error instanceof Error) {
    return new BadRequestError(error.message);
  }

  return new BadRequestError('Event query failed');
}

export const eventsRepository = {
  async findMany(viewerId?: string): Promise<EventRecord[]> {
    const data = await prisma.event.findMany({
      where: {
        is_active: true,
      },
      include: eventInclude(viewerId),
      orderBy: [{ event_date: 'asc' }, { created_at: 'desc' }],
    });

    return data.map(mapEvent);
  },

  async findById(eventId: string, viewerId?: string): Promise<EventRecord> {
    const data = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: eventInclude(viewerId),
    });

    if (!data || !data.is_active) {
      throw new NotFoundError('Event not found');
    }

    return mapEvent(data);
  },

  async create(userId: string, payload: CreateEventInput): Promise<EventRecord> {
    try {
      const data = await prisma.event.create({
        data: {
          title: payload.title.trim(),
          description: payload.description.trim(),
          image_url: payload.image_url,
          organizer: payload.organizer.trim(),
          event_date: new Date(payload.event_date),
          latitude: payload.latitude,
          longitude: payload.longitude,
          address: payload.address?.trim() || null,
          city: payload.city?.trim() || null,
          district: payload.district?.trim() || null,
          location_note:
            payload.location_note !== undefined
              ? payload.location_note?.trim() || null
              : payload.locationDescription === undefined
              ? null
              : payload.locationDescription?.trim() || null,
          created_by: userId,
        },
        include: eventInclude(userId),
      });

      return mapEvent(data);
    } catch (error) {
      throw normalizeEventError(error);
    }
  },

  async createRegistration(
    eventId: string,
    userId: string,
    email: string,
  ): Promise<Omit<EventRegistrationRecord, 'email_notification'>> {
    await this.findById(eventId, userId);

    try {
      const data = await prisma.eventRegistration.create({
        data: {
          event_id: eventId,
          user_id: userId,
          email,
          status: 'pending',
        },
      });

      return {
        id: data.id,
        event_id: data.event_id,
        user_id: data.user_id,
        email: data.email,
        status: data.status as EventRegistrationRecord['status'],
        reviewed_by: data.reviewed_by,
        reviewed_at: data.reviewed_at?.toISOString() ?? null,
        created_at: data.created_at?.toISOString() ?? null,
      };
    } catch (error) {
      throw normalizeEventError(error);
    }
  },
};
