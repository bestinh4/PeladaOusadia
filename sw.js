
const CACHE_NAME = 'oa-elite-v1';
const ASSETS = [
  './index.html',
  './index.tsx',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=block'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
