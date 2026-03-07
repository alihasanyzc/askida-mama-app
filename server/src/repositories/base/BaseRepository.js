const prisma = require('../../config/prisma');

/**
 * Base Repository
 * Tüm repository'ler için ortak CRUD işlemleri
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll({ where = {}, orderBy = { createdAt: 'desc' }, skip, take, include } = {}) {
    return prisma[this.model].findMany({
      where,
      orderBy,
      ...(skip !== undefined && { skip }),
      ...(take !== undefined && { take }),
      ...(include && { include }),
    });
  }

  async findById(id, include) {
    return prisma[this.model].findUnique({
      where: { id },
      ...(include && { include }),
    });
  }

  async findOne(where, include) {
    return prisma[this.model].findFirst({
      where,
      ...(include && { include }),
    });
  }

  async create(data) {
    return prisma[this.model].create({ data });
  }

  async update(id, data) {
    return prisma[this.model].update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma[this.model].delete({
      where: { id },
    });
  }

  async count(where = {}) {
    return prisma[this.model].count({ where });
  }

  async exists(where) {
    const count = await prisma[this.model].count({ where });
    return count > 0;
  }
}

module.exports = BaseRepository;
