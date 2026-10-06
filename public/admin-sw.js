// Admin Service Worker for Hope Counseling Practitioner Workspace
// Strictly scoped to /admin/ — does not touch or cache the public marketing site

const CACHE_NAME = 'hc-admin-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// A fetch handler is required by Chrome on Android to meet PWA installability requirements
self.addEventListener('fetch', (event) => {
  // Only handle GET requests within /admin/
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) return cachedResponse;
      return new Response('Network error occurred in clinical workspace', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' },
      });
    })
  );
});
