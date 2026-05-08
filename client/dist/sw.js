const CACHE_NAME = 'kisanmitra-v1';
const STATIC_ASSETS = ['/manifest.json'];
const STATIC_PATH_PREFIXES = ['/assets/'];
const API_CACHE = ['/api/mandi/prices', '/api/yojna/all'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.allSettled(
        STATIC_ASSETS.map((asset) => cache.add(asset))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const shouldCacheApi = API_CACHE.some((path) => url.pathname.startsWith(path));
  const shouldCacheStatic = STATIC_ASSETS.includes(url.pathname)
    || STATIC_PATH_PREFIXES.some((path) => url.pathname.startsWith(path));
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && (shouldCacheApi || shouldCacheStatic)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
