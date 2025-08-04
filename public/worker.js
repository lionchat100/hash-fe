self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('lionchat-v1').then(cache => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/icons/48.png',
        '/icons/192.png',
        '/icons/512.png',
      ]);
    }),
  );
});

// TODO
// 정적 리소스 캐싱
// 활성화 이벤트
// 페칭 이벤트
// 푸시 알람
