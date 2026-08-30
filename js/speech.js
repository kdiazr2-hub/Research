// Reconocimiento de voz para practicar pronunciación.
// Usa la API del navegador (funciona en Chrome, Edge y Safari de iPhone).
// Si el navegador no la tiene, la app lo detecta y ofrece autoevaluación.

import { normalizarRuso } from './ui.js';

const Reconocedor = window.SpeechRecognition || window.webkitSpeechRecognition;

export function hayReconocimiento() {
  return Boolean(Reconocedor);
}

/**
 * Escucha una frase en ruso y devuelve lo que ha entendido.
 * @returns {Promise<{texto:string, alternativas:string[]}>}
 */
export function escuchar({ tiempoMax = 8000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!Reconocedor) return reject(new Error('Este navegador no reconoce voz.'));
    const r = new Reconocedor();
    r.lang = 'ru-RU';
    r.interimResults = false;
    r.maxAlternatives = 5;
    r.continuous = false;

    let resuelto = false;
    const temporizador = setTimeout(() => {
      if (!resuelto) { try { r.stop(); } catch (e) { /* ya parado */ } }
    }, tiempoMax);

    r.onresult = (ev) => {
      resuelto = true;
      clearTimeout(temporizador);
      const resultado = ev.results[0];
      const alternativas = Array.from(resultado).map((a) => a.transcript);
      resolve({ texto: alternativas[0] || '', alternativas });
    };
    r.onerror = (ev) => {
      clearTimeout(temporizador);
      const mensajes = {
        'not-allowed': 'No has dado permiso para usar el micrófono.',
        'no-speech': 'No he oído nada. Prueba otra vez, más cerca del micro.',
        'audio-capture': 'No encuentro ningún micrófono.',
        network: 'El reconocimiento de voz necesita conexión a internet en este navegador.',
      };
      reject(new Error(mensajes[ev.error] || `Error de reconocimiento: ${ev.error}`));
    };
    r.onend = () => {
      clearTimeout(temporizador);
      if (!resuelto) reject(new Error('No he oído nada. Inténtalo de nuevo.'));
    };

    try {
      r.start();
    } catch (e) {
      reject(new Error('No se pudo activar el micrófono.'));
    }
  });
}

/**
 * Compara lo dicho con lo esperado y da una nota de 0 a 100.
 * Es tolerante: el reconocedor puede equivocarse en una palabra y aun así
 * queremos premiar al alumno si la frase se entiende.
 */
export function puntuar(dicho, esperado) {
  const a = normalizarRuso(dicho).split(' ').filter(Boolean);
  const b = normalizarRuso(esperado).split(' ').filter(Boolean);
  if (!b.length) return 0;
  if (a.join(' ') === b.join(' ')) return 100;

  // Cuenta cuántas palabras esperadas aparecen (con parecido tolerante).
  const restantes = [...a];
  let aciertos = 0;
  for (const palabra of b) {
    const i = restantes.findIndex((p) => p === palabra || parecidas(p, palabra));
    if (i >= 0) { aciertos += 1; restantes.splice(i, 1); }
  }
  const cobertura = aciertos / b.length;
  const exceso = Math.max(0, restantes.length) / Math.max(b.length, 1);
  return Math.max(0, Math.round((cobertura - exceso * 0.25) * 100));
}

// Dos palabras se consideran parecidas si difieren en una letra o menos
// (el reconocedor confunde mucho las terminaciones).
function parecidas(x, y) {
  if (Math.abs(x.length - y.length) > 2) return false;
  return distancia(x, y) <= (x.length > 5 ? 2 : 1);
}

function distancia(x, y) {
  const fila = Array.from({ length: y.length + 1 }, (_, i) => i);
  for (let i = 1; i <= x.length; i++) {
    let anterior = fila[0];
    fila[0] = i;
    for (let j = 1; j <= y.length; j++) {
      const temp = fila[j];
      fila[j] = Math.min(
        fila[j] + 1,
        fila[j - 1] + 1,
        anterior + (x[i - 1] === y[j - 1] ? 0 : 1)
      );
      anterior = temp;
    }
  }
  return fila[y.length];
}
