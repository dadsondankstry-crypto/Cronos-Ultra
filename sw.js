const CACHE_NAME = 'cronos-ultra-cache-v1.8';
const IMAGE_CACHE = 'cronos-images-v1';

const assets = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  './icon-192.png',
  './icon-512.png'
];

// Instalação e cache de ficheiros estruturais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Estratégia especial para Imagens (Mangás/Manhwas)
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(cache => {
        return cache.match(event.request).then(response => {
          // Retorna do cache se existir, senão procura na rede e guarda no cache
          return response || fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } else {
    // Estratégia padrão para o resto (Network First com fallback para cache)
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});

// Limpeza de caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME && key !== IMAGE_CACHE)
          .map(key => caches.delete(key))
    ))
  );
});