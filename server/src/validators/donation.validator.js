const Joi = require('joi');

const createDonation = Joi.object({
  amount: Joi.number().positive().precision(2).required().messages({
    'any.required': 'Bağış tutarı zorunludur',
    'number.positive': 'Bağış tutarı pozitif olmalıdır',
  }),
  type: Joi.string().valid('FOOD', 'MEDICAL', 'MONEY', 'SUPPLY').required().messages({
    'any.required': 'Bağış tipi zorunludur',
  }),
  description: Joi.string().max(500).allow('', null),
  paymentMethod: Joi.string().max(50).allow('', null),
});

const updateDonationStatus = Joi.object({
  status: Joi.string().valid('PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED').required(),
});

module.exports = {
  createDonation,
  updateDonationStatus,
};
