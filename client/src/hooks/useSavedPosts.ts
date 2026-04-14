import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import { listSavedPosts } from '../services/posts';
import type { PostRecord } from '../types/domain';

export type SavedPost = {
  id: string;
  image: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
  category?: string;
  isSaved: boolean;
  author: {
    id?: string;
    name: string;
    username?: string;
    avatar: string;
  };
};

const DEFAULT_AVATAR_URL =
  'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png';

const listeners = new Set<(posts: SavedPost[]) => void>();
let cachedSavedPosts: SavedPost[] = [];
let hasLoadedSavedPosts = false;

const notifyListeners = (posts: SavedPost[]) => {
  listeners.forEach((listener) => listener(posts));
};

const isServiceUnavailableError = (error: unknown) =>
  error instanceof AxiosError && error.response?.status === 503;

function mapSavedPost(post: PostRecord): SavedPost {
  return {
    id: post.id,
    image: post.image_url,
    content: post.content,
    createdAt: post.created_at ?? new Date().toISOString(),
    likes: post.likes_count ?? 0,
    comments: post.comments_count ?? 0,
    category: post.category ?? undefined,
    isSaved: true,
    author: {
      id: post.author?.id ?? post.user_id,
      name: post.author?.full_name ?? 'Kullanıcı',
      username: post.author?.username,
      avatar: post.author?.avatar_url ?? DEFAULT_AVATAR_URL,
    },
  };
}

function updateCachedSavedPosts(posts: SavedPost[], options?: { hasLoadedSavedPosts?: boolean }) {
  cachedSavedPosts = posts;

  if (typeof options?.hasLoadedSavedPosts === 'boolean') {
    hasLoadedSavedPosts = options.hasLoadedSavedPosts;
  }

  notifyListeners(cachedSavedPosts);
}

export const loadSavedPosts = async (): Promise<SavedPost[]> => {
  updateCachedSavedPosts((await listSavedPosts()).map(mapSavedPost), { hasLoadedSavedPosts: true });
  return cachedSavedPosts;
};

export const clearCachedSavedPosts = () => {
  updateCachedSavedPosts([], { hasLoadedSavedPosts: false });
};

export const addSavedPostToCache = (post: PostRecord) => {
  const nextSavedPost = mapSavedPost(post);
  const nextPosts = [nextSavedPost, ...cachedSavedPosts.filter((item) => item.id !== post.id)];

  updateCachedSavedPosts(nextPosts, { hasLoadedSavedPosts });
};

export const removeSavedPostFromCache = (postId: string) => {
  updateCachedSavedPosts(
    cachedSavedPosts.filter((post) => post.id !== postId),
    { hasLoadedSavedPosts },
  );
};

export const useSavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>(cachedSavedPosts);
  const [isLoading, setIsLoading] = useState(!hasLoadedSavedPosts);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await loadSavedPosts();
      setError(null);
    } catch (refreshError) {
      setError(refreshError);
      if (!isServiceUnavailableError(refreshError)) {
        console.error('Saved posts refresh error:', refreshError);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    listeners.add(setSavedPosts);

    if (!hasLoadedSavedPosts) {
      void refresh();
    } else {
      setSavedPosts(cachedSavedPosts);
      setIsLoading(false);
    }

    return () => {
      listeners.delete(setSavedPosts);
    };
  }, [refresh]);

  return { savedPosts, isLoading, error, refresh };
};
