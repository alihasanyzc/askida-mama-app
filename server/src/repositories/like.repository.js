const prisma = require('../config/prisma');

class LikeRepository {
  async findByPostAndUser(postId, userId) {
    return prisma.like.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });
  }

  async create(postId, userId) {
    return prisma.like.create({
      data: { postId, userId },
    });
  }

  async delete(postId, userId) {
    return prisma.like.delete({
      where: {
        postId_userId: { postId, userId },
      },
    });
  }

  async findByPost(postId, { skip, take } = {}) {
    return prisma.like.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        user: {
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
    return prisma.like.count({ where: { postId } });
  }

  async isLiked(postId, userId) {
    const count = await prisma.like.count({
      where: { postId, userId },
    });
    return count > 0;
  }
}

module.exports = new LikeRepository();
