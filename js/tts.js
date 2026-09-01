// Pronunciación con la voz del propio dispositivo (Web Speech API).
// No requiere internet ni servicios externos. En iPhone hay voz rusa (Milena)
// y en Windows/Mac suele estar disponible tras instalar el idioma ruso.

import { obtener } from './store.js';

let vocesCache = [];

function cargarVoces() {
  if (!('speechSynthesis' in window)) return [];
  vocesCache = window.speechSynthesis.getVoices() || [];
  return vocesCache;
}

if ('speechSynthesis' in window) {
  cargarVoces();
  window.speechSynthesis.onvoiceschanged = cargarVoces;
}

export function vozRusa() {
  const voces = vocesCache.length ? vocesCache : cargarVoces();
  return (
    voces.find((v) => v.lang && v.lang.toLowerCase().startsWith('ru')) || null
  );
}

export function hayVozRusa() {
  return Boolean(vozRusa());
}

export function hablar(texto, { velocidad = 0.9 } = {}) {
  if (!('speechSynthesis' in window)) return false;
  if (!obtener().ajustes.audio) return false;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    const voz = vozRusa();
    if (voz) u.voice = voz;
    u.lang = 'ru-RU';
    u.rate = velocidad;
    window.speechSynthesis.speak(u);
    return true;
  } catch (e) {
    console.warn('No se pudo reproducir el audio', e);
    return false;
  }
}

/** Como hablar(), pero espera a que termine la frase. Sirve para leer diálogos seguidos. */
export function hablarEsperando(texto, { velocidad = 0.9 } = {}) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window) || !obtener().ajustes.audio) return resolve(false);
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(texto);
      const voz = vozRusa();
      if (voz) u.voice = voz;
      u.lang = 'ru-RU';
      u.rate = velocidad;
      u.onend = () => resolve(true);
      u.onerror = () => resolve(false);
      // Red de seguridad: algunos navegadores no disparan onend.
      const margen = 2000 + texto.length * 120;
      setTimeout(() => resolve(true), margen);
      window.speechSynthesis.speak(u);
    } catch (e) {
      resolve(false);
    }
  });
}

export function callar() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
