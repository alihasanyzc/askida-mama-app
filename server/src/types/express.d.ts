import type { User } from '@supabase/supabase-js';

declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        buffer: Buffer;
      }
    }

    interface Request {
      user?: {
        id: string;
        email: string | null;
        raw: User;
      };
      validatedBody?: unknown;
      file?: Multer.File;
    }
  }
}

export {};
