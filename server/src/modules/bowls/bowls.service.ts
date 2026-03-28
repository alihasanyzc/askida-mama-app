import type {
  CreateBowlDonationInput,
  UpdateBowlAddressInput,
  UpdateBowlStatusInput,
} from './bowls.type.js';
import { bowlsRepository } from './bowls.repository.js';

export const bowlsService = {
  async listMapBowls() {
    return bowlsRepository.findMany();
  },

  async getBowlDetail(bowlId: string, userId?: string) {
    return bowlsRepository.findById(bowlId, userId);
  },

  async getBowlDetailByQrCode(qrCode: string, userId?: string) {
    return bowlsRepository.findByQrCode(qrCode, userId);
  },

  async updateStatus(bowlId: string, userId: string, payload: UpdateBowlStatusInput) {
    return bowlsRepository.updateStatus(bowlId, userId, payload);
  },

  async updateAddress(bowlId: string, userId: string, payload: UpdateBowlAddressInput) {
    return bowlsRepository.updateAddress(bowlId, userId, payload);
  },

  async createDonation(
    bowlId: string,
    userId: string,
    payload: CreateBowlDonationInput,
  ) {
    return bowlsRepository.createDonation(bowlId, userId, payload);
  },
};
