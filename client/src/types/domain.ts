export type ApiImageRecord = {
  id: string;
  image_url: string;
  display_order: number;
};

export type AuthorRecord = {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
};

export type ProfileStats = {
  posts: number;
  followers: number;
  following: number;
};

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
  name?: string;
  avatar?: string | null;
  cover_photo?: string | null;
  is_own_profile?: boolean;
  is_following?: boolean;
  stats?: ProfileStats;
};

export type BowlRecord = {
  id: string;
  qr_code?: string;
  status: string;
  status_color?: string;
  status_label?: string;
  latitude?: number;
  longitude?: number;
  location_note?: string | null;
  location_description?: string | null;
  maps_url?: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export type PostRecord = {
  id: string;
  user_id: string;
  image_url: string;
  thumbnail_url: string;
  content: string;
  category: string | null;
  is_priority: boolean;
  created_at: string | null;
  updated_at: string | null;
  author?: AuthorRecord;
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
  is_saved?: boolean;
};

export type AnnouncementRecord = {
  id: string;
  user_id: string;
  category: string;
  title: string;
  description: string;
  cover_image_url: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  city: string | null;
  district: string | null;
  location_note: string | null;
  maps_url: string;
  phone: string | null;
  email: string | null;
  status: string;
  is_priority: boolean;
  report_type: string | null;
  animal_type: string | null;
  age: string | null;
  gender: string | null;
  neutered: string | null;
  vaccination: string | null;
  health_status: string | null;
  environment: string | null;
  created_at: string | null;
  updated_at: string | null;
  author: AuthorRecord;
  images: ApiImageRecord[];
};

export type EventRecord = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  organizer: string;
  event_date: string;
  latitude: number;
  longitude: number;
  address: string | null;
  city: string | null;
  district: string | null;
  location_note: string | null;
  status: string;
  is_active: boolean;
  created_by: string;
  created_at: string | null;
  updated_at: string | null;
  creator: AuthorRecord;
  registrations_count: number;
  is_registered: boolean;
};

export type PaymentMethodRecord = {
  id: string;
  brand: string;
  last4: string;
  masked_number: string;
  cardholder_name: string;
  expiry_month: number;
  expiry_year: number;
  expiry_date: string;
  card_type: string | null;
  is_default: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type ClinicRecord = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  latitude: number;
  longitude: number;
  city: string | null;
  district: string | null;
  location_description: string | null;
  maps_url: string;
  created_at: string | null;
  updated_at: string | null;
};

export type ProductRecord = {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  image?: string;
  animal_type?: 'cat' | 'dog';
  category?: string;
  price: number;
  unit?: string;
  weight?: string;
  nutrition_info?: string | null;
};

export type UserProfilePreview = {
  id?: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  stats?: {
    blogs: number;
    followers: number;
    following: number;
    rank?: number;
  };
  is_following?: boolean;
  donations?: {
    food: { current: number; goal: number };
    medical: { current: number; goal: number };
  };
};
