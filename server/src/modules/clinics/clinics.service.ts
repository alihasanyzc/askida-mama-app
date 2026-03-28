import type {
  CreateClinicDonationInput,
  CreateClinicInput,
} from './clinics.type.js';
import { clinicsRepository } from './clinics.repository.js';

export const clinicsService = {
  async list(filters: { city?: string; district?: string }) {
    return clinicsRepository.findMany(filters);
  },

  async getById(clinicId: string, userId?: string) {
    return clinicsRepository.findById(clinicId, userId);
  },

  async create(adminUserId: string, payload: CreateClinicInput) {
    return clinicsRepository.create(adminUserId, payload);
  },

  async remove(clinicId: string) {
    return clinicsRepository.remove(clinicId);
  },

  async createDonation(
    clinicId: string,
    userId: string,
    payload: CreateClinicDonationInput,
  ) {
    return clinicsRepository.createDonation(clinicId, userId, payload);
  },
};
