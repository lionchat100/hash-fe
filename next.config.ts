import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  sw: '/worker.js',
  disable: process.env.NODE_ENV === 'development',
});

export default nextConfig;
