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
