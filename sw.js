const CACHE_NAME = 'cronos-ultra-cache-v1';

// AJUSTE: Mudei para 'index.html' para coincidir com o seu arquivo atual
const assets = [
  './',
  './index.html' 
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});