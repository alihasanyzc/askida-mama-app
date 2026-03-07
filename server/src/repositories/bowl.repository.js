const BaseRepository = require('./base/BaseRepository');
const prisma = require('../config/prisma');

class BowlRepository extends BaseRepository {
  constructor() {
    super('bowl');
  }

  async findAllWithOwner({ where = {}, orderBy = { createdAt: 'desc' }, skip, take } = {}) {
    return prisma.bowl.findMany({
      where: { ...where, status: 'ACTIVE' },
      orderBy,
      skip,
      take,
      include: {
        owner: {
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

  async findByQrCode(qrCode) {
    return prisma.bowl.findUnique({
      where: { qrCode },
      include: {
        owner: {
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

  async findNearby(latitude, longitude, radiusKm = 5) {
    // Basit bounding box hesaplaması
    const latDelta = radiusKm / 111.0;
    const lonDelta = radiusKm / (111.0 * Math.cos((latitude * Math.PI) / 180));

    return prisma.bowl.findMany({
      where: {
        status: 'ACTIVE',
        latitude: {
          gte: latitude - latDelta,
          lte: latitude + latDelta,
        },
        longitude: {
          gte: longitude - lonDelta,
          lte: longitude + lonDelta,
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async countActive() {
    return prisma.bowl.count({ where: { status: 'ACTIVE' } });
  }
}

module.exports = new BowlRepository();
