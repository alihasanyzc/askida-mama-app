import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';

import api, { ApiSuccessResponse, setApiAuthToken } from './api';

const AUTH_STORAGE_KEY = '@askida_mama/auth_session';

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in?: number;
  token_type?: string;
};

export type AuthProfile = {
  id: string;
  full_name: string;
  username: string;
  phone?: string | null;
};

export type AuthUser = {
  id: string;
  email: string | null;
};

export type AuthPayload = {
  user: AuthUser;
  session: AuthSession;
  profile?: AuthProfile | null;
};

type LoginRequest = {
  email: string;
  password: string;
};

type RegisterRequest = LoginRequest & {
  full_name: string;
  username: string;
  phone?: string | null;
};

type VerifyPayload = {
  user: AuthUser | null;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const responseMessage = (error.response?.data as { message?: string } | undefined)?.message;

    if (responseMessage) {
      return responseMessage;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

async function persistSession(payload: AuthPayload) {
  setApiAuthToken(payload.session.access_token);
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
}

export async function clearAuthSession() {
  setApiAuthToken(null);
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function getStoredAuthSession() {
  const storedValue = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const payload = JSON.parse(storedValue) as AuthPayload;

    if (!payload?.session?.access_token) {
      await clearAuthSession();
      return null;
    }

    setApiAuthToken(payload.session.access_token);
    return payload;
  } catch {
    await clearAuthSession();
    return null;
  }
}

export async function verifyStoredSession() {
  const storedSession = await getStoredAuthSession();

  if (!storedSession) {
    return null;
  }

  try {
    await api.get<ApiSuccessResponse<VerifyPayload>>('/auth/verify');
    return storedSession;
  } catch {
    await clearAuthSession();
    return null;
  }
}

export async function login(input: LoginRequest) {
  try {
    const response =
      (await api.post<ApiSuccessResponse<AuthPayload>>('/auth/login', input)) as unknown as ApiSuccessResponse<AuthPayload>;
    const payload = response.data;

    if (!payload?.session?.access_token) {
      throw new Error('Geçerli oturum bilgisi alınamadı.');
    }

    await persistSession(payload);
    return payload;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Giriş sırasında bir hata oluştu.'));
  }
}

export async function register(input: RegisterRequest) {
  try {
    const response =
      (await api.post<ApiSuccessResponse<AuthPayload>>('/auth/register', input)) as unknown as ApiSuccessResponse<AuthPayload>;
    const payload = response.data;

    if (!payload?.session?.access_token) {
      throw new Error('Geçerli oturum bilgisi alınamadı.');
    }

    await persistSession(payload);
    return payload;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Kayıt sırasında bir hata oluştu.'));
  }
}
