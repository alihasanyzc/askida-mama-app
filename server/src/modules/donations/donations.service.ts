import type { CreateGeneralDonationInput } from './donations.type.js';
import { donationsRepository } from './donations.repository.js';

export const donationsService = {
  async createGeneralDonation(userId: string, payload: CreateGeneralDonationInput) {
    return donationsRepository.createGeneralDonation(userId, payload);
  },
};
