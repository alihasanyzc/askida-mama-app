const Joi = require('joi');

const updateProfile = Joi.object({
  fullName: Joi.string().min(2).max(100),
  username: Joi.string().min(3).max(30).alphanum(),
  bio: Joi.string().max(500).allow('', null),
  phone: Joi.string().max(20).allow('', null),
  city: Joi.string().max(100).allow('', null),
  district: Joi.string().max(100).allow('', null),
  address: Joi.string().max(500).allow('', null),
  avatarUrl: Joi.string().uri().allow('', null),
}).min(1).messages({
  'object.min': 'En az bir alan güncellenmelidir',
});

module.exports = {
  updateProfile,
};
