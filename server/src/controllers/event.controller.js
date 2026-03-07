const eventService = require('../services/event.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { parsePagination, createPaginationMeta } = require('../utils/helpers');

const getAll = asyncHandler(async (req, res) => {
  const { skip, page, limit } = parsePagination(req.query);
  const { events, total } = await eventService.getAll({ skip, take: limit });
  const meta = createPaginationMeta(total, page, limit);
  ApiResponse.success(events, 'Etkinlikler', meta).send(res);
});

const getUpcoming = asyncHandler(async (req, res) => {
  const events = await eventService.getUpcoming();
  ApiResponse.success(events, 'Yaklaşan etkinlikler').send(res);
});

const getById = asyncHandler(async (req, res) => {
  const event = await eventService.getById(req.params.id);
  ApiResponse.success(event).send(res);
});

const create = asyncHandler(async (req, res) => {
  const event = await eventService.create(req.body);
  ApiResponse.created(event, 'Etkinlik oluşturuldu').send(res);
});

const update = asyncHandler(async (req, res) => {
  const event = await eventService.update(req.params.id, req.body);
  ApiResponse.success(event, 'Etkinlik güncellendi').send(res);
});

const remove = asyncHandler(async (req, res) => {
  await eventService.delete(req.params.id);
  ApiResponse.success(null, 'Etkinlik silindi').send(res);
});

module.exports = {
  getAll,
  getUpcoming,
  getById,
  create,
  update,
  remove,
};
