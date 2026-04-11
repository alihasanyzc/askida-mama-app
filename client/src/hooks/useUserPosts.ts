import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import { createPost, deletePost, listOwnPosts, uploadPostImage } from '../services/posts';
import type { PostRecord } from '../types/domain';
import { notifyPostDeleted } from './useDeletedPosts';
import { removeSavedPostFromCache } from './useSavedPosts';

export type UserPost = {
  id: string;
  image: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
  isSaved: boolean;
};

type CreateUserPostInput = {
  image: string;
  content?: string;
};

const listeners = new Set<(posts: UserPost[]) => void>();
let cachedPosts: UserPost[] = [];
let hasLoadedPosts = false;

const notifyListeners = (posts: UserPost[]) => {
  listeners.forEach((listener) => listener(posts));
};

const isServiceUnavailableError = (error: unknown) =>
  error instanceof AxiosError && error.response?.status === 503;

const isLocalImageUri = (uri: string) => !/^https?:\/\//i.test(uri);

const mapPostRecord = (post: PostRecord): UserPost => ({
  id: post.id,
  image: post.image_url,
  content: post.content,
  createdAt: post.created_at ?? new Date().toISOString(),
  likes: post.likes_count ?? 0,
  comments: post.comments_count ?? 0,
  isSaved: Boolean(post.is_saved),
});

function updateCachedPosts(posts: UserPost[], options?: { hasLoadedPosts?: boolean }) {
  cachedPosts = posts;

  if (typeof options?.hasLoadedPosts === 'boolean') {
    hasLoadedPosts = options.hasLoadedPosts;
  }

  notifyListeners(cachedPosts);
}

export const loadUserPosts = async (): Promise<UserPost[]> => {
  updateCachedPosts((await listOwnPosts()).map(mapPostRecord), { hasLoadedPosts: true });
  return cachedPosts;
};

export const createUserPost = async ({ image, content = '' }: CreateUserPostInput): Promise<UserPost> => {
  const imageUrl = isLocalImageUri(image) ? await uploadPostImage(image) : image;
  const createdPost = await createPost({
    image_url: imageUrl,
    content,
  });
  const newPost = mapPostRecord(createdPost);

  updateCachedPosts([newPost, ...cachedPosts.filter((post) => post.id !== newPost.id)], {
    hasLoadedPosts: true,
  });

  return newPost;
};

export const deleteUserPost = async (postId: string): Promise<void> => {
  await deletePost(postId);
  updateCachedPosts(cachedPosts.filter((post) => post.id !== postId), { hasLoadedPosts: true });
  removeSavedPostFromCache(postId);
  notifyPostDeleted(postId);
};

export const useUserPosts = () => {
  const [posts, setPosts] = useState<UserPost[]>(cachedPosts);
  const [isLoading, setIsLoading] = useState(!hasLoadedPosts);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await loadUserPosts();
      setError(null);
    } catch (refreshError) {
      setError(refreshError);
      if (!isServiceUnavailableError(refreshError)) {
        console.error('User posts refresh error:', refreshError);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    listeners.add(setPosts);

    if (!hasLoadedPosts) {
      void refresh();
    } else {
      setPosts(cachedPosts);
      setIsLoading(false);
    }

    return () => {
      listeners.delete(setPosts);
    };
  }, [refresh]);

  return { posts, isLoading, error, refresh };
};
