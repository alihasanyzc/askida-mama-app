import type { PostRecord } from '../posts/posts.type.js';
import type { AnnouncementRecord } from '../announcements/announcements.type.js';

export type ProfileRecord = {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  cover_photo_url: string | null;
  bio: string | null;
  phone: string | null;
  role: string;
  created_at: string | null;
  updated_at: string | null;
};

export type ProfileStatsRecord = {
  followers: number;
  following: number;
  posts: number;
};

export type ProfileViewRecord = ProfileRecord & {
  name: string;
  avatar: string | null;
  cover_photo: string | null;
  stats: ProfileStatsRecord;
  is_own_profile: boolean;
};

export type ProfileSummaryRecord = {
  id: string;
  full_name: string;
  name: string;
  username: string;
  avatar_url: string | null;
  avatar: string | null;
  is_following: boolean;
  is_self: boolean;
};

export type CreateProfileInput = {
  id: string;
  full_name: string;
  username: string;
  phone?: string | null;
};

export type UpdateProfileInput = {
  full_name?: string;
  username?: string;
  avatar_url?: string | null;
  cover_photo_url?: string | null;
  bio?: string | null;
  phone?: string | null;
};

export type UploadProfileImageResult = {
  image_url: string;
  profile: ProfileRecord;
};

export type OwnProfileRecord = ProfileViewRecord & {
  followers_count: number;
  following_count: number;
  posts_count: number;
  posts: PostRecord[];
  announcements: AnnouncementRecord[];
  saved_posts: PostRecord[];
};

export type PublicProfileRecord = ProfileViewRecord & {
  followers_count: number;
  following_count: number;
  posts_count: number;
  posts: PostRecord[];
  announcements: AnnouncementRecord[];
  is_following: boolean;
};
