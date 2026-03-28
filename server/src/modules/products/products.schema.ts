import Joi from 'joi';

import type {
  CreateProductDonationInput,
  CreateProductInput,
} from './products.type.js';

export const createProductSchema = Joi.object<CreateProductInput>({
  animal_type: Joi.string().valid('cat', 'dog').required(),
  image_url: Joi.string().uri().required(),
  name: Joi.string().trim().min(2).max(150).required(),
  price: Joi.number().positive().precision(2).required(),
  description: Joi.string().trim().min(1).required(),
  nutrition_info: Joi.string().trim().allow(null, '').optional(),
}).required();

export const createProductDonationSchema = Joi.object<CreateProductDonationInput>({
  quantity: Joi.number().integer().min(1).required(),
  payment_method: Joi.string().trim().max(20).allow(null, '').optional(),
  payment_method_id: Joi.string().trim().guid({ version: ['uuidv4', 'uuidv5'] }).optional(),
  save_card: Joi.boolean().optional(),
  new_card: Joi.object({
    cardholder_name: Joi.string().trim().min(2).max(120).required(),
    card_number: Joi.string().trim().pattern(/^\d{12,19}$/).required(),
    expiry_month: Joi.number().integer().min(1).max(12).required(),
    expiry_year: Joi.number().integer().min(new Date().getFullYear()).max(2100).required(),
    brand: Joi.string().trim().valid('visa', 'mastercard', 'troy', 'amex').required(),
    card_type: Joi.string().trim().max(30).allow(null, '').optional(),
  }).optional(),
})
  .or('payment_method_id', 'new_card')
  .required();
