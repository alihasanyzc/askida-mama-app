import Joi from 'joi';

import type { CreateEventInput } from './events.type.js';

export const createEventSchema = Joi.object<CreateEventInput>({
  title: Joi.string().trim().min(3).max(150).required(),
  description: Joi.string().trim().min(10).required(),
  image_url: Joi.string().uri().required(),
  organizer: Joi.string().trim().min(2).max(150).required(),
  event_date: Joi.date().iso().greater('now').required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  address: Joi.string().trim().min(3).allow(null, '').optional(),
  city: Joi.string().trim().max(50).allow(null, '').optional(),
  district: Joi.string().trim().max(50).allow(null, '').optional(),
  location_note: Joi.string().trim().max(200).allow(null, '').optional(),
  locationDescription: Joi.string().trim().max(200).allow(null, '').optional(),
}).required();
