export type PostRecord = {
  id: string;
  user_id: string;
  image_url: string;
  content: string;
  category: string | null;
  is_priority: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type CreatePostInput = {
  image_url: string;
  content: string;
  category?: string | null;
};

export type UpdatePostInput = {
  image_url?: string;
  content?: string;
  category?: string | null;
};
