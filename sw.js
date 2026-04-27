const CACHE_NAME = 'pampulha-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Instala o Service Worker e salva os arquivos principais no celular
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepta as requisições
self.addEventListener('fetch', event => {
  // Deixa o Firebase lidar com as conexões de banco de dados nativamente
  if (event.request.url.includes('firestore.googleapis.com')) {
    return;
  }

  // Responde com o cache para os arquivos estáticos (HTML, CSS, JS)
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// Atualiza o cache quando houver novas versões
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
