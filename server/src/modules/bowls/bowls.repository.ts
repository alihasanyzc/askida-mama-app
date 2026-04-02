import { Prisma } from '@prisma/client';

import { BadRequestError, NotFoundError } from '../../common/errors/base-error.js';
import { prisma } from '../../config/prisma.js';
import { paymentMethodsRepository } from '../payment-methods/payment-methods.repository.js';
import type {
  BowlDetailBaseRecord,
  BowlDonationRecord,
  BowlDetailRecord,
  BowlMarkerRecord,
  BowlStatusColor,
  BowlStatusLabel,
  CreateBowlDonationInput,
  UpdateBowlAddressInput,
  UpdateBowlStatusInput,
} from './bowls.type.js';

function mapStatusColor(status: string): BowlStatusColor {
  const normalizedStatus = normalizeStatus(status);

  if (['full', 'dolu', 'filled'].includes(normalizedStatus)) {
    return 'green';
  }

  if (['empty', 'bos', 'boş'].includes(normalizedStatus)) {
    return 'red';
  }

  return 'gray';
}

function mapStatusLabel(status: string): BowlStatusLabel {
  const normalizedStatus = normalizeStatus(status);

  if (['full', 'dolu', 'filled'].includes(normalizedStatus)) {
    return 'dolu';
  }

  if (['empty', 'bos', 'boş'].includes(normalizedStatus)) {
    return 'boş';
  }

  return 'bilinmiyor';
}

function normalizeStatus(status: string) {
  return status.trim().toLowerCase();
}

function normalizeStatusForStorage(status: string) {
  const normalizedStatus = normalizeStatus(status);

  if (['full', 'dolu', 'filled'].includes(normalizedStatus)) {
    return 'full';
  }

  if (['empty', 'bos', 'boş'].includes(normalizedStatus)) {
    return 'empty';
  }

  throw new BadRequestError('Status must be either dolu or boş');
}

