import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
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

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Axios 요청 실패:', error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig | undefined;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );
        const { accessToken } = response.data;

        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          tokenEventBus.emit(accessToken);
          console.log('accessToken 재발급 및 이벤트 수신 완료: ', accessToken);
        }

        originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);
        return api(originalRequest);
      } catch (error) {
        console.error('Axios 토큰 갱신 실패:', error);

        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
