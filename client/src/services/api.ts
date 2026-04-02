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

api.interceptors.response.use(
  <T>(response: { data: T }) => response.data,
  (error: AxiosError) => {
    if (error.response) {
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
