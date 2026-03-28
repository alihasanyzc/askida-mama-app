import { Prisma } from '@prisma/client';

import { NotFoundError } from '../../common/errors/base-error.js';
import { prisma } from '../../config/prisma.js';
import { paymentMethodsRepository } from '../payment-methods/payment-methods.repository.js';
import type {
  ClinicDonationRecord,
  ClinicRecord,
  CreateClinicDonationInput,
  CreateClinicInput,
} from './clinics.type.js';

function buildMapsUrl(latitude: number, longitude: number) {
  const query = encodeURIComponent(`${latitude},${longitude}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function mapClinic(record: {
  id: string;
  name: string;
  description: string;
  image_url: string;
  latitude: Prisma.Decimal;
  longitude: Prisma.Decimal;
  city: string | null;
  district: string | null;
  location_description: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}): ClinicRecord {
  const latitude = record.latitude.toNumber();
  const longitude = record.longitude.toNumber();

  return {
    id: record.id,
    name: record.name,
    description: record.description,
    image_url: record.image_url,
    latitude,
    longitude,
    city: record.city,
    district: record.district,
    location_description: record.location_description,
    maps_url: buildMapsUrl(latitude, longitude),
    created_at: record.created_at?.toISOString() ?? null,
    updated_at: record.updated_at?.toISOString() ?? null,
  };
}

function mapDonation(record: {
  id: string;
  user_id: string;
  clinic_id: string | null;
  clinic_name: string | null;
  amount: Prisma.Decimal;
  payment_method: string | null;
  status: string;
  created_at: Date | null;
}): ClinicDonationRecord {
  return {
    id: record.id,
    user_id: record.user_id,
    clinic_id: record.clinic_id ?? '',
    clinic_name: record.clinic_name,
    total_amount: record.amount.toNumber(),
    payment_method: record.payment_method,
    status: record.status,
    created_at: record.created_at?.toISOString() ?? null,
  };
}

async function getDonationSummary(clinicId: string, userId?: string) {
  const [allDonations, userDonations] = await Promise.all([
    prisma.donation.findMany({
      where: {
        clinic_id: clinicId,
      },
      select: {
        amount: true,
      },
    }),
    userId
      ? prisma.donation.findMany({
          where: {
            clinic_id: clinicId,
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

export const clinicsRepository = {
  async findMany(filters: { city?: string; district?: string }): Promise<ClinicRecord[]> {
    const data = await prisma.clinic.findMany({
      where: {
        is_active: true,
        ...(filters.city ? { city: filters.city } : {}),
        ...(filters.district ? { district: filters.district } : {}),
      },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        name: true,
        description: true,
        image_url: true,
        latitude: true,
        longitude: true,
        city: true,
        district: true,
        location_description: true,
        created_at: true,
        updated_at: true,
      },
    });

    return data.map(mapClinic);
  },

  async findById(clinicId: string, userId?: string): Promise<ClinicRecord> {
    const data = await prisma.clinic.findFirst({
      where: {
        id: clinicId,
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        image_url: true,
        latitude: true,
        longitude: true,
        city: true,
        district: true,
        location_description: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!data) {
      throw new NotFoundError('Clinic not found');
    }

    return {
      ...mapClinic(data),
      donation_summary: await getDonationSummary(clinicId, userId),
    };
  },

  async create(adminUserId: string, payload: CreateClinicInput): Promise<ClinicRecord> {
    const data = await prisma.clinic.create({
      data: {
        name: payload.name,
        description: payload.description,
        image_url: payload.image_url,
        latitude: payload.latitude,
        longitude: payload.longitude,
        city: payload.city,
        district: payload.district,
        location_description:
          payload.locationDescription === ''
            ? null
            : (payload.locationDescription ?? null),
        created_by: adminUserId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        image_url: true,
        latitude: true,
        longitude: true,
        city: true,
        district: true,
        location_description: true,
        created_at: true,
        updated_at: true,
      },
    });

    return mapClinic(data);
  },

  async remove(clinicId: string): Promise<void> {
    const existing = await prisma.clinic.findUnique({
      where: {
        id: clinicId,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      throw new NotFoundError('Clinic not found');
    }

    await prisma.clinic.update({
      where: {
        id: clinicId,
      },
      data: {
        is_active: false,
      },
    });
  },

  async createDonation(
    clinicId: string,
    userId: string,
    payload: CreateClinicDonationInput,
  ) {
    const clinic = await prisma.clinic.findFirst({
      where: {
        id: clinicId,
        is_active: true,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!clinic) {
      throw new NotFoundError('Clinic not found');
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
        type: 'medical',
        amount: payload.amount,
        clinic_id: clinic.id,
        clinic_name: clinic.name,
        payment_method: paymentMethodLabel,
        status: 'completed',
      },
      select: {
        id: true,
        user_id: true,
        clinic_id: true,
        clinic_name: true,
        amount: true,
        payment_method: true,
        status: true,
        created_at: true,
      },
    });

    return {
      donation: mapDonation(donation),
      donation_summary: await getDonationSummary(clinicId, userId),
    };
  },
};
