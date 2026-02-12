
const CACHE_NAME = 'oa-elite-v1.2';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'manifest.json',
  'https://upload.wikimedia.org/wikipedia/pt/c/cf/Croatia_football_federation.png',
  'https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=block'
];

// Instalação
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Ativação e limpeza de cache
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

// Estratégia: Network First com Fallback para Cache
self.addEventListener('fetch', (event) => {
  // Ignorar requisições de extensões ou esquemas não suportados
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta for válida, clonar e salvar no cache para uso futuro
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Em caso de erro (offline) ou 404, tenta o cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          
          // Se for uma navegação e nada foi encontrado, serve o index.html (SPA Fallback)
          if (event.request.mode === 'navigate') {
            return caches.match('index.html') || caches.match('./');
          }
        });
      })
  );
});
