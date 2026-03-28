import type {
  CreateProductDonationInput,
  CreateProductInput,
} from './products.type.js';
import { productsRepository } from './products.repository.js';

export const productsService = {
  async list(animalType?: string) {
    return productsRepository.findMany(animalType);
  },

  async getById(productId: string) {
    return productsRepository.findById(productId);
  },

  async create(adminUserId: string, payload: CreateProductInput) {
    return productsRepository.create(adminUserId, payload);
  },

  async createDonation(
    productId: string,
    userId: string,
    payload: CreateProductDonationInput,
  ) {
    return productsRepository.createDonation(productId, userId, payload);
  },

  async remove(productId: string) {
    return productsRepository.remove(productId);
  },
};
