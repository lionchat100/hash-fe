import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  // sw: '/worker.js',
  disable: process.env.NODE_ENV === 'development',
});

export default withPWA({
  images: {
    domains: [
      'tokit-bucket.s3.ap-northeast-2.amazonaws.com',
      'test.com', // 개발/테스트용 도메인
    ],
  },
});
