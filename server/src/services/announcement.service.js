const announcementRepository = require('../repositories/announcement.repository');
const ApiError = require('../utils/ApiError');

class AnnouncementService {
  async getAll(query = {}) {
    const { category, skip, take } = query;
    const where = {};
    if (category) where.category = category;

    const [announcements, total] = await Promise.all([
      announcementRepository.findAllWithAuthor({ where, skip, take }),
      announcementRepository.countActive(where),
    ]);

    return { announcements, total };
  }

  async getById(id) {
    const announcement = await announcementRepository.findById(id, {
      author: {
        select: {
          id: true,
          fullName: true,
          username: true,
          avatarUrl: true,
        },
      },
    });

    if (!announcement || !announcement.isActive) {
      throw ApiError.notFound('İlan bulunamadı');
    }
    return announcement;
  }

  async create(authorId, data) {
    return announcementRepository.create({
      ...data,
      authorId,
    });
  }

  async update(id, authorId, data) {
    const announcement = await announcementRepository.findById(id);
    if (!announcement) throw ApiError.notFound('İlan bulunamadı');
    if (announcement.authorId !== authorId) {
      throw ApiError.forbidden('Bu ilanı düzenleme yetkiniz yok');
    }

    return announcementRepository.update(id, data);
  }

  async delete(id, authorId, userRole) {
    const announcement = await announcementRepository.findById(id);
    if (!announcement) throw ApiError.notFound('İlan bulunamadı');
    if (announcement.authorId !== authorId && userRole !== 'ADMIN') {
      throw ApiError.forbidden('Bu ilanı silme yetkiniz yok');
    }

    return announcementRepository.update(id, { isActive: false });
  }
}

module.exports = new AnnouncementService();
