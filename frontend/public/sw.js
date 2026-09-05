// ============================================================
// Service worker: hace que el navegador pueda "instalar" la app
// (ícono propio en el celular, abre sin la barra del navegador) y
// guarda en caché los archivos de la propia app (HTML, CSS, JS,
// íconos) para que abra más rápido.
//
// Los pedidos a /api/ y /uploads/ NUNCA se guardan en caché: son
// datos reales (productos, precios, pagos) que necesitan la base de
// datos real, no una copia vieja guardada en el celular.
// ============================================================

const CACHE = 'crm-frutos-secos-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then(nombres =>
      Promise.all(nombres.filter(nombre => nombre !== CACHE).map(nombre => caches.delete(nombre)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evento) => {
  const url = new URL(evento.request.url);

  if (evento.request.method !== 'GET') return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/uploads/')) return;

  // "Stale-while-revalidate": muestra la versión guardada al instante
  // si existe, y de paso pide la actualizada para la próxima vez.
  evento.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const enCache = await cache.match(evento.request);
      const pedidoRed = fetch(evento.request)
        .then(respuesta => {
          if (respuesta.ok) cache.put(evento.request, respuesta.clone());
          return respuesta;
        })
        .catch(() => enCache);

      return enCache || pedidoRed;
    })
  );
});
