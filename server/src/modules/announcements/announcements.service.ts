import type {
  AnnouncementFilters,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from './announcements.type.js';
import { announcementsRepository } from './announcements.repository.js';

export const announcementsService = {
  async list(filters: AnnouncementFilters) {
    return announcementsRepository.findMany(filters);
  },

  async getById(announcementId: string) {
    return announcementsRepository.findById(announcementId);
  },

  async listByUserId(userId: string) {
    return announcementsRepository.findByUserId(userId);
  },

  async create(userId: string, payload: CreateAnnouncementInput) {
    return announcementsRepository.create(userId, payload);
  },

  async update(announcementId: string, userId: string, payload: UpdateAnnouncementInput) {
    return announcementsRepository.update(announcementId, userId, payload);
  },

  async remove(announcementId: string, userId: string) {
    return announcementsRepository.remove(announcementId, userId);
  },
};
