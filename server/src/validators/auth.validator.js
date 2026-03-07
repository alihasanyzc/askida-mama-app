const Joi = require('joi');

const register = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Geçerli bir email adresi girin',
    'any.required': 'Email alanı zorunludur',
  }),
  password: Joi.string().min(6).max(128).required().messages({
    'string.min': 'Şifre en az 6 karakter olmalıdır',
    'any.required': 'Şifre alanı zorunludur',
  }),
  fullName: Joi.string().min(2).max(100).required().messages({
    'string.min': 'İsim en az 2 karakter olmalıdır',
    'any.required': 'İsim alanı zorunludur',
  }),
});

const login = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Geçerli bir email adresi girin',
    'any.required': 'Email alanı zorunludur',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Şifre alanı zorunludur',
  }),
});

const refreshToken = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token zorunludur',
  }),
});

const forgotPassword = Joi.object({
  email: Joi.string().email().required(),
});

const updatePassword = Joi.object({
  newPassword: Joi.string().min(6).max(128).required(),
});

module.exports = {
  register,
  login,
  refreshToken,
  forgotPassword,
  updatePassword,
};
