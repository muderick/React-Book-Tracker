const CACHE_NAME = "book-tracker-cache-v1";
const OFFLINE_URL = "offline.html";
const urlsToCache = [
  "/",
  "/index.html",
  `/${OFFLINE_URL}`,
  "/manifest.json",
  "/logo192.png",
  "/favicon.ico",
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

// self.addEventListener('fetch', (event) => {
//   // Skip non-HTTP(s) requests (like chrome-extension://)
//   if (!event.request.url.startsWith('http')) {
//     return;
//   }

//   event.respondWith(
//     caches.open('my-cache').then((cache) => {
//       return fetch(event.request)
//         .then((response) => {
//           cache.put(event.request, response.clone());
//           return response;
//         })
//         .catch(() => caches.match(event.request));
//     })
//   );
// });

// Listen for requests
self.addEventListener("fetch", (event) => {
  if (!event.request.url.startsWith("http")) {
    return;
  }
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((res) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, res.clone());

              return res;
            });
          })
        );
      })
    );
  }
});
