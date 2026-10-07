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

// Push notification handling for admin devices
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { notification: { title: '🌸 New Booking Confirmed', body: event.data.text() } };
    }
  }

  const notification = data.notification || {};
  const payloadData = data.data || {};
  const title = notification.title || '🌸 New Booking Confirmed';
  const options = {
    body: notification.body || 'A new appointment was booked with all client details.',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: payloadData.bookingId || 'new-booking',
    renotify: true,
    data: {
      url: payloadData.url || '/admin',
      ...payloadData,
    },
    actions: [
      { action: 'open', title: 'Open Ledger' },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Click notification to focus or navigate to admin dashboard
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/admin';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes('/admin') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
