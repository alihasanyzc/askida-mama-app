import { ConflictError } from '../../common/errors/base-error.js';
import { announcementsRepository } from '../announcements/announcements.repository.js';
import { postsRepository } from '../posts/posts.repository.js';
import { profilesRepository } from './profiles.repository.js';
import { profilesStorage } from './profiles.storage.js';
import type { UpdateProfileInput } from './profiles.type.js';

export const profilesService = {
  async getOwnProfile(userId: string) {
    const [profile, posts, announcements, stats, savedPosts] = await Promise.all([
      profilesRepository.getById(userId),
      postsRepository.findByUserId(userId, userId),
      announcementsRepository.findByUserId(userId),
      profilesRepository.getStats(userId, userId),
      postsRepository.findSavedByUserId(userId),
    ]);

    return {
      ...profile,
      followers_count: stats.followers_count,
      following_count: stats.following_count,
      posts_count: stats.posts_count,
      posts,
      announcements,
      saved_posts: savedPosts,
    };
  },

  async getProfileById(profileId: string, viewerId?: string) {
    const [profile, posts, announcements, stats] = await Promise.all([
      profilesRepository.getById(profileId),
      postsRepository.findByUserId(profileId, viewerId),
      announcementsRepository.findByUserId(profileId),
      profilesRepository.getStats(profileId, viewerId),
    ]);

    return {
      ...profile,
      followers_count: stats.followers_count,
      following_count: stats.following_count,
      posts_count: stats.posts_count,
      posts,
      announcements,
      is_following: stats.is_following,
    };
  },

  async listAnnouncements(profileId: string) {
    return announcementsRepository.findByUserId(profileId);
  },

  async followProfile(userId: string, profileId: string) {
    await profilesRepository.follow(userId, profileId);

    return this.getProfileById(profileId, userId);
  },

  async unfollowProfile(userId: string, profileId: string) {
    await profilesRepository.unfollow(userId, profileId);

    return this.getProfileById(profileId, userId);
  },

  async listFollowers(profileId: string, viewerId?: string) {
    return profilesRepository.listFollowers(profileId, viewerId);
  },

  async listFollowing(profileId: string, viewerId?: string) {
    return profilesRepository.listFollowing(profileId, viewerId);
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