function buildMapsUrl(latitude: number, longitude: number) {
  const query = encodeURIComponent(`${latitude},${longitude}`);

  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function mapBowl(record: {
  id: string;
  qr_code: string;
  status: string;
  latitude: { toNumber(): number };
  longitude: { toNumber(): number };
  location_note: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}): BowlDetailBaseRecord {
  const latitude = record.latitude.toNumber();
  const longitude = record.longitude.toNumber();

  return {
    id: record.id,
    qr_code: record.qr_code,
    status: record.status,
    status_color: mapStatusColor(record.status),
    status_label: mapStatusLabel(record.status),
    latitude,
    longitude,
    location_note: record.location_note,
    location_description: record.location_note,
    maps_url: buildMapsUrl(latitude, longitude),
    created_at: record.created_at?.toISOString() ?? null,
    updated_at: record.updated_at?.toISOString() ?? null,
  };
}

function mapDonation(record: {
  id: string;
  user_id: string;
  bowl_id: string | null;
  type: string;
  amount: Prisma.Decimal;
  payment_method: string | null;
  status: string;
  created_at: Date | null;
}): BowlDonationRecord {
  return {
    id: record.id,
    user_id: record.user_id,
    bowl_id: record.bowl_id ?? '',
    type: record.type,
    amount: record.amount.toNumber(),
    payment_method: record.payment_method,
    status: record.status,
    created_at: record.created_at?.toISOString() ?? null,
  };
}

async function getDonationSummary(bowlId: string, userId?: string) {
  const [allDonations, userDonations] = await Promise.all([
    prisma.donation.findMany({
      where: {
        bowl_id: bowlId,
      },
      select: {
        amount: true,
      },
    }),
    userId
      ? prisma.donation.findMany({
          where: {
            bowl_id: bowlId,
            user_id: userId,
          },
          select: {
            amount: true,
          },
        })
      : Promise.resolve([]),
  ]);

  return {
    total_amount: allDonations.reduce((sum, donation) => sum + donation.amount.toNumber(), 0),
    total_donations_count: allDonations.length,
    user_total_amount: userDonations.reduce(
      (sum, donation) => sum + donation.amount.toNumber(),
      0,
    ),
    user_donations_count: userDonations.length,
  };
}

export const bowlsRepository = {
  async findMany(): Promise<BowlMarkerRecord[]> {
    const data = await prisma.bowl.findMany({
      select: {
        id: true,
        qr_code: true,
        status: true,
        latitude: true,
        longitude: true,
        location_note: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    return data.map(mapBowl);
  },

  async findById(bowlId: string, userId?: string): Promise<BowlDetailRecord> {
    const data = await prisma.bowl.findUnique({
      where: {
        id: bowlId,
      },
      select: {
        id: true,
        qr_code: true,
        status: true,
        latitude: true,
        longitude: true,
        location_note: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!data) {
      throw new NotFoundError('Bowl not found');
    }

    return {
      ...mapBowl(data),
      donation_summary: await getDonationSummary(bowlId, userId),
    };
  },

  async findByQrCode(qrCode: string, userId?: string): Promise<BowlDetailRecord> {
    const data = await prisma.bowl.findUnique({
      where: {
        qr_code: qrCode,
      },
      select: {
        id: true,
        qr_code: true,
        status: true,
        latitude: true,
        longitude: true,
        location_note: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!data) {
      throw new NotFoundError('Bowl not found');
    }

    return {
      ...mapBowl(data),
      donation_summary: await getDonationSummary(data.id, userId),
    };
  },

  async updateStatus(
    bowlId: string,
    userId: string,
    payload: UpdateBowlStatusInput,
  ): Promise<BowlDetailRecord> {
    const existing = await prisma.bowl.findUnique({
      where: {
        id: bowlId,
      },
      select: {
        id: true,
        status: true,
        latitude: true,
        longitude: true,
        location_note: true,
      },
    });

    if (!existing) {
      throw new NotFoundError('Bowl not found');
    }

    const nextStatus = normalizeStatusForStorage(payload.status);

    await prisma.$transaction(async (tx) => {
      await tx.bowl.update({
        where: {
          id: bowlId,
        },
        data: {
          status: nextStatus,
          last_updated_by: userId,
        },
      });

      await tx.bowlStatusLog.create({
        data: {
          bowl_id: bowlId,
          updated_by: userId,
          old_status: existing.status,
          new_status: nextStatus,
          old_latitude: existing.latitude,
          old_longitude: existing.longitude,
          new_latitude: existing.latitude,
          new_longitude: existing.longitude,
          new_location_note: existing.location_note,
          source: 'manual',
        },
      });
    });

    return this.findById(bowlId, userId);
  },

  async updateAddress(
    bowlId: string,
    userId: string,
    payload: UpdateBowlAddressInput,
  ): Promise<BowlDetailRecord> {
    const existing = await prisma.bowl.findUnique({
      where: {
        id: bowlId,
      },
      select: {
        id: true,
        status: true,
        latitude: true,
        longitude: true,
      },
    });

    if (!existing) {
      throw new NotFoundError('Bowl not found');
    }

    await prisma.$transaction(async (tx) => {
      await tx.bowl.update({
        where: {
          id: bowlId,
        },
        data: {
          latitude: payload.latitude,
          longitude: payload.longitude,
          location_note:
            payload.location_note !== undefined
              ? payload.location_note === ''
                ? null
                : (payload.location_note ?? null)
              : payload.locationDescription === ''
              ? null
              : (payload.locationDescription ?? null),
          last_updated_by: userId,
        },
      });

      await tx.bowlStatusLog.create({
        data: {
          bowl_id: bowlId,
          updated_by: userId,
          old_status: existing.status,
          new_status: existing.status,
          old_latitude: existing.latitude,
          old_longitude: existing.longitude,
          new_latitude: payload.latitude,
          new_longitude: payload.longitude,
          new_location_note:
            payload.location_note !== undefined
              ? payload.location_note === ''
                ? null
                : (payload.location_note ?? null)
              : payload.locationDescription === ''
              ? null
              : (payload.locationDescription ?? null),
          source: 'manual',
        },
      });
    });

    return this.findById(bowlId, userId);
  },

  async createDonation(
    bowlId: string,
    userId: string,
    payload: CreateBowlDonationInput,
  ) {
    const bowl = await prisma.bowl.findUnique({
      where: {
        id: bowlId,
      },
      select: {
        id: true,
      },
    });

    if (!bowl) {
      throw new NotFoundError('Bowl not found');
    }

    let paymentMethodLabel =
      payload.payment_method === '' ? null : (payload.payment_method ?? null);

    if (payload.payment_method_id) {
      const paymentMethod = await paymentMethodsRepository.findByIdForUser(
        payload.payment_method_id,
        userId,
      );
      paymentMethodLabel = paymentMethod.brand;
    }

    if (payload.new_card) {
      paymentMethodLabel = payload.new_card.brand;

      if (payload.save_card) {
        await paymentMethodsRepository.create(userId, {
          cardholder_name: payload.new_card.cardholder_name,
          card_number: payload.new_card.card_number,
          expiry_month: payload.new_card.expiry_month,
          expiry_year: payload.new_card.expiry_year,
          brand: payload.new_card.brand,
          card_type: payload.new_card.card_type,
          is_default: false,
        });
      }
    }

    const donation = await prisma.donation.create({
      data: {
        user_id: userId,
        type: 'bowl',
        amount: payload.amount,
        bowl_id: bowlId,
        payment_method: paymentMethodLabel,
        status: 'completed',
      },
      select: {
        id: true,
        user_id: true,
        bowl_id: true,
        type: true,
        amount: true,
        payment_method: true,
        status: true,
        created_at: true,
      },
    });

    return {
      donation: mapDonation(donation),
      donation_summary: await getDonationSummary(bowlId, userId),
    };
  },
};
