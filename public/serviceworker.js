const CACHE_NAME = "book-tracker-cache-v1";
const OFFLINE_URL = "offline.html";
const urlsToCache = [
  "/",
  "/index.html",
  `/${OFFLINE_URL}`,
  "/manifest.json",
  "/images/book-solid-full.png",
  "/images/book-solid-full.ico",
  "/main.js",
  "/styles.css",
  "/about",
  "/book-details-location",
];

const self = this;

// Install SW
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching offline resources");

      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate the SW
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Listen for fetch events
self.addEventListener("fetch", (event) => {
  if (!event.request.url.startsWith("http")) return;
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);

  // Handle API requests separately
  if (requestUrl.origin === "https://www.googleapis.com") {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => networkResponse)
        .catch(() => {
          console.log("[SW] Offline - returning fallback empty books");
          // Return empty response for API failures
          return new Response(JSON.stringify({ items: [] }), {
            headers: { "Content-Type": "application/json" },
          });
        })
    );
    return;
  }

  // Handle navigation requests
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache fresh response
          const responseClone = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => {
          return caches
            .match(event.request)
            .then(
              (cachedResponse) => cachedResponse || caches.match(OFFLINE_URL)
            );
        })
    );
    return;
  }

  // Handle all other requests
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) return cachedResponse;

      // Fetch from network and cache
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseClone));

          return networkResponse;
        })
        .catch(() => {
          // Return offline fallbacks
          if (event.request.destination === "image") {
            return caches.match("/images/book-solid-full.png");
          }
          return new Response("Offline");
        });
    })
  );
});
