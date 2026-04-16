import type { Prisma } from '@prisma/client';

import { prisma } from '../../config/prisma.js';
import { paymentMethodsRepository } from '../payment-methods/payment-methods.repository.js';
import type {
  CreateGeneralDonationInput,
  CreateGeneralDonationResult,
  DonationRecord,
  UserDonationSummary,
} from './donations.type.js';

function mapDonation(record: {
  id: string;
  user_id: string;
  type: string;
  amount: Prisma.Decimal;
  payment_method: string | null;
  status: string;
  created_at: Date | null;
}): DonationRecord {
  return {
    id: record.id,
    user_id: record.user_id,
    type: record.type,
    amount: record.amount.toNumber(),
    payment_method: record.payment_method,
    status: record.status,
    created_at: record.created_at?.toISOString() ?? null,
  };
}

async function getUserDonationSummary(userId: string): Promise<UserDonationSummary> {
  const [aggregate, totalDonationsCount] = await Promise.all([
    prisma.donation.aggregate({
      where: {
        user_id: userId,
        status: 'completed',
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.donation.count({
      where: {
        user_id: userId,
        status: 'completed',
      },
    }),
  ]);

  return {
    total_amount: aggregate._sum.amount?.toNumber() ?? 0,
    total_donations_count: totalDonationsCount,
  };
}

export const donationsRepository = {
  async createGeneralDonation(
    userId: string,
    payload: CreateGeneralDonationInput,
  ): Promise<CreateGeneralDonationResult> {
    const paymentMethod = await paymentMethodsRepository.findByIdForUser(
      payload.payment_method_id,
      userId,
    );

    const donation = await prisma.donation.create({
      data: {
        user_id: userId,
        type: 'general',
        amount: payload.amount,
        payment_method: paymentMethod.brand,
        status: 'completed',
      },
      select: {
        id: true,
        user_id: true,
        type: true,
        amount: true,
        payment_method: true,
        status: true,
        created_at: true,
      },
    });

    return {
      donation: mapDonation(donation),
      user_summary: await getUserDonationSummary(userId),
    };
  },
};
