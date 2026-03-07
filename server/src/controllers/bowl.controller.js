const bowlService = require('../services/bowl.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { parsePagination, createPaginationMeta } = require('../utils/helpers');

const getAll = asyncHandler(async (req, res) => {
  const { skip, page, limit } = parsePagination(req.query);
  const { bowls, total } = await bowlService.getAll({ skip, take: limit });
  const meta = createPaginationMeta(total, page, limit);
  ApiResponse.success(bowls, 'Mama kapları', meta).send(res);
});

const getById = asyncHandler(async (req, res) => {
  const bowl = await bowlService.getById(req.params.id);
  ApiResponse.success(bowl).send(res);
});

const create = asyncHandler(async (req, res) => {
  const bowl = await bowlService.create(req.user.id, req.body);
  ApiResponse.created(bowl, 'Mama kabı oluşturuldu').send(res);
});

const update = asyncHandler(async (req, res) => {
  const bowl = await bowlService.update(req.params.id, req.user.id, req.body);
  ApiResponse.success(bowl, 'Mama kabı güncellendi').send(res);
});

const remove = asyncHandler(async (req, res) => {
  await bowlService.delete(req.params.id, req.user.id, req.user.role);
  ApiResponse.success(null, 'Mama kabı silindi').send(res);
});

const getNearby = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius } = req.query;
  const bowls = await bowlService.getNearby(
    parseFloat(latitude),
    parseFloat(longitude),
    parseFloat(radius) || 5,
  );
  ApiResponse.success(bowls, 'Yakındaki mama kapları').send(res);
});

const getByQrCode = asyncHandler(async (req, res) => {
  const bowl = await bowlService.getByQrCode(req.params.qrCode);
  ApiResponse.success(bowl).send(res);
});

const fillBowl = asyncHandler(async (req, res) => {
  const bowl = await bowlService.fillBowl(req.params.id);
  ApiResponse.success(bowl, 'Mama kabı dolduruldu').send(res);
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getNearby,
  getByQrCode,
  fillBowl,
};
