const blogService = require('../services/blog.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { parsePagination, createPaginationMeta } = require('../utils/helpers');

const getAll = asyncHandler(async (req, res) => {
  const { skip, page, limit } = parsePagination(req.query);
  const { category } = req.query;
  const { blogs, total } = await blogService.getAll({ category, skip, take: limit });
  const meta = createPaginationMeta(total, page, limit);
  ApiResponse.success(blogs, 'Blog yazıları', meta).send(res);
});

const getById = asyncHandler(async (req, res) => {
  const blog = await blogService.getById(req.params.id);
  ApiResponse.success(blog).send(res);
});

const create = asyncHandler(async (req, res) => {
  const blog = await blogService.create(req.body);
  ApiResponse.created(blog, 'Blog yazısı oluşturuldu').send(res);
});

const update = asyncHandler(async (req, res) => {
  const blog = await blogService.update(req.params.id, req.body);
  ApiResponse.success(blog, 'Blog yazısı güncellendi').send(res);
});

const remove = asyncHandler(async (req, res) => {
  await blogService.delete(req.params.id);
  ApiResponse.success(null, 'Blog yazısı silindi').send(res);
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
