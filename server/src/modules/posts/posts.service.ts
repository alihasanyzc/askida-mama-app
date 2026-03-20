import type { CreatePostInput, UpdatePostInput } from './posts.type.js';
import { postsRepository } from './posts.repository.js';

export const postsService = {
  async create(userId: string, payload: CreatePostInput) {
    return postsRepository.create(userId, payload);
  },

  async list() {
    return postsRepository.findMany();
  },

  async getById(postId: string) {
    return postsRepository.findById(postId);
  },

  async listOwn(userId: string) {
    return postsRepository.findByUserId(userId);
  },

  async update(postId: string, userId: string, payload: UpdatePostInput) {
    return postsRepository.update(postId, userId, payload);
  },

  async remove(postId: string, userId: string) {
    return postsRepository.remove(postId, userId);
  },
};
