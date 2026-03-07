const BaseRepository = require('./base/BaseRepository');

class ClinicRepository extends BaseRepository {
  constructor() {
    super('clinic');
  }
}

module.exports = new ClinicRepository();
