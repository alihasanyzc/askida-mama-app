import { randomUUID } from 'node:crypto';

import { BadRequestError } from '../../common/errors/base-error.js';
import { env } from '../../config/env.js';
import { supabaseAdmin } from '../../config/supabase.js';

type UploadPostImageParams = {
  userId: string;
  file: Express.Multer.File;
};

const fileExtensionsByMimeType: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function getFileExtension(mimetype: string) {
  return fileExtensionsByMimeType[mimetype] ?? 'bin';
}

export const postsStorage = {
  async uploadPostImage({ userId, file }: UploadPostImageParams) {
    const extension = getFileExtension(file.mimetype);
    const path = `posts/${userId}/${randomUUID()}.${extension}`;

    const { error } = await supabaseAdmin.storage
      .from(env.PROFILE_MEDIA_BUCKET)
      .upload(path, file.buffer, {
        cacheControl: '3600',
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new BadRequestError('Failed to upload post image', {
        provider: 'supabase-storage',
        message: error.message,
      });
    }

    const { data } = supabaseAdmin.storage.from(env.PROFILE_MEDIA_BUCKET).getPublicUrl(path);

    if (!data.publicUrl) {
      throw new BadRequestError('Failed to resolve uploaded post image URL');
    }

    return data.publicUrl;
  },
};
