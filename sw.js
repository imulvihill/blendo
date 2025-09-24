const CACHE_NAME = 'blendo-v3'; // Incrementamos la versión
const urlsToCache = [
  '/blendo/',
  '/blendo/index.html',
  '/blendo/icon-512x512.png',
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone/babel.min.js'
];

// Instalar el Service Worker y guardar TODOS los archivos en el caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto, guardando archivos de la aplicación...');
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
