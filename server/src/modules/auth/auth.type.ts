export type RegisterInput = {
  email: string;
  password: string;
  full_name: string;
  username: string;
  phone?: string | null;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthSessionPayload = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in?: number;
  token_type?: string;
};

export type AuthUserPayload = {
  id: string;
  email: string | null;
};

export type LoginResult = {
  user: {
    id: string;
    email: string | null;
  };
  session: AuthSessionPayload;
};
