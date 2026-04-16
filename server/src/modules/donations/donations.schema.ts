import Joi from 'joi';

import type { CreateGeneralDonationInput } from './donations.type.js';

export const createGeneralDonationSchema = Joi.object<CreateGeneralDonationInput>({
  amount: Joi.number().positive().precision(2).required(),
  payment_method_id: Joi.string().trim().guid({ version: ['uuidv4', 'uuidv5'] }).required(),
}).required();
