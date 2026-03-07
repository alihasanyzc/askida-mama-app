const clinicService = require('../services/clinic.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { parsePagination, createPaginationMeta } = require('../utils/helpers');

const getAll = asyncHandler(async (req, res) => {
  const { skip, page, limit } = parsePagination(req.query);
  const { city } = req.query;
  const { clinics, total } = await clinicService.getAll({ city, skip, take: limit });
  const meta = createPaginationMeta(total, page, limit);
  ApiResponse.success(clinics, 'Klinikler', meta).send(res);
});

const getById = asyncHandler(async (req, res) => {
  const clinic = await clinicService.getById(req.params.id);
  ApiResponse.success(clinic).send(res);
});

const create = asyncHandler(async (req, res) => {
  const clinic = await clinicService.create(req.body);
  ApiResponse.created(clinic, 'Klinik oluşturuldu').send(res);
});

const update = asyncHandler(async (req, res) => {
  const clinic = await clinicService.update(req.params.id, req.body);
  ApiResponse.success(clinic, 'Klinik güncellendi').send(res);
});

const remove = asyncHandler(async (req, res) => {
  await clinicService.delete(req.params.id);
  ApiResponse.success(null, 'Klinik silindi').send(res);
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
