const BaseRepository = require('./base/BaseRepository');
const prisma = require('../config/prisma');

class PostRepository extends BaseRepository {
  constructor() {
    super('post');
  }

  async findAllWithRelations({ where = {}, orderBy = { createdAt: 'desc' }, skip, take } = {}) {
    return prisma.post.findMany({
      where: { ...where, isActive: true },
      orderBy,
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
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  async findByIdWithRelations(id) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
          },
        },
        comments: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
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
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  async findByAuthor(authorId, { skip, take } = {}) {
    return this.findAllWithRelations({
      where: { authorId },
      skip,
      take,
    });
  }

  async countActive(where = {}) {
    return prisma.post.count({
      where: { ...where, isActive: true },
    });
  }
}

module.exports = new PostRepository();
