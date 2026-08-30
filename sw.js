// Service worker: guarda la app en el dispositivo para que funcione sin internet.
// Estrategia: "network first" para el HTML (así ves los cambios al recargar)
// y "cache first" para el resto de archivos.

const CACHE = 'ruso-app-v1';
const ARCHIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/app.js',
  './js/store.js',
  './js/srs.js',
  './js/ui.js',
  './js/tts.js',
  './js/ai.js',
  './js/player.js',
  './js/exercises.js',
  './js/views/home.js',
  './js/views/alphabet.js',
  './js/views/lesson.js',
  './js/views/tutor.js',
  './js/views/settings.js',
  './js/views/progress.js',
  './data/alphabet.js',
  './data/lessons.js',
  './icons/icon.svg',
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evento) => {
  const url = new URL(evento.request.url);
  if (evento.request.method !== 'GET') return;
  // Las llamadas a la IA nunca se cachean.
  if (url.pathname.startsWith('/api/')) return;
  if (url.origin !== location.origin) return;

  const esHTML = evento.request.mode === 'navigate';
  if (esHTML) {
    evento.respondWith(
      fetch(evento.request).catch(() => caches.match('./index.html'))
    );
    return;
  }
  evento.respondWith(
    caches.match(evento.request).then((guardado) =>
      guardado || fetch(evento.request).then((respuesta) => {
        const copia = respuesta.clone();
        caches.open(CACHE).then((c) => c.put(evento.request, copia)).catch(() => {});
        return respuesta;
      })
    )
  );
});
