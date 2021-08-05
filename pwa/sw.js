var cacheName = 'zz-pwa';
var appShellFiles = [
  '/pwa/icons/flower-32.png',
  '/pwa/icons/flower-64.png',
  '/pwa/icons/flower-96.png',
  '/pwa/icons/flower-128.png',
  '/pwa/icons/flower-168.png',
  '/pwa/icons/flower-192.png',
  '/pwa/icons/flower-256.png',
  '/pwa/icons/flower-512.png',
  '/pwa/manifest.json',
  '/pwa/index.html',
  '/pwa/sw.js',
];
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(appShellFiles);
  })());
});

self.addEventListener('fetch', function(e) {
  let url = new URL(e.request.url)
  if (!url.protocol.startsWith('http')) {
    return
  }
  e.respondWith(
    caches.match(e.request).then(function(r) {
      console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          console.log('[Service Worker] Caching new resource: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
