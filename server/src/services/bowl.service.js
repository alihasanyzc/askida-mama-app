const bowlRepository = require('../repositories/bowl.repository');
const ApiError = require('../utils/ApiError');
const { v4: uuidv4 } = require('uuid');

class BowlService {
  async getAll(query = {}) {
    const { skip, take } = query;

    const [bowls, total] = await Promise.all([
      bowlRepository.findAllWithOwner({ skip, take }),
      bowlRepository.countActive(),
    ]);

    return { bowls, total };
  }

  async getById(id) {
    const bowl = await bowlRepository.findById(id, {
      owner: {
        select: {
          id: true,
          fullName: true,
          username: true,
          avatarUrl: true,
        },
      },
    });

    if (!bowl) throw ApiError.notFound('Mama kabı bulunamadı');
    return bowl;
  }

  async create(ownerId, data) {
    return bowlRepository.create({
      ...data,
      ownerId,
      qrCode: `BOWL-${uuidv4().slice(0, 8).toUpperCase()}`,
    });
  }

  async update(id, ownerId, data) {
    const bowl = await bowlRepository.findById(id);
    if (!bowl) throw ApiError.notFound('Mama kabı bulunamadı');
    if (bowl.ownerId !== ownerId) throw ApiError.forbidden('Bu kabı düzenleme yetkiniz yok');

    return bowlRepository.update(id, data);
  }

  async delete(id, ownerId, userRole) {
    const bowl = await bowlRepository.findById(id);
    if (!bowl) throw ApiError.notFound('Mama kabı bulunamadı');
    if (bowl.ownerId !== ownerId && userRole !== 'ADMIN') {
      throw ApiError.forbidden('Bu kabı silme yetkiniz yok');
    }

    return bowlRepository.update(id, { status: 'INACTIVE' });
  }

  async getNearby(latitude, longitude, radius) {
    return bowlRepository.findNearby(latitude, longitude, radius);
  }

  async getByQrCode(qrCode) {
    const bowl = await bowlRepository.findByQrCode(qrCode);
    if (!bowl) throw ApiError.notFound('QR kodu bulunamadı');
    return bowl;
  }

  async fillBowl(id) {
    const bowl = await bowlRepository.findById(id);
    if (!bowl) throw ApiError.notFound('Mama kabı bulunamadı');

    return bowlRepository.update(id, {
      capacity: 100,
      lastFilled: new Date(),
    });
  }
}

module.exports = new BowlService();
