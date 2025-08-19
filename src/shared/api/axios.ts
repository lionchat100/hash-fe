import axios, { AxiosError, AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { refreshManager } from './refreshManager';

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    (config.headers ||= new AxiosHeaders()).set('Authorization', `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as ExtendedAxiosRequestConfig & { _retry?: boolean };
    if (!status || !original) return Promise.reject(error);
    if (original.url?.includes('/auth/refresh')) return Promise.reject(error);

    if (status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { accessToken } = await refreshManager.refresh();
        (original.headers ||= new AxiosHeaders()).set('Authorization', `Bearer ${accessToken}`);
        return api(original);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
