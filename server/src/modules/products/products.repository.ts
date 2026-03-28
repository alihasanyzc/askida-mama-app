import { Prisma } from '@prisma/client';

import { BadRequestError, NotFoundError } from '../../common/errors/base-error.js';
import { prisma } from '../../config/prisma.js';
import { paymentMethodsRepository } from '../payment-methods/payment-methods.repository.js';
import type {
  AnimalType,
  CreateProductDonationInput,
  CreateProductInput,
  ProductDonationRecord,
  ProductRecord,
} from './products.type.js';

function mapProduct(record: {
  id: string;
  animal_type: string;
  image_url: string;
  name: string;
  price: Prisma.Decimal;
  description: string;
  nutrition_info: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}): ProductRecord {
  return {
    id: record.id,
    animal_type: record.animal_type as AnimalType,
    image_url: record.image_url,
    name: record.name,
    price: record.price.toNumber(),
    description: record.description,
    nutrition_info: record.nutrition_info,
    created_at: record.created_at?.toISOString() ?? null,
    updated_at: record.updated_at?.toISOString() ?? null,
  };
}

function normalizeAnimalType(animalType?: string): AnimalType | undefined {
  if (!animalType) {
    return undefined;
  }

  if (animalType === 'cat' || animalType === 'dog') {
    return animalType;
  }

  throw new BadRequestError('Animal type must be cat or dog');
}

function mapDonation(record: {
  id: string;
  user_id: string;
  product_id: string | null;
  product_name: string | null;
  product_quantity: number | null;
  amount: Prisma.Decimal;
  payment_method: string | null;
  status: string;
  created_at: Date | null;
}): ProductDonationRecord {
  const quantity = record.product_quantity ?? 0;
  const totalAmount = record.amount.toNumber();

  return {
    id: record.id,
    user_id: record.user_id,
    product_id: record.product_id ?? '',
    product_name: record.product_name,
    quantity,
    unit_price: quantity > 0 ? totalAmount / quantity : totalAmount,
    total_amount: totalAmount,
    payment_method: record.payment_method,
    status: record.status,
    created_at: record.created_at?.toISOString() ?? null,
  };
}

export const productsRepository = {
  async findMany(animalType?: string): Promise<ProductRecord[]> {
    const normalizedAnimalType = normalizeAnimalType(animalType);

    const data = await prisma.product.findMany({
      where: {
        is_active: true,
        ...(normalizedAnimalType
          ? {
              animal_type: normalizedAnimalType,
            }
          : {}),
      },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        animal_type: true,
        image_url: true,
        name: true,
        price: true,
        description: true,
        nutrition_info: true,
        created_at: true,
        updated_at: true,
      },
    });

    return data.map(mapProduct);
  },

  async create(adminUserId: string, payload: CreateProductInput): Promise<ProductRecord> {
    const data = await prisma.product.create({
      data: {
        animal_type: payload.animal_type,
        image_url: payload.image_url,
        name: payload.name,
        price: payload.price,
        description: payload.description,
        nutrition_info:
          payload.nutrition_info === '' ? null : (payload.nutrition_info ?? null),
        created_by: adminUserId,
      },
      select: {
        id: true,
        animal_type: true,
        image_url: true,
        name: true,
        price: true,
        description: true,
        nutrition_info: true,
        created_at: true,
        updated_at: true,
      },
    });

    return mapProduct(data);
  },

  async findById(productId: string): Promise<ProductRecord> {
    const data = await prisma.product.findFirst({
      where: {
        id: productId,
        is_active: true,
      },
      select: {
        id: true,
        animal_type: true,
        image_url: true,
        name: true,
        price: true,
        description: true,
        nutrition_info: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!data) {
      throw new NotFoundError('Product not found');
    }

    return mapProduct(data);
  },

  async createDonation(
    productId: string,
    userId: string,
    payload: CreateProductDonationInput,
  ) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
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

    const totalAmount = product.price.toNumber() * payload.quantity;

    const donation = await prisma.donation.create({
      data: {
        user_id: userId,
        type: 'food',
        amount: totalAmount,
        product_id: product.id,
        product_name: product.name,
        product_quantity: payload.quantity,
        payment_method: paymentMethodLabel,
        status: 'completed',
      },
      select: {
        id: true,
        user_id: true,
        product_id: true,
        product_name: true,
        product_quantity: true,
        amount: true,
        payment_method: true,
        status: true,
        created_at: true,
      },
    });

    return {
      donation: mapDonation(donation),
    };
  },

  async remove(productId: string): Promise<void> {
    const existing = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      throw new NotFoundError('Product not found');
    }

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        is_active: false,
      },
    });
  },
};
