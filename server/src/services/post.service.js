const postRepository = require('../repositories/post.repository');
const likeRepository = require('../repositories/like.repository');
const commentRepository = require('../repositories/comment.repository');
const ApiError = require('../utils/ApiError');

class PostService {
  async getAll(query = {}) {
    const { category, skip, take } = query;
    const where = {};
    if (category) where.category = category;

    const [posts, total] = await Promise.all([
      postRepository.findAllWithRelations({ where, skip, take }),
      postRepository.countActive(where),
    ]);

    return { posts, total };
  }

  async getById(id, userId = null) {
    const post = await postRepository.findByIdWithRelations(id);
    if (!post || !post.isActive) {
      throw ApiError.notFound('Gönderi bulunamadı');
    }

    // Kullanıcının beğenip beğenmediğini kontrol et
    let isLiked = false;
    if (userId) {
      isLiked = await likeRepository.isLiked(id, userId);
    }

    return { ...post, isLiked };
  }

  async create(authorId, data) {
    return postRepository.create({
      ...data,
      authorId,
    });
  }

  async update(id, userId, data) {
    const post = await postRepository.findById(id);
    if (!post) throw ApiError.notFound('Gönderi bulunamadı');
    if (post.authorId !== userId) throw ApiError.forbidden('Bu gönderiyi düzenleme yetkiniz yok');

    return postRepository.update(id, data);
  }

  async delete(id, userId, userRole) {
    const post = await postRepository.findById(id);
    if (!post) throw ApiError.notFound('Gönderi bulunamadı');
    if (post.authorId !== userId && userRole !== 'ADMIN') {
      throw ApiError.forbidden('Bu gönderiyi silme yetkiniz yok');
    }

    return postRepository.update(id, { isActive: false }); // Soft delete
  }

  async getByUser(userId, pagination) {
    const [posts, total] = await Promise.all([
      postRepository.findByAuthor(userId, pagination),
      postRepository.countActive({ authorId: userId }),
    ]);
    return { posts, total };
  }

  // Like işlemleri
  async toggleLike(postId, userId) {
    const post = await postRepository.findById(postId);
    if (!post || !post.isActive) throw ApiError.notFound('Gönderi bulunamadı');

    const isLiked = await likeRepository.isLiked(postId, userId);

    if (isLiked) {
      await likeRepository.delete(postId, userId);
      return { liked: false };
    } else {
      await likeRepository.create(postId, userId);
      return { liked: true };
    }
  }

  async getLikes(postId, pagination) {
    const [likes, total] = await Promise.all([
      likeRepository.findByPost(postId, pagination),
      likeRepository.countByPost(postId),
    ]);
    return { likes, total };
  }

  // Comment işlemleri
  async addComment(postId, authorId, content) {
    const post = await postRepository.findById(postId);
    if (!post || !post.isActive) throw ApiError.notFound('Gönderi bulunamadı');

    return commentRepository.create({
      postId,
      authorId,
      content,
    });
  }

  async getComments(postId, pagination) {
    const [comments, total] = await Promise.all([
      commentRepository.findByPost(postId, pagination),
      commentRepository.countByPost(postId),
    ]);
    return { comments, total };
  }

  async deleteComment(commentId, userId, userRole) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) throw ApiError.notFound('Yorum bulunamadı');
    if (comment.authorId !== userId && userRole !== 'ADMIN') {
      throw ApiError.forbidden('Bu yorumu silme yetkiniz yok');
    }

    return commentRepository.update(commentId, { isActive: false });
  }
}

module.exports = new PostService();
