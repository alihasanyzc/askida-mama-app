import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';

import Joi from 'joi';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);
const serverRootPath = resolve(currentDirPath, '..', '..');
const serverEnvPath = resolve(serverRootPath, '.env');
const repoRootEnvPath = resolve(serverRootPath, '..', '.env');

if (existsSync(repoRootEnvPath)) {
  dotenv.config({ path: repoRootEnvPath });
}

if (existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
}

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
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  ADMIN_FULL_NAME: string;
  ADMIN_USERNAME: string;
  RESEND_API_KEY: string | null;
  EMAIL_FROM: string | null;
  GEMINI_API_KEY: string | null;
  GEMINI_MODEL: string | null;
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
  ADMIN_EMAIL: Joi.string().email().default('admin@askidamama.com'),
  ADMIN_PASSWORD: Joi.string().min(6).max(128).default('Admin123!'),
  ADMIN_FULL_NAME: Joi.string().trim().min(2).max(100).default('Askida Mama Admin'),
  ADMIN_USERNAME: Joi.string().trim().min(3).max(50).default('admin'),
  RESEND_API_KEY: Joi.string().min(1).allow(null, '').default(null),
  EMAIL_FROM: Joi.string().email().allow(null, '').default(null),
  GEMINI_API_KEY: Joi.string().min(1).allow(null, '').default(null),
  GEMINI_MODEL: Joi.string().trim().allow(null, '').default('gemini-flash-latest'),
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
  ADMIN_EMAIL: value.ADMIN_EMAIL,
  ADMIN_PASSWORD: value.ADMIN_PASSWORD,
  ADMIN_FULL_NAME: value.ADMIN_FULL_NAME,
  ADMIN_USERNAME: value.ADMIN_USERNAME,
  RESEND_API_KEY: value.RESEND_API_KEY,
  EMAIL_FROM: value.EMAIL_FROM,
  GEMINI_API_KEY: value.GEMINI_API_KEY,
  GEMINI_MODEL: value.GEMINI_MODEL,
});
