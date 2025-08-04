import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: false,
    sw: '/worker.js',
    // 추후 캐싱 전략 수립하기
  },
});

export default nextConfig;
