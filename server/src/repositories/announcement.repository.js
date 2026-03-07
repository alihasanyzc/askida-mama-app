const BaseRepository = require('./base/BaseRepository');
const prisma = require('../config/prisma');

class AnnouncementRepository extends BaseRepository {
  constructor() {
    super('announcement');
  }

  async findAllWithAuthor({ where = {}, orderBy = { createdAt: 'desc' }, skip, take } = {}) {
    return prisma.announcement.findMany({
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
      },
    });
  }

  async countActive(where = {}) {
    return prisma.announcement.count({
      where: { ...where, isActive: true },
    });
  }
}

module.exports = new AnnouncementRepository();
