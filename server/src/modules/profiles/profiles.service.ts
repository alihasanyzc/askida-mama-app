import { ConflictError } from '../../common/errors/base-error.js';
import { profilesRepository } from './profiles.repository.js';
import { profilesStorage } from './profiles.storage.js';
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

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const imageUrl = await profilesStorage.uploadProfileImage({
      userId,
      type: 'avatar',
      file,
    });

    const profile = await profilesRepository.update(userId, {
      avatar_url: imageUrl,
    });

    return {
      image_url: imageUrl,
      profile,
    };
  },

  async uploadCoverPhoto(userId: string, file: Express.Multer.File) {
    const imageUrl = await profilesStorage.uploadProfileImage({
      userId,
      type: 'cover',
      file,
    });

    const profile = await profilesRepository.update(userId, {
      cover_photo_url: imageUrl,
    });

    return {
      image_url: imageUrl,
      profile,
    };
  },
};
