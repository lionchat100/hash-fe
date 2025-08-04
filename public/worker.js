self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('lionchat-v1').then(cache => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/icons/favicon.ico',
        '/icons/android-chrome-192x192.png',
        '/icons/android-chrome-512x512.png',
        '/icons/apple-touch-icon.png',
        '/icons/og-image.png',
      ]);
    }),
  );
});
