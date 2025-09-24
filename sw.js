const CACHE_NAME = 'blendo-v1'; // Hemos cambiado el nombre del caché
const urlsToCache = [
  '/blendo/',
  '/blendo/index.html',
  '/blendo/icon-512x512.png'
];

// Instalar el Service Worker y guardar los archivos en el caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto, guardando archivos...');
        return cache.addAll(urlsToCache);
      })
  );
});

// Limpiar cachés viejos al activar un nuevo Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Borrando caché antiguo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Servir la aplicación desde el caché (estrategia "Network First")
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
