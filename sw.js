// Bump CACHE whenever precached files or this worker's logic change, so the
// activate handler clears the stale cache. (Add to the pre-deploy checklist.)
const CACHE = 'ee-today-v6';

// Paths are relative to sw.js (repo root).
// REQUIRED: the Today view must render offline from these — a missing one
// aborts install (all-or-nothing) so we never report a broken "ready" state.
const REQUIRED = [
  'today/',
  'today/index.html',
  'today/app.js',
  'today/schedule-logic.js',
  'today/styles.css',
  'shared/schedule.js',
  'lisbon/data.js',
  'galway/data.js',
  'dublin/data.js',
  'london/data.js'
];

// OPTIONAL: nice-to-have offline (hub shell, reaction/metrics support). These
// degrade gracefully, so best-effort caching must not block install.
const OPTIONAL = [
  './',
  'index.html',
  'styles.css',
  'shared/supabase-config.js',
  'shared/submissions-api.js',
  'shared/trip-metrics.js'
];

// Canonical, query-less cache key so a bumped ?v= refreshes the same path
// cleanly instead of piling up stale variants.
function cacheKeyFor(url) {
  return new Request(url.origin + url.pathname);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.all([
        cache.addAll(REQUIRED),
        Promise.allSettled(OPTIONAL.map((url) => cache.add(url)))
      ]))
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
  // Keyed by full URL (query carries the REST filter — must not be stripped).
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

  // Same-origin shell/data/scripts: stale-while-revalidate.
  // Serve cache instantly (offline-first), refresh in the background under a
  // canonical key so edits land on the next visit — not the current one.
  if (url.origin === self.location.origin) {
    const key = cacheKeyFor(url);
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(key).then((cached) => {
          const network = fetch(request)
            .then((response) => {
              if (response && response.ok) cache.put(key, response.clone());
              return response;
            })
            .catch(() => cached);
          return cached || network;
        })
      )
    );
    return;
  }

  // Cross-origin non-image (e.g. the Supabase CDN bundle): pass through.
});
