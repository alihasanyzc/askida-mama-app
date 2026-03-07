const Joi = require('joi');

const createBowl = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'any.required': 'Mama kabı adı zorunludur',
  }),
  description: Joi.string().max(500).allow('', null),
  imageUrl: Joi.string().uri().allow('', null),
  latitude: Joi.number().min(-90).max(90).required().messages({
    'any.required': 'Enlem bilgisi zorunludur',
  }),
  longitude: Joi.number().min(-180).max(180).required().messages({
    'any.required': 'Boylam bilgisi zorunludur',
  }),
  address: Joi.string().max(500).allow('', null),
  capacity: Joi.number().integer().min(0).max(100).default(100),
});

const updateBowl = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().max(500).allow('', null),
  imageUrl: Joi.string().uri().allow('', null),
  address: Joi.string().max(500).allow('', null),
  capacity: Joi.number().integer().min(0).max(100),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'MAINTENANCE'),
}).min(1);

const getNearby = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  radius: Joi.number().min(0.1).max(50).default(5),
});

module.exports = {
  createBowl,
  updateBowl,
  getNearby,
};
