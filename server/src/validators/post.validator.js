const Joi = require('joi');

const createPost = Joi.object({
  content: Joi.string().min(1).max(2000).required().messages({
    'any.required': 'İçerik alanı zorunludur',
  }),
  imageUrl: Joi.string().uri().allow('', null),
  category: Joi.string().valid('GENERAL', 'ADOPTION', 'LOST_FOUND', 'HEALTH', 'FOOD', 'STORY').default('GENERAL'),
});

const updatePost = Joi.object({
  content: Joi.string().min(1).max(2000),
  imageUrl: Joi.string().uri().allow('', null),
  category: Joi.string().valid('GENERAL', 'ADOPTION', 'LOST_FOUND', 'HEALTH', 'FOOD', 'STORY'),
}).min(1);

const addComment = Joi.object({
  content: Joi.string().min(1).max(1000).required().messages({
    'any.required': 'Yorum içeriği zorunludur',
  }),
});

module.exports = {
  createPost,
  updatePost,
  addComment,
};
