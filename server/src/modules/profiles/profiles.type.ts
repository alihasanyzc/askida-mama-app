import type { PostRecord } from '../posts/posts.type.js';

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

export type ProfileSummaryRecord = {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  is_following: boolean;
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

export type OwnProfileRecord = ProfileRecord & {
  followers_count: number;
  following_count: number;
  posts_count: number;
  posts: PostRecord[];
  saved_posts: PostRecord[];
};

export type PublicProfileRecord = ProfileRecord & {
  followers_count: number;
  following_count: number;
  posts_count: number;
  posts: PostRecord[];
  is_following: boolean;
};
