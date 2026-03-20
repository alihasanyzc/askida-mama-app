import type { User } from '@supabase/supabase-js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string | null;
        raw: User;
      };
      validatedBody?: unknown;
    }
  }
}

export {};
