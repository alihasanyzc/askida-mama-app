import { ConflictError } from '../../common/errors/base-error.js';
import { profilesRepository } from './profiles.repository.js';
import type { UpdateProfileInput } from './profiles.type.js';

export const profilesService = {
  async getOwnProfile(userId: string) {
    return profilesRepository.getById(userId);
  },

  async updateOwnProfile(userId: string, payload: UpdateProfileInput) {
    if (payload.username) {
      const existingProfile = await profilesRepository.findByUsername(payload.username);

      if (existingProfile && existingProfile.id !== userId) {
        throw new ConflictError('Username is already in use');
      }
    }

    return profilesRepository.update(userId, payload);
  },
};
