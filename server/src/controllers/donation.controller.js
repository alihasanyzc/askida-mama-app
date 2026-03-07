const donationService = require('../services/donation.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { parsePagination, createPaginationMeta } = require('../utils/helpers');

const getAll = asyncHandler(async (req, res) => {
  const { skip, page, limit } = parsePagination(req.query);
  const { type, status } = req.query;
  const { donations, total } = await donationService.getAll({ type, status, skip, take: limit });
  const meta = createPaginationMeta(total, page, limit);
  ApiResponse.success(donations, 'Bağışlar', meta).send(res);
});

const getById = asyncHandler(async (req, res) => {
  const donation = await donationService.getById(req.params.id);
  ApiResponse.success(donation).send(res);
});

const create = asyncHandler(async (req, res) => {
  const donation = await donationService.create(req.user.id, req.body);
  ApiResponse.created(donation, 'Bağış oluşturuldu').send(res);
});

const updateStatus = asyncHandler(async (req, res) => {
  const donation = await donationService.updateStatus(req.params.id, req.body.status);
  ApiResponse.success(donation, 'Bağış durumu güncellendi').send(res);
});

const getMyDonations = asyncHandler(async (req, res) => {
  const { skip, page, limit } = parsePagination(req.query);
  const { donations, total } = await donationService.getByDonor(req.user.id, { skip, take: limit });
  const meta = createPaginationMeta(total, page, limit);
  ApiResponse.success(donations, 'Bağışlarım', meta).send(res);
});

const getStats = asyncHandler(async (req, res) => {
  const stats = await donationService.getStats();
  ApiResponse.success(stats, 'Bağış istatistikleri').send(res);
});

module.exports = {
  getAll,
  getById,
  create,
  updateStatus,
  getMyDonations,
  getStats,
};
