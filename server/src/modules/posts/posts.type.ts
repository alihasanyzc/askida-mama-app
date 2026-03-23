export type PostAuthorRecord = {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
};

export type PostLikeUserRecord = PostAuthorRecord;

export type PostCommentRecord = {
  id: string;
  post_id: string;
  user_id: string;
  text: string;
  created_at: string | null;
  author: PostAuthorRecord;
  likes_count: number;
  is_liked: boolean;
};

export type PostRecord = {
  id: string;
  user_id: string;
  image_url: string;
  content: string;
  category: string | null;
  is_priority: boolean;
  created_at: string | null;
  updated_at: string | null;
  author: PostAuthorRecord;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
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

export type CreatePostCommentInput = {
  text: string;
};
