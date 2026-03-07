const announcementService = require('../services/announcement.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { parsePagination, createPaginationMeta } = require('../utils/helpers');

const getAll = asyncHandler(async (req, res) => {
  const { skip, page, limit } = parsePagination(req.query);
  const { category } = req.query;
  const { announcements, total } = await announcementService.getAll({ category, skip, take: limit });
  const meta = createPaginationMeta(total, page, limit);
  ApiResponse.success(announcements, 'İlanlar', meta).send(res);
});

const getById = asyncHandler(async (req, res) => {
  const announcement = await announcementService.getById(req.params.id);
  ApiResponse.success(announcement).send(res);
});

const create = asyncHandler(async (req, res) => {
  const announcement = await announcementService.create(req.user.id, req.body);
  ApiResponse.created(announcement, 'İlan oluşturuldu').send(res);
});

const update = asyncHandler(async (req, res) => {
  const announcement = await announcementService.update(req.params.id, req.user.id, req.body);
  ApiResponse.success(announcement, 'İlan güncellendi').send(res);
});

const remove = asyncHandler(async (req, res) => {
  await announcementService.delete(req.params.id, req.user.id, req.user.role);
  ApiResponse.success(null, 'İlan silindi').send(res);
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
