// Admin Service Worker for Hope Counseling Practitioner Workspace
// Strictly Network-Only for all admin and API requests — NEVER cache client PII or admin data

const CACHE_NAME = 'hc-admin-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// A fetch handler is required by Chrome on Android to meet PWA installability requirements.
// Enforce STRICT NETWORK-ONLY for all /admin and /api routes to prevent any caching of confidential data.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // If request is for admin or API, strictly network-only:
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).catch(() => {
        return new Response('Network connection required for confidential clinical workspace', {
          status: 503,
          headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' },
        });
      })
    );
    return;
  }

  // Static assets only (icons, fallback)
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('Offline', { status: 503 });
    })
  );
});
