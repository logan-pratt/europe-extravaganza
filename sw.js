const CACHE = 'ee-today-v1';

// Relative to sw.js (repo root). These are the itinerary's static shell.
const PRECACHE = [
  './',
  'index.html',
  'styles.css',
  'shared/schedule.js',
  'shared/supabase-config.js',
  'shared/submissions-api.js',
  'shared/trip-metrics.js',
  'lisbon/data.js',
  'galway/data.js',
  'dublin/data.js',
  'london/data.js',
  'today/',
  'today/index.html',
  'today/app.js',
  'today/schedule-logic.js',
  'today/styles.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.allSettled(PRECACHE.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Supabase reads: network-first, fall back to cached response.
  if (url.hostname.endsWith('supabase.co')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Images: stale-while-revalidate.
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request, { ignoreSearch: true }).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Everything else (app shell, data, scripts): cache-first, ignore ?v= query.
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && url.origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
