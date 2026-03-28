import type { CreatePaymentMethodInput } from './payment-methods.type.js';
import { paymentMethodsRepository } from './payment-methods.repository.js';

export const paymentMethodsService = {
  async list(userId: string) {
    return paymentMethodsRepository.findManyByUserId(userId);
  },

  async create(userId: string, payload: CreatePaymentMethodInput) {
    return paymentMethodsRepository.create(userId, payload);
  },

  async remove(paymentMethodId: string, userId: string) {
    return paymentMethodsRepository.remove(paymentMethodId, userId);
  },
};
