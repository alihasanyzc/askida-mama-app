const BaseRepository = require('./base/BaseRepository');

class BlogRepository extends BaseRepository {
  constructor() {
    super('blog');
  }
}

module.exports = new BlogRepository();
