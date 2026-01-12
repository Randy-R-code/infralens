// InfraLens Service Worker
const CACHE_VERSION = "v2";
const CACHE_NAME = `infralens-${CACHE_VERSION}`;

// Assets to cache on install (only truly static assets)
const STATIC_ASSETS = [
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/favicon.ico",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Activate immediately - don't wait for old SW to finish
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(
            (name) => name.startsWith("infralens-") && name !== CACHE_NAME
          )
          .map((name) => caches.delete(name))
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip server actions and API routes
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next/server") ||
    request.headers.get("Next-Action")
  ) {
    return;
  }

  // Skip external requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Navigation requests (HTML pages) - Network only, no cache
  // This ensures fresh HTML on every page load
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        // Offline fallback - try cache
        return caches.match(request).then((cached) => {
          return cached || caches.match("/");
        });
      })
    );
    return;
  }

  // Next.js hashed assets (_next/static/) - Stale-while-revalidate
  // These have unique hashes, so cache is safe but we still revalidate
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          });
          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // Static files (images, fonts) - Cache first with network fallback
  if (
    url.pathname.startsWith("/fonts/") ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|ico|webp|woff|woff2)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(request).then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Default - Network only (don't cache dynamic content)
  event.respondWith(fetch(request));
});
