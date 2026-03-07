const BaseRepository = require('./base/BaseRepository');
const prisma = require('../config/prisma');

class CommentRepository extends BaseRepository {
  constructor() {
    super('comment');
  }

  async findByPost(postId, { skip, take } = {}) {
    return prisma.comment.findMany({
      where: { postId, isActive: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async countByPost(postId) {
    return prisma.comment.count({
      where: { postId, isActive: true },
    });
  }
}

module.exports = new CommentRepository();
