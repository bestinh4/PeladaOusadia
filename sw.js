
const CACHE_NAME = 'oa-elite-v1.3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://upload.wikimedia.org/wikipedia/pt/c/cf/Croatia_football_federation.png'
];

// Instalação: Força o cache dos arquivos críticos
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Ativação: Limpa caches obsoletos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Se estiver no cache, retorna imediatamente (Cache First para assets)
      if (cachedResponse) {
        return cachedResponse;
      }

      // Se não estiver no cache, busca na rede
      return fetch(event.request).then((networkResponse) => {
        // Se a rede retornar 404 e for uma navegação (URL digitada ou link)
        // servimos o index.html do cache (SPA Fallback)
        if (networkResponse.status === 404 && event.request.mode === 'navigate') {
          return caches.match('/index.html') || caches.match('/');
        }

        // Caso contrário, retorna a resposta da rede e salva no cache se for válida
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Se a rede falhar totalmente (offline)
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html') || caches.match('/');
        }
      });
    })
  );
});
