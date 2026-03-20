import { BadRequestError, ConflictError, UnauthorizedError } from '../../common/errors/base-error.js';
import { supabase, supabaseAdmin } from '../../config/supabase.js';
import type { LoginInput, LoginResult, RegisterInput } from './auth.type.js';

function mapAuthError(errorMessage: string) {
  const normalized = errorMessage.toLowerCase();

  if (normalized.includes('already') || normalized.includes('duplicate')) {
    return new ConflictError('Email is already registered');
  }

  if (normalized.includes('invalid login credentials')) {
    return new UnauthorizedError('Invalid email or password');
  }

  return new BadRequestError(errorMessage);
}

export const authRepository = {
  async register(input: RegisterInput) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        full_name: input.full_name,
        username: input.username,
      },
    });

    if (error || !data.user) {
      throw mapAuthError(error?.message ?? 'Failed to create auth user');
    }

    return data.user;
  },

  async removeUser(userId: string) {
    await supabaseAdmin.auth.admin.deleteUser(userId);
  },

  async login(input: LoginInput): Promise<LoginResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error || !data.user || !data.session) {
      throw mapAuthError(error?.message ?? 'Login failed');
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email ?? null,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        expires_in: data.session.expires_in,
        token_type: data.session.token_type,
      },
    };
  },
};
