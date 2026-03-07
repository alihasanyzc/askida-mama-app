const BaseRepository = require('./base/BaseRepository');

class EventRepository extends BaseRepository {
  constructor() {
    super('event');
  }
}

module.exports = new EventRepository();
