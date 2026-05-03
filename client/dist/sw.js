const CACHE_NAME = 'kisanmitra-v1';
const STATIC_ASSETS = ['/', '/dashboard', '/manifest.json'];
const API_CACHE = ['/api/mandi/prices', '/api/yojna/all'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const shouldCacheApi = API_CACHE.some((path) => url.pathname.startsWith(path));
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (shouldCacheApi || STATIC_ASSETS.includes(url.pathname)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/')))
  );
});
