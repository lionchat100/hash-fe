if (!self.define) {
  let e,
    a = {};
  const s = (s, n) => (
    (s = new URL(s + '.js', n).href),
    a[s] ||
      new Promise((a) => {
        if ('document' in self) {
          const e = document.createElement('script');
          ((e.src = s), (e.onload = a), document.head.appendChild(e));
        } else ((e = s), importScripts(s), a());
      }).then(() => {
        let e = a[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, i) => {
    const c = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (a[c]) return;
    let t = {};
    const r = (e) => s(e, c),
      o = { module: { uri: c }, exports: t, require: r };
    a[c] = Promise.all(n.map((e) => o[e] || r(e))).then((e) => (i(...e), t));
  };
}
define(['./workbox-3c9d0171'], function (e) {
  'use strict';
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/_next/static/chunks/111-190f8bad8de6dca7.js', revision: '190f8bad8de6dca7' },
        { url: '/_next/static/chunks/327-ae9395e45bc2b27d.js', revision: 'ae9395e45bc2b27d' },
        { url: '/_next/static/chunks/670-444b7ecc6e1fd29b.js', revision: '444b7ecc6e1fd29b' },
        { url: '/_next/static/chunks/69-8eeb1ee943ce51b2.js', revision: '8eeb1ee943ce51b2' },
        { url: '/_next/static/chunks/720-056fab19617fa4bf.js', revision: '056fab19617fa4bf' },
        { url: '/_next/static/chunks/81e00e2f-801ae6455b530d74.js', revision: '801ae6455b530d74' },
        { url: '/_next/static/chunks/app/(auth)/callback/page-e67e92a446ba1611.js', revision: 'e67e92a446ba1611' },
        {
          url: '/_next/static/chunks/app/(auth)/onboarding/end/page-dfcc69f8a973079e.js',
          revision: 'dfcc69f8a973079e',
        },
        { url: '/_next/static/chunks/app/(auth)/onboarding/page-dfcc69f8a973079e.js', revision: 'dfcc69f8a973079e' },
        {
          url: '/_next/static/chunks/app/(main)/chats/%5BroomId%5D/page-67e937ecd709ad1a.js',
          revision: '67e937ecd709ad1a',
        },
        { url: '/_next/static/chunks/app/(main)/chats/page-dfcc69f8a973079e.js', revision: 'dfcc69f8a973079e' },
        { url: '/_next/static/chunks/app/(main)/explore/page-67e937ecd709ad1a.js', revision: '67e937ecd709ad1a' },
        { url: '/_next/static/chunks/app/(main)/layout-dfcc69f8a973079e.js', revision: 'dfcc69f8a973079e' },
        { url: '/_next/static/chunks/app/(main)/profile/page-67e937ecd709ad1a.js', revision: '67e937ecd709ad1a' },
        { url: '/_next/static/chunks/app/_not-found/page-196a547fa7e483a5.js', revision: '196a547fa7e483a5' },
        { url: '/_next/static/chunks/app/layout-02d97d591da5d957.js', revision: '02d97d591da5d957' },
        { url: '/_next/static/chunks/app/page-eeb99542b1f184da.js', revision: 'eeb99542b1f184da' },
        { url: '/_next/static/chunks/framework-f1604a417ee057e2.js', revision: 'f1604a417ee057e2' },
        { url: '/_next/static/chunks/main-app-feeb0dea71690d20.js', revision: 'feeb0dea71690d20' },
        { url: '/_next/static/chunks/main-c14606af0647d4f7.js', revision: 'c14606af0647d4f7' },
        { url: '/_next/static/chunks/pages/_app-e5f2cd59e2a83cdc.js', revision: 'e5f2cd59e2a83cdc' },
        { url: '/_next/static/chunks/pages/_error-c174db74ae250971.js', revision: 'c174db74ae250971' },
        { url: '/_next/static/chunks/polyfills-42372ed130431b0a.js', revision: '846118c33b2c0e922d7b3a7676f81f6f' },
        { url: '/_next/static/chunks/webpack-db1749970a53f82b.js', revision: 'db1749970a53f82b' },
        { url: '/_next/static/css/4d9648579c6d9b97.css', revision: '4d9648579c6d9b97' },
        { url: '/_next/static/media/56f3ea10b715290b-s.p.woff2', revision: 'eeb2ee40db024e704d37bb786532e92c' },
        { url: '/_next/static/media/ff840cfebfb63b0c-s.p.woff2', revision: '302ec55f5b4320354ec6b35a53dead87' },
        { url: '/_next/static/uuQYNRuTh-USViDAaX70i/_buildManifest.js', revision: 'b592e296809d2a090e4908e83ff1bee3' },
        { url: '/_next/static/uuQYNRuTh-USViDAaX70i/_ssgManifest.js', revision: 'b6652df95db52feb4daf4eca35380933' },
        { url: '/fonts/pretendard/LICENSE.txt', revision: '4e8973b34c90633a8d8cc5d134702d71' },
        { url: '/fonts/pretendard/PretendardVariable.woff2', revision: '302ec55f5b4320354ec6b35a53dead87' },
        { url: '/fonts/suite/LICENSE', revision: '7981e6f3666b88f23062993d044e0c8f' },
        { url: '/fonts/suite/SUITE-Variable.woff2', revision: 'eeb2ee40db024e704d37bb786532e92c' },
        { url: '/icons/android-chrome-192x192.png', revision: '17766b64481bd0848861269807590930' },
        { url: '/icons/android-chrome-512x512.png', revision: '228a20849384b01d478463f66dcc02df' },
        { url: '/icons/apple-touch-icon.png', revision: '69068100c88b5df4a64fafd6888b7947' },
        { url: '/icons/favicon-16x16.png', revision: '916f344e983f2b2587d55e703690e8a0' },
        { url: '/icons/favicon-32x32.png', revision: 'cc5250b7a93f52d9a3fe8147e47a73ae' },
        { url: '/icons/favicon.ico', revision: '9f69934c5709ebca09f2dea1e140b786' },
        { url: '/icons/og-image.png', revision: '93f0c9ae8b7de8a97ac5a47d9dc73d56' },
        { url: '/manifest.json', revision: '7e5890d7515c48d1c841618e821ca436' },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: function (e) {
              var a = e.response;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    a && 'opaqueredirect' === a.type
                      ? new Response(a.body, { status: 200, statusText: 'OK', headers: a.headers })
                      : a,
                  ];
                });
              })();
            },
          },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: 'next-static-js-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [new e.RangeRequestsPlugin(), new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [new e.RangeRequestsPlugin(), new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      function (e) {
        var a = e.sameOrigin,
          s = e.url.pathname;
        return !(!a || s.startsWith('/api/auth/callback') || !s.startsWith('/api/'));
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      function (e) {
        var a = e.request,
          s = e.url.pathname,
          n = e.sameOrigin;
        return (
          '1' === a.headers.get('RSC') && '1' === a.headers.get('Next-Router-Prefetch') && n && !s.startsWith('/api/')
        );
      },
      new e.NetworkFirst({
        cacheName: 'pages-rsc-prefetch',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      function (e) {
        var a = e.request,
          s = e.url.pathname,
          n = e.sameOrigin;
        return '1' === a.headers.get('RSC') && n && !s.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'pages-rsc',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      function (e) {
        var a = e.url.pathname;
        return e.sameOrigin && !a.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'pages',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      function (e) {
        return !e.sameOrigin;
      },
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
      }),
      'GET',
    ));
});
