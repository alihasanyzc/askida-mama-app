const clinicRepository = require('../repositories/clinic.repository');
const ApiError = require('../utils/ApiError');

class ClinicService {
  async getAll(query = {}) {
    const { city, skip, take } = query;
    const where = { isActive: true };
    if (city) where.city = city;

    const [clinics, total] = await Promise.all([
      clinicRepository.findAll({ where, skip, take }),
      clinicRepository.count(where),
    ]);

    return { clinics, total };
  }

  async getById(id) {
    const clinic = await clinicRepository.findById(id);
    if (!clinic || !clinic.isActive) {
      throw ApiError.notFound('Klinik bulunamadı');
    }
    return clinic;
  }

  async create(data) {
    return clinicRepository.create(data);
  }

  async update(id, data) {
    const clinic = await clinicRepository.findById(id);
    if (!clinic) throw ApiError.notFound('Klinik bulunamadı');
    return clinicRepository.update(id, data);
  }

  async delete(id) {
    const clinic = await clinicRepository.findById(id);
    if (!clinic) throw ApiError.notFound('Klinik bulunamadı');
    return clinicRepository.update(id, { isActive: false });
  }
}

module.exports = new ClinicService();
