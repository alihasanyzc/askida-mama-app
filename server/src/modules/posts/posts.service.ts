import type {
  CreatePostCommentInput,
  CreatePostInput,
  UpdatePostInput,
} from './posts.type.js';
import { postsRepository } from './posts.repository.js';
import { postsStorage } from './posts.storage.js';

export const postsService = {
  async create(userId: string, payload: CreatePostInput) {
    return postsRepository.create(userId, payload);
  },

  async uploadImage(userId: string, file: Express.Multer.File) {
    const imageUrl = await postsStorage.uploadPostImage({
      userId,
      file,
    });

    return {
      image_url: imageUrl,
    };
  },

  async list(viewerId?: string) {
    return postsRepository.findMany(viewerId);
  },

  async listFeed(userId: string) {
    return postsRepository.findFeed(userId);
  },

  async getById(postId: string, viewerId?: string) {
    return postsRepository.findById(postId, viewerId);
  },

  async listOwn(userId: string) {
    return postsRepository.findByUserId(userId, userId);
  },

  async listSaved(userId: string) {
    return postsRepository.findSavedByUserId(userId);
  },

  async update(postId: string, userId: string, payload: UpdatePostInput) {
    return postsRepository.update(postId, userId, payload);
  },

  async remove(postId: string, userId: string) {
    return postsRepository.remove(postId, userId);
  },

  async like(postId: string, userId: string) {
    return postsRepository.like(postId, userId);
  },

  async unlike(postId: string, userId: string) {
    return postsRepository.unlike(postId, userId);
  },

  async save(postId: string, userId: string) {
    return postsRepository.save(postId, userId);
  },

  async unsave(postId: string, userId: string) {
    return postsRepository.unsave(postId, userId);
  },

  async createComment(postId: string, userId: string, payload: CreatePostCommentInput) {
    return postsRepository.createComment(postId, userId, payload);
  },

  async removeComment(commentId: string, userId: string) {
    return postsRepository.removeComment(commentId, userId);
  },

  async listComments(postId: string, viewerId?: string) {
    return postsRepository.findComments(postId, viewerId);
  },

  async likeComment(commentId: string, userId: string) {
    return postsRepository.likeComment(commentId, userId);
  },

  async unlikeComment(commentId: string, userId: string) {
    return postsRepository.unlikeComment(commentId, userId);
  },

  async listLikes(postId: string) {
    return postsRepository.findPostLikes(postId);
  },
};
