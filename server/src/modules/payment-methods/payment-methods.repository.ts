import { BadRequestError, NotFoundError } from '../../common/errors/base-error.js';
import { prisma } from '../../config/prisma.js';
import type {
  CreatePaymentMethodInput,
  PaymentMethodRecord,
} from './payment-methods.type.js';

function maskCardNumber(last4: string) {
  return `.... .... .... ${last4}`;
}

function mapPaymentMethod(record: {
  id: string;
  brand: string;
  last4: string;
  cardholder_name: string;
  expiry_month: number;
  expiry_year: number;
  card_type: string | null;
  is_default: boolean;
  created_at: Date | null;
  updated_at: Date | null;
}): PaymentMethodRecord {
  return {
    id: record.id,
    brand: record.brand,
    last4: record.last4,
    masked_number: maskCardNumber(record.last4),
    cardholder_name: record.cardholder_name,
    expiry_month: record.expiry_month,
    expiry_year: record.expiry_year,
    expiry_date: `${String(record.expiry_month).padStart(2, '0')}/${String(
      record.expiry_year,
    ).slice(-2)}`,
    card_type: record.card_type,
    is_default: record.is_default,
    created_at: record.created_at?.toISOString() ?? null,
    updated_at: record.updated_at?.toISOString() ?? null,
  };
}

export const paymentMethodsRepository = {
  async findManyByUserId(userId: string): Promise<PaymentMethodRecord[]> {
    const data = await prisma.paymentMethod.findMany({
      where: {
        user_id: userId,
      },
      orderBy: [{ is_default: 'desc' }, { created_at: 'desc' }],
    });

    return data.map(mapPaymentMethod);
  },

  async findByIdForUser(paymentMethodId: string, userId: string): Promise<PaymentMethodRecord> {
    const data = await prisma.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        user_id: userId,
      },
    });

    if (!data) {
      throw new NotFoundError('Payment method not found');
    }

    return mapPaymentMethod(data);
  },

  async create(userId: string, payload: CreatePaymentMethodInput): Promise<PaymentMethodRecord> {
    const sanitizedCardNumber = payload.card_number.replace(/\s+/g, '');

    if (sanitizedCardNumber.length < 4) {
      throw new BadRequestError('Card number is invalid');
    }

    return prisma.$transaction(async (tx) => {
      if (payload.is_default) {
        await tx.paymentMethod.updateMany({
          where: {
            user_id: userId,
          },
          data: {
            is_default: false,
          },
        });
      }

      const data = await tx.paymentMethod.create({
        data: {
          user_id: userId,
          brand: payload.brand,
          last4: sanitizedCardNumber.slice(-4),
          cardholder_name: payload.cardholder_name,
          expiry_month: payload.expiry_month,
          expiry_year: payload.expiry_year,
          card_type: payload.card_type === '' ? null : (payload.card_type ?? null),
          is_default: payload.is_default ?? false,
        },
      });

      return mapPaymentMethod(data);
    });
  },

  async remove(paymentMethodId: string, userId: string): Promise<void> {
    const existing = await prisma.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        user_id: userId,
      },
    });

    if (!existing) {
      throw new NotFoundError('Payment method not found');
    }

    await prisma.paymentMethod.delete({
      where: {
        id: paymentMethodId,
      },
    });
  },
};
