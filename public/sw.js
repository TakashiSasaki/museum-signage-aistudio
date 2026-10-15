// sw.js - Minimal Service Worker to bypass network and make PWA installable without caching

self.addEventListener('install', () => {
  // Skip waiting to immediately activate the new service worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claim all clients immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through all network requests without caching
  event.respondWith(fetch(event.request));
});
