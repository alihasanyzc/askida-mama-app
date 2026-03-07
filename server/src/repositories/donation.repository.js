const BaseRepository = require('./base/BaseRepository');
const prisma = require('../config/prisma');

class DonationRepository extends BaseRepository {
  constructor() {
    super('donation');
  }

  async findAllWithDonor({ where = {}, orderBy = { createdAt: 'desc' }, skip, take } = {}) {
    return prisma.donation.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        donor: {
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

  async findByDonor(donorId, { skip, take } = {}) {
    return this.findAllWithDonor({
      where: { donorId },
      skip,
      take,
    });
  }

  async getTotalAmount(where = {}) {
    const result = await prisma.donation.aggregate({
      where: { ...where, status: 'COMPLETED' },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }
}

module.exports = new DonationRepository();
