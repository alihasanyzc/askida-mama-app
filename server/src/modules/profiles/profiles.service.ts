import { ConflictError } from '../../common/errors/base-error.js';
import { announcementsRepository } from '../announcements/announcements.repository.js';
import { postsRepository } from '../posts/posts.repository.js';
import { profilesRepository } from './profiles.repository.js';
import { profilesStorage } from './profiles.storage.js';
import type {
  OwnProfileRecord,
  ProfileRecord,
  PublicProfileRecord,
  UpdateProfileInput,
} from './profiles.type.js';

function buildProfileView(
  profile: ProfileRecord,
  stats: {
    followers_count: number;
    following_count: number;
    posts_count: number;
    is_following?: boolean;
  },
  isOwnProfile: boolean,
) {
  return {
    ...profile,
    name: profile.full_name,
    avatar: profile.avatar_url,
    cover_photo: profile.cover_photo_url,
    is_own_profile: isOwnProfile,
    stats: {
      posts: stats.posts_count,
      followers: stats.followers_count,
      following: stats.following_count,
    },
  };
}

export const profilesService = {
  async getOwnProfile(userId: string): Promise<OwnProfileRecord> {
    const [profile, posts, announcements, stats, savedPosts] = await Promise.all([
      profilesRepository.getById(userId),
      postsRepository.findByUserId(userId, userId),
      announcementsRepository.findByUserId(userId),
      profilesRepository.getStats(userId, userId),
      postsRepository.findSavedByUserId(userId),
    ]);

    return {
      ...buildProfileView(profile, stats, true),
      followers_count: stats.followers_count,
      following_count: stats.following_count,
      posts_count: stats.posts_count,
      posts,
      announcements,
      saved_posts: savedPosts,
    };
  },

  async getProfileById(profileId: string, viewerId?: string): Promise<PublicProfileRecord> {
    const [profile, posts, announcements, stats] = await Promise.all([
      profilesRepository.getById(profileId),
      postsRepository.findByUserId(profileId, viewerId),
      announcementsRepository.findByUserId(profileId),
      profilesRepository.getStats(profileId, viewerId),
    ]);

    return {
      ...buildProfileView(profile, stats, profile.id === viewerId),
      followers_count: stats.followers_count,
      following_count: stats.following_count,
      posts_count: stats.posts_count,
      posts,
      announcements,
      is_following: stats.is_following,
    };
  },

  async getProfileByUsername(username: string, viewerId?: string) {
    const profile = await profilesRepository.getByUsername(username);

    if (viewerId && profile.id === viewerId) {
      return this.getOwnProfile(viewerId);
    }

    return this.getProfileById(profile.id, viewerId);
  },

  async searchProfiles(query: string, viewerId?: string) {
    return profilesRepository.search(query, viewerId);
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

  async removeFollower(userId: string, followerId: string) {
    return profilesRepository.removeFollower(userId, followerId);
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
