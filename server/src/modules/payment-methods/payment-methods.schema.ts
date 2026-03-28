import Joi from 'joi';

import type { CreatePaymentMethodInput } from './payment-methods.type.js';

export const createPaymentMethodSchema = Joi.object<CreatePaymentMethodInput>({
  cardholder_name: Joi.string().trim().min(2).max(120).required(),
  card_number: Joi.string().trim().pattern(/^\d{12,19}$/).required(),
  expiry_month: Joi.number().integer().min(1).max(12).required(),
  expiry_year: Joi.number().integer().min(new Date().getFullYear()).max(2100).required(),
  brand: Joi.string().trim().valid('visa', 'mastercard', 'troy', 'amex').required(),
  card_type: Joi.string().trim().max(30).allow(null, '').optional(),
  is_default: Joi.boolean().optional(),
}).required();
