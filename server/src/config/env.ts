import 'dotenv/config';

import Joi from 'joi';

type EnvShape = {
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
  API_PREFIX: string;
  DATABASE_URL: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SUPABASE_JWT_SECRET: string;
  CORS_ORIGIN: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX: number;
  PROFILE_MEDIA_BUCKET: string;
  PROFILE_MEDIA_MAX_FILE_SIZE_MB: number;
};

const envSchema = Joi.object<EnvShape>({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  API_PREFIX: Joi.string().default('/api/v1'),
  DATABASE_URL: Joi.string().uri({ scheme: ['postgresql', 'postgres'] }).required(),
  SUPABASE_URL: Joi.string().uri().required(),
  SUPABASE_ANON_KEY: Joi.string().min(20).required(),
  SUPABASE_SERVICE_ROLE_KEY: Joi.string().min(20).required(),
  SUPABASE_JWT_SECRET: Joi.string().min(20).required(),
  CORS_ORIGIN: Joi.string().default('http://localhost:19006'),
  RATE_LIMIT_WINDOW_MS: Joi.number().integer().positive().default(900000),
  RATE_LIMIT_MAX: Joi.number().integer().positive().default(100),
  PROFILE_MEDIA_BUCKET: Joi.string().trim().default('profile-media'),
  PROFILE_MEDIA_MAX_FILE_SIZE_MB: Joi.number().integer().positive().default(5),
})
  .unknown(true)
  .required();

const { value, error } = envSchema.validate(process.env, {
  abortEarly: false,
  convert: true,
});

if (error) {
  throw new Error(`Environment validation failed: ${error.message}`);
}

export const env: Readonly<EnvShape> = Object.freeze({
  NODE_ENV: value.NODE_ENV,
  PORT: value.PORT,
  API_PREFIX: value.API_PREFIX,
  DATABASE_URL: value.DATABASE_URL,
  SUPABASE_URL: value.SUPABASE_URL,
  SUPABASE_ANON_KEY: value.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: value.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_JWT_SECRET: value.SUPABASE_JWT_SECRET,
  CORS_ORIGIN: value.CORS_ORIGIN,
  RATE_LIMIT_WINDOW_MS: value.RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX: value.RATE_LIMIT_MAX,
  PROFILE_MEDIA_BUCKET: value.PROFILE_MEDIA_BUCKET,
  PROFILE_MEDIA_MAX_FILE_SIZE_MB: value.PROFILE_MEDIA_MAX_FILE_SIZE_MB,
});
