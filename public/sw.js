// CLEANUP & CACHE-PURGE SERVICE WORKER
// Self-destructs and purges all legacy cached data on client devices

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    // 1. Nuke every single cache on the device
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            console.log("Purging legacy cache:", name);
            return caches.delete(name);
          })
        );
      })
      .then(() => {
        // 2. Unregister this service worker from the root domain
        return self.registration.unregister();
      })
      .then(() => {
        // 3. Force clients to reload without stale service worker
        return self.clients.matchAll({ type: "window" });
      })
      .then((clientList) => {
        for (const client of clientList) {
          client.postMessage({ type: "PURGE_LOCAL_CACHE" });
        }
      })
  );
});

// If any fetch passes through, bypass cache completely (Network Only)
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
