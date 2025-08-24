import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  // sw: '/worker.js',
  disable: process.env.NODE_ENV === 'development',
});

export default withPWA({
  images: {
    domains: ['tokit-bucket.s3.ap-northeast-2.amazonaws.com'],
    formats: ['image/webp'],
    deviceSizes: [480],
    imageSizes: [],
    minimumCacheTTL: 60 * 60 * 24 * 1,
  },
});
