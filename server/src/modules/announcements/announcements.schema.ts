import Joi from 'joi';

import type {
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from './announcements.type.js';

const categoryValues = ['injured', 'report', 'adoption', 'lost'] as const;
const reportTypeValues = ['dead', 'unchipped', 'aggressive', 'abuse', 'stray', 'other'] as const;
const animalTypeValues = ['cat', 'dog'] as const;
const ageValues = ['0-6months', '6-12months', '1-3years', '3-7years', '7+years'] as const;
const genderValues = ['female', 'male'] as const;
const binaryChoiceValues = ['yes', 'no'] as const;
const vaccinationValues = ['vaccinated', 'not_vaccinated'] as const;
const healthStatusValues = ['healthy', 'injured'] as const;
const environmentValues = ['home', 'street', 'shelter'] as const;

const imagesSchema = Joi.array()
  .items(Joi.string().uri().required())
  .min(1)
  .max(4)
  .required();

function normalizeContactValue(value: unknown, helpers: Joi.CustomHelpers) {
  if (typeof value !== 'object' || value === null) {
    return value;
  }

  const payload = value as Record<string, unknown>;
  const phone = typeof payload.phone === 'string' ? payload.phone.trim() : payload.phone;
  const email = typeof payload.email === 'string' ? payload.email.trim() : payload.email;

  if (!phone && !email) {
    return helpers.message({
      custom: 'Either phone or email is required',
    });
  }

  if (payload.category === 'report' && !payload.report_type) {
    return helpers.message({
      custom: 'Report type is required for report announcements',
    });
  }

  if (payload.category === 'adoption') {
    const requiredFields = [
      'animal_type',
      'age',
      'gender',
      'neutered',
      'vaccination',
      'health_status',
      'environment',
    ];

    const missingField = requiredFields.find((field) => !payload[field]);

    if (missingField) {
      return helpers.message({
        custom: `${missingField} is required for adoption announcements`,
      });
    }
  }

  return value;
}

export const createAnnouncementSchema = Joi.object<CreateAnnouncementInput>({
  category: Joi.string()
    .valid(...categoryValues)
    .required(),
  title: Joi.string().trim().min(2).max(150).required(),
  description: Joi.string().trim().min(1).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  address: Joi.string().trim().max(255).allow(null, '').optional(),
  city: Joi.string().trim().max(50).allow(null, '').optional(),
  district: Joi.string().trim().max(50).allow(null, '').optional(),
  locationDescription: Joi.string().trim().max(200).allow(null, '').optional(),
  phone: Joi.string().trim().max(20).allow(null, '').optional(),
  email: Joi.string().trim().email().max(150).allow(null, '').optional(),
  images: imagesSchema,
  report_type: Joi.string()
    .valid(...reportTypeValues)
    .allow(null, '')
    .optional(),
  animal_type: Joi.string()
    .valid(...animalTypeValues)
    .allow(null, '')
    .optional(),
  age: Joi.string()
    .valid(...ageValues)
    .allow(null, '')
    .optional(),
  gender: Joi.string()
    .valid(...genderValues)
    .allow(null, '')
    .optional(),
  neutered: Joi.string()
    .valid(...binaryChoiceValues)
    .allow(null, '')
    .optional(),
  vaccination: Joi.string()
    .valid(...vaccinationValues)
    .allow(null, '')
    .optional(),
  health_status: Joi.string()
    .valid(...healthStatusValues)
    .allow(null, '')
    .optional(),
  environment: Joi.string()
    .valid(...environmentValues)
    .allow(null, '')
    .optional(),
})
  .custom(normalizeContactValue)
  .required();

export const updateAnnouncementSchema = Joi.object<UpdateAnnouncementInput>({
  category: Joi.string()
    .valid(...categoryValues)
    .optional(),
  title: Joi.string().trim().min(2).max(150).optional(),
  description: Joi.string().trim().min(1).optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  address: Joi.string().trim().max(255).allow(null, '').optional(),
  city: Joi.string().trim().max(50).allow(null, '').optional(),
  district: Joi.string().trim().max(50).allow(null, '').optional(),
  locationDescription: Joi.string().trim().max(200).allow(null, '').optional(),
  phone: Joi.string().trim().max(20).allow(null, '').optional(),
  email: Joi.string().trim().email().max(150).allow(null, '').optional(),
  images: Joi.array().items(Joi.string().uri().required()).min(1).max(4).optional(),
  report_type: Joi.string()
    .valid(...reportTypeValues)
    .allow(null, '')
    .optional(),
  animal_type: Joi.string()
    .valid(...animalTypeValues)
    .allow(null, '')
    .optional(),
  age: Joi.string()
    .valid(...ageValues)
    .allow(null, '')
    .optional(),
  gender: Joi.string()
    .valid(...genderValues)
    .allow(null, '')
    .optional(),
  neutered: Joi.string()
    .valid(...binaryChoiceValues)
    .allow(null, '')
    .optional(),
  vaccination: Joi.string()
    .valid(...vaccinationValues)
    .allow(null, '')
    .optional(),
  health_status: Joi.string()
    .valid(...healthStatusValues)
    .allow(null, '')
    .optional(),
  environment: Joi.string()
    .valid(...environmentValues)
    .allow(null, '')
    .optional(),
})
  .min(1)
  .required();
