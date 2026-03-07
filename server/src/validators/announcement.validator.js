const Joi = require('joi');

const createAnnouncement = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    'any.required': 'Başlık zorunludur',
  }),
  content: Joi.string().min(10).max(5000).required().messages({
    'any.required': 'İçerik zorunludur',
  }),
  imageUrl: Joi.string().uri().allow('', null),
  category: Joi.string().valid('ADOPTION', 'LOST', 'FOUND', 'URGENT', 'GENERAL').required().messages({
    'any.required': 'Kategori zorunludur',
  }),
});

const updateAnnouncement = Joi.object({
  title: Joi.string().min(3).max(200),
  content: Joi.string().min(10).max(5000),
  imageUrl: Joi.string().uri().allow('', null),
  category: Joi.string().valid('ADOPTION', 'LOST', 'FOUND', 'URGENT', 'GENERAL'),
}).min(1);

module.exports = {
  createAnnouncement,
  updateAnnouncement,
};
