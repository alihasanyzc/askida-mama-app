const donationRepository = require('../repositories/donation.repository');
const ApiError = require('../utils/ApiError');

class DonationService {
  async getAll(query = {}) {
    const { type, status, skip, take } = query;
    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const [donations, total] = await Promise.all([
      donationRepository.findAllWithDonor({ where, skip, take }),
      donationRepository.count(where),
    ]);

    return { donations, total };
  }

  async getById(id) {
    const donation = await donationRepository.findById(id, {
      donor: {
        select: {
          id: true,
          fullName: true,
          username: true,
          avatarUrl: true,
        },
      },
    });

    if (!donation) throw ApiError.notFound('Bağış bulunamadı');
    return donation;
  }

  async create(donorId, data) {
    return donationRepository.create({
      ...data,
      donorId,
    });
  }

  async updateStatus(id, status) {
    const donation = await donationRepository.findById(id);
    if (!donation) throw ApiError.notFound('Bağış bulunamadı');

    return donationRepository.update(id, { status });
  }

  async getByDonor(donorId, pagination) {
    const [donations, total] = await Promise.all([
      donationRepository.findByDonor(donorId, pagination),
      donationRepository.count({ donorId }),
    ]);
    return { donations, total };
  }

  async getStats() {
    const [totalAmount, totalCount, completedCount] = await Promise.all([
      donationRepository.getTotalAmount(),
      donationRepository.count(),
      donationRepository.count({ status: 'COMPLETED' }),
    ]);

    return { totalAmount, totalCount, completedCount };
  }
}

module.exports = new DonationService();
