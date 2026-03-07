const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  ApiResponse.created(result, 'Kayıt başarılı').send(res);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  ApiResponse.success(result, 'Giriş başarılı').send(res);
});

const refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refreshToken(req.body.refreshToken);
  ApiResponse.success(result, 'Token yenilendi').send(res);
});

const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.user.authId);
  ApiResponse.success(result).send(res);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  ApiResponse.success(result).send(res);
});

const updatePassword = asyncHandler(async (req, res) => {
  const result = await authService.updatePassword(req.user.authId, req.body.newPassword);
  ApiResponse.success(result).send(res);
});

const getMe = asyncHandler(async (req, res) => {
  const profile = await authService.getMe(req.user.authId);
  ApiResponse.success(profile).send(res);
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  updatePassword,
  getMe,
};
