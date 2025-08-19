import axios, { AxiosError, AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { tokenEventBus } from '../lib/tokenEventBus';

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

type Pending = {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  original: ExtendedAxiosRequestConfig;
};

let isRefreshing = false;
let pendingQueue: Pending[] = [];

const raw = axios.create({ withCredentials: true });

async function refreshToken(): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`;
  const response = await raw.post(url, {});
  return response.data.accessToken as string;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as ExtendedAxiosRequestConfig & { _retry?: boolean };

    if (!status || !original) return Promise.reject(error);
    if (original.url?.includes('/auth/refresh')) return Promise.reject(error);

    const isExpiry = status === 401;

    if (isExpiry && !original._retry) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshToken();

          console.log('🔄 액세스 토큰 재발급 성공:', newToken.substring(0, 20) + '...');
          localStorage.setItem('accessToken', newToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          tokenEventBus.emit(newToken);

          pendingQueue.forEach(({ resolve, original }) => {
            (original.headers ||= new AxiosHeaders()).set('Authorization', `Bearer ${newToken}`);
            resolve(api(original));
          });
          pendingQueue = [];
          (original.headers ||= new AxiosHeaders()).set('Authorization', `Bearer ${newToken}`);
          return api(original);
        } catch (error) {
          pendingQueue.forEach(({ reject }) => reject(error));
          pendingQueue = [];

          localStorage.removeItem('accessToken');
          window.dispatchEvent(new CustomEvent('app:logout'));
          if (typeof window !== 'undefined') window.location.href = '/';
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject, original });
      });
    }
    return Promise.reject(error);
  },
);

export default api;
