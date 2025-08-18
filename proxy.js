// 로컬 개발용 프록시 서버
// npm install -g http-proxy-middleware express 후 사용

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 배포 도메인을 localhost로 프록시
app.use('/api', createProxyMiddleware({
  target: 'https://api.tokit.co.kr',
  changeOrigin: true,
  secure: true,
}));

// OAuth 콜백을 localhost로 프록시
app.use('/oauth2', createProxyMiddleware({
  target: 'https://api.tokit.co.kr',
  changeOrigin: true,
  secure: true,
}));

// 나머지는 로컬 Next.js 서버로
app.use('/', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
}));

app.listen(8080, () => {
  console.log('Proxy server running on http://localhost:8080');
  console.log('Visit http://localhost:8080 instead of localhost:3000');
});