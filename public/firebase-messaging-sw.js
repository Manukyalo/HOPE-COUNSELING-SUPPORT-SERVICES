/* eslint-disable no-undef */
// Firebase Cloud Messaging Service Worker for Hope Counseling Practitioner Workspace
// Handles screen-off and background push notifications for admin devices

importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAJzHl4l9arfmraqyaOU0LdVFG-a3gG6fM",
  authDomain: "hope-counseling-cfea1.firebaseapp.com",
  projectId: "hope-counseling-cfea1",
  storageBucket: "hope-counseling-cfea1.firebasestorage.app",
  messagingSenderId: "769255969375",
  appId: "1:769255969375:web:18546cd0c655d04c70c1ea",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Background message handler when app is closed / screen is off
messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  const data = payload.data || {};

  const title = notification.title || data.title || '🌸 New Booking Received';
  const body =
    notification.body ||
    data.body ||
    (data.clientName
      ? `New booking: ${data.clientName} - ${data.service || 'Session'} - ${data.date || ''} ${data.time || ''}`
      : 'A new appointment was booked with all client details.');

  const targetUrl = data.url || '/admin';

  return self.registration.showNotification(title, {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: data.bookingId || 'new-booking',
    renotify: true,
    requireInteraction: true,
    data: {
      url: targetUrl,
      bookingId: data.bookingId,
    },
  });
});

// Focus or open the admin dashboard URL when practitioner taps the notification
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

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
