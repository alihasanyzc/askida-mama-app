import Joi from 'joi';

import type {
  CreateClinicDonationInput,
  CreateClinicInput,
} from './clinics.type.js';

export const createClinicSchema = Joi.object<CreateClinicInput>({
  name: Joi.string().trim().min(2).max(150).required(),
  description: Joi.string().trim().min(1).required(),
  image_url: Joi.string().uri().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  city: Joi.string().trim().max(50).required(),
  district: Joi.string().trim().max(50).required(),
  location_description: Joi.string().trim().max(200).allow(null, '').optional(),
  locationDescription: Joi.string().trim().max(200).allow(null, '').optional(),
}).required();

export const createClinicDonationSchema = Joi.object<CreateClinicDonationInput>({
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
