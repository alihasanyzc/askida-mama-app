const blogRepository = require('../repositories/blog.repository');
const ApiError = require('../utils/ApiError');

class BlogService {
  async getAll(query = {}) {
    const { category, skip, take } = query;
    const where = { isActive: true };
    if (category) where.category = category;

    const [blogs, total] = await Promise.all([
      blogRepository.findAll({ where, skip, take }),
      blogRepository.count(where),
    ]);

    return { blogs, total };
  }

  async getById(id) {
    const blog = await blogRepository.findById(id);
    if (!blog || !blog.isActive) {
      throw ApiError.notFound('Blog yazısı bulunamadı');
    }
    return blog;
  }

  async create(data) {
    return blogRepository.create(data);
  }

  async update(id, data) {
    const blog = await blogRepository.findById(id);
    if (!blog) throw ApiError.notFound('Blog yazısı bulunamadı');
    return blogRepository.update(id, data);
  }

  async delete(id) {
    const blog = await blogRepository.findById(id);
    if (!blog) throw ApiError.notFound('Blog yazısı bulunamadı');
    return blogRepository.update(id, { isActive: false });
  }
}

module.exports = new BlogService();
