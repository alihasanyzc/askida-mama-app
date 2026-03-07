const prisma = require('../config/prisma');

class FollowRepository {
  async follow(followerId, followingId) {
    return prisma.follow.create({
      data: { followerId, followingId },
    });
  }

  async unfollow(followerId, followingId) {
    return prisma.follow.delete({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
  }

  async isFollowing(followerId, followingId) {
    const count = await prisma.follow.count({
      where: { followerId, followingId },
    });
    return count > 0;
  }

  async getFollowers(userId, { skip, take } = {}) {
    return prisma.follow.findMany({
      where: { followingId: userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        follower: {
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

  async getFollowing(userId, { skip, take } = {}) {
    return prisma.follow.findMany({
      where: { followerId: userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        following: {
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

  async countFollowers(userId) {
    return prisma.follow.count({ where: { followingId: userId } });
  }

  async countFollowing(userId) {
    return prisma.follow.count({ where: { followerId: userId } });
  }
}

module.exports = new FollowRepository();
