
const CACHE_NAME = 'oa-elite-v1.1';
const ASSETS = [
  'index.html',
  'index.tsx',
  'manifest.json',
  'https://upload.wikimedia.org/wikipedia/pt/c/cf/Croatia_football_federation.png',
  'https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=block'
];

// Instalação: Salva arquivos essenciais no cache
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Cacheando shell do app');
      return cache.addAll(ASSETS);
    })
  );
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('SW: Limpando cache antigo');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Interceptação de requisições: Tenta Cache -> Senão Rede
self.addEventListener('fetch', (event) => {
  // Para navegações, sempre tenta retornar o index.html se houver erro
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('index.html');
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
