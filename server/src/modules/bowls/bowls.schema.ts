import Joi from 'joi';

import type {
  CreateBowlDonationInput,
  UpdateBowlAddressInput,
  UpdateBowlStatusInput,
} from './bowls.type.js';

export const updateBowlStatusSchema = Joi.object<UpdateBowlStatusInput>({
  status: Joi.string().trim().valid('dolu', 'boş', 'bos', 'full', 'empty').required(),
}).required();

export const updateBowlAddressSchema = Joi.object<UpdateBowlAddressInput>({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  address_line: Joi.string().trim().max(200).allow(null, '').optional(),
  location_note: Joi.string().trim().max(200).allow(null, '').optional(),
  locationDescription: Joi.string().trim().max(200).allow(null, '').optional(),
}).required();

export const createBowlDonationSchema = Joi.object<CreateBowlDonationInput>({
  amount: Joi.number().positive().precision(2).required(),
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
