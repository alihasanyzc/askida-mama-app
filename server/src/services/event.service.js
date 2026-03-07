const eventRepository = require('../repositories/event.repository');
const ApiError = require('../utils/ApiError');

class EventService {
  async getAll(query = {}) {
    const { skip, take } = query;
    const where = { isActive: true };

    const [events, total] = await Promise.all([
      eventRepository.findAll({ where, orderBy: { date: 'asc' }, skip, take }),
      eventRepository.count(where),
    ]);

    return { events, total };
  }

  async getUpcoming() {
    return eventRepository.findAll({
      where: {
        isActive: true,
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
      take: 10,
    });
  }

  async getById(id) {
    const event = await eventRepository.findById(id);
    if (!event || !event.isActive) {
      throw ApiError.notFound('Etkinlik bulunamadı');
    }
    return event;
  }

  async create(data) {
    return eventRepository.create(data);
  }

  async update(id, data) {
    const event = await eventRepository.findById(id);
    if (!event) throw ApiError.notFound('Etkinlik bulunamadı');
    return eventRepository.update(id, data);
  }

  async delete(id) {
    const event = await eventRepository.findById(id);
    if (!event) throw ApiError.notFound('Etkinlik bulunamadı');
    return eventRepository.update(id, { isActive: false });
  }
}

module.exports = new EventService();
