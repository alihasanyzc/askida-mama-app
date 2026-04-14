import { authRepository } from './auth.repository.js';
import type { LoginInput, RegisterInput } from './auth.type.js';
import { profilesRepository } from '../profiles/profiles.repository.js';
import { ConflictError } from '../../common/errors/base-error.js';

export const authService = {
  async register(input: RegisterInput) {
    const normalizedEmail = input.email.trim().toLowerCase();
    const normalizedUsername = input.username.trim().toLowerCase();

    if (normalizedEmail === process.env.ADMIN_EMAIL?.trim().toLowerCase()) {
      throw new ConflictError('This email address is reserved');
    }

    if (normalizedUsername === process.env.ADMIN_USERNAME?.trim().toLowerCase()) {
      throw new ConflictError('This username is reserved');
    }

    const existingProfile = await profilesRepository.findByUsername(input.username);

    if (existingProfile) {
      throw new ConflictError('Username is already in use');
    }

    const user = await authRepository.register(input);

    try {
      const profile = await profilesRepository.create({
        id: user.id,
        full_name: input.full_name,
        username: input.username,
        phone: input.phone ?? null,
      });

      const authData = await authRepository.login({
        email: input.email,
        password: input.password,
      });

      return {
        user: {
          id: user.id,
          email: user.email ?? input.email,
        },
        session: {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_at: authData.session.expires_at,
          expires_in: authData.session.expires_in,
          token_type: authData.session.token_type,
        },
        profile,
      };
    } catch (error) {
      await authRepository.removeUser(user.id);
      throw error;
    }
  },

  async login(input: LoginInput) {
    const authData = await authRepository.login(input);
    const profile = await profilesRepository.getById(authData.user.id);

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email ?? input.email,
      },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at,
        expires_in: authData.session.expires_in,
        token_type: authData.session.token_type,
      },
      profile,
    };
  },
};
