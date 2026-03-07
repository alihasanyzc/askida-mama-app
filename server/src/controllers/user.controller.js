const userService = require('../services/user.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { parsePagination, createPaginationMeta } = require('../utils/helpers');

const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.params.id);
  ApiResponse.success(profile).send(res);
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await userService.updateProfile(req.user.id, req.body);
  ApiResponse.success(profile, 'Profil güncellendi').send(res);
});

const follow = asyncHandler(async (req, res) => {
  await userService.follow(req.user.id, req.params.id);
  ApiResponse.success(null, 'Takip edildi').send(res);
});

const unfollow = asyncHandler(async (req, res) => {
  await userService.unfollow(req.user.id, req.params.id);
  ApiResponse.success(null, 'Takipten çıkıldı').send(res);
});

const getFollowers = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = parsePagination(req.query);
  const { followers, total } = await userService.getFollowers(req.params.id, { skip, take: limit });
  const meta = createPaginationMeta(total, page, limit);
  ApiResponse.success(followers, 'Takipçiler', meta).send(res);
});

const getFollowing = asyncHandler(async (req, res) => {
  const { skip, page, limit } = parsePagination(req.query);
  const { following, total } = await userService.getFollowing(req.params.id, { skip, take: limit });
  const meta = createPaginationMeta(total, page, limit);
  ApiResponse.success(following, 'Takip edilenler', meta).send(res);
});

module.exports = {
  getProfile,
  updateProfile,
  follow,
  unfollow,
  getFollowers,
  getFollowing,
};
