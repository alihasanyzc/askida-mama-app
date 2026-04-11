import axios, { AxiosError } from 'axios';

import { API_BASE_URL } from '../constants';

export type ApiSuccessResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta: unknown;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken: string | null = null;
let unauthorizedHandler: (() => void | Promise<void>) | null = null;

export function setApiAuthToken(token: string | null) {
  authToken = token;
}

export function setUnauthorizedHandler(handler: (() => void | Promise<void>) | null) {
  unauthorizedHandler = handler;
}

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
});

api.interceptors.response.use(
  <T>(response: { data: T }) => response.data,
  (error: AxiosError) => {
    if (error.response) {
      if (error.response.status === 401) {
        void unauthorizedHandler?.();
        return Promise.reject(error);
      }

      if (error.response.status === 503) {
        return Promise.reject(error);
      }

      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
