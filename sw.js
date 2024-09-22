const cacheName = "v1";
const assetsToCache = [
  "/",
  "/styles/style.css",
  "/scripts/render.js",
  "/manifest.json",
  "/favicon.ico",
  "/touch-icon.png"
];

// Instala o Service Worker e faz cache dos assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Recupera os assets do cache quando offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
