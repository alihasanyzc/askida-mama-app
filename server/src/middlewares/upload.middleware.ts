import multer from 'multer';
import type { Request } from 'express';

import { BadRequestError } from '../common/errors/base-error.js';
import { env } from '../config/env.js';

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const maxFileSizeInBytes = env.PROFILE_MEDIA_MAX_FILE_SIZE_MB * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxFileSizeInBytes,
  },
  fileFilter: (
    _request: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile?: boolean) => void,
  ) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new BadRequestError('Only JPEG, PNG, and WEBP images are allowed'));
      return;
    }

    callback(null, true);
  },
});

export const profileImageUploadMiddleware = upload.single('image');
