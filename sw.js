// Service worker: permite usar la app sin internet.
//
// Estrategia: RED PRIMERO con tiempo límite, y la caché como red de seguridad.
// Es lo que evita el problema clásico de las PWA: que actualices el código y
// el navegador te siga sirviendo la versión vieja durante días. Si hay servidor
// a mano, siempre ves lo último; si no lo hay, tiras de lo guardado.

const VERSION = '3.1.0';          // debe coincidir con js/version.js
const CACHE = `ruso-app-${VERSION}`;
const LIMITE_MS = 3000;           // más de esto y damos por buena la copia local

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
  './js/speech.js',
  './js/player.js',
  './js/exercises.js',
  './js/version.js',
  './js/views/home.js',
  './js/views/alphabet.js',
  './js/views/lesson.js',
  './js/views/tutor.js',
  './js/views/settings.js',
  './js/views/progress.js',
  './js/views/grammar.js',
  './js/views/verbs.js',
  './js/views/dialogues.js',
  './js/views/roleplay.js',
  './js/views/speaking.js',
  './data/alphabet.js',
  './data/lessons.js',
  './data/verbos.js',
  './data/gramatica.js',
  './data/dialogos.js',
  './data/curso/a0-a1.js',
  './data/curso/a2.js',
  './data/curso/b1.js',
  './data/curso/b2.js',
  './data/curso/c1.js',
  './icons/icon.svg',
];

self.addEventListener('install', (evento) => {
  evento.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // addAll falla entero si un solo archivo falla; los pedimos de uno en uno
    // para que un fichero renombrado no deje la actualización a medias.
    await Promise.all(ARCHIVOS.map(async (ruta) => {
      try {
        const r = await fetch(new Request(ruta, { cache: 'reload' }));
        if (r.ok) await cache.put(ruta, r);
      } catch (e) {
        console.warn('[sw] no pude guardar', ruta, e);
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil((async () => {
    const claves = await caches.keys();
    await Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
    // Avisamos a las pestañas abiertas de que hay versión nueva.
    const clientes = await self.clients.matchAll({ type: 'window' });
    for (const c of clientes) c.postMessage({ tipo: 'version-nueva', version: VERSION });
  })());
});

self.addEventListener('message', (evento) => {
  if (evento.data?.tipo === 'aplicar-ya') self.skipWaiting();
});

function conTiempoLimite(promesa, ms) {
  return new Promise((resolver, rechazar) => {
    const temporizador = setTimeout(() => rechazar(new Error('tiempo agotado')), ms);
    promesa.then((v) => { clearTimeout(temporizador); resolver(v); },
                 (e) => { clearTimeout(temporizador); rechazar(e); });
  });
}

self.addEventListener('fetch', (evento) => {
  const peticion = evento.request;
  if (peticion.method !== 'GET') return;

  const url = new URL(peticion.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith('/api/')) return;   // la IA nunca se cachea

  evento.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const respuesta = await conTiempoLimite(fetch(peticion), LIMITE_MS);
      if (respuesta && respuesta.ok) cache.put(peticion, respuesta.clone()).catch(() => {});
      return respuesta;
    } catch (e) {
      const guardado = await cache.match(peticion);
      if (guardado) return guardado;
      if (peticion.mode === 'navigate') {
        const inicio = await cache.match('./index.html');
        if (inicio) return inicio;
      }
      throw e;
    }
  })());
});
