const deletedPostListeners = new Set<(postId: string) => void>();

export function notifyPostDeleted(postId: string) {
  deletedPostListeners.forEach((listener) => listener(postId));
}

export function subscribeToDeletedPosts(listener: (postId: string) => void) {
  deletedPostListeners.add(listener);

  return () => {
    deletedPostListeners.delete(listener);
  };
}
