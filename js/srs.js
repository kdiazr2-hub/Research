// Repetición espaciada (versión simplificada de SM-2, el algoritmo de Anki).
// Idea: cada palabra vuelve a aparecer justo antes de que la olvides.
// Si aciertas, el intervalo crece; si fallas, vuelve a empezar.

import { obtener, actualizar, hoyISO } from './store.js';

export const CALIDAD = {
  OTRA_VEZ: 0,  // no me acordaba
  DIFICIL: 1,   // me costó
  BIEN: 2,      // correcto
  FACIL: 3,     // instantáneo
};

function nuevaTarjeta(id) {
  return {
    id,
    ef: 2.5,          // factor de facilidad
    intervalo: 0,     // en días
    repeticiones: 0,
    proximo: hoyISO(),
    aciertos: 0,
    fallos: 0,
    ultimoRepaso: null,
  };
}

export function tarjeta(id) {
  const e = obtener();
  return e.tarjetas[id] || nuevaTarjeta(id);
}

export function esNueva(id) {
  return !obtener().tarjetas[id];
}

function sumarDias(dias) {
  return hoyISO(new Date(Date.now() + dias * 86400000));
}

export function registrarRespuesta(id, calidad) {
  return actualizar((e) => {
    const t = e.tarjetas[id] || nuevaTarjeta(id);

    if (calidad === CALIDAD.OTRA_VEZ) {
      t.fallos += 1;
      t.repeticiones = 0;
      t.intervalo = 0;                       // vuelve hoy mismo
      t.ef = Math.max(1.3, t.ef - 0.2);
    } else {
      t.aciertos += 1;
      t.repeticiones += 1;
      if (t.repeticiones === 1) t.intervalo = 1;
      else if (t.repeticiones === 2) t.intervalo = 3;
      else t.intervalo = Math.round(t.intervalo * t.ef);

      if (calidad === CALIDAD.DIFICIL) {
        t.intervalo = Math.max(1, Math.round(t.intervalo * 0.6));
        t.ef = Math.max(1.3, t.ef - 0.15);
      } else if (calidad === CALIDAD.FACIL) {
        t.intervalo = Math.round(t.intervalo * 1.3);
        t.ef = Math.min(2.8, t.ef + 0.1);
      }
      t.intervalo = Math.min(t.intervalo, 365);
    }

    t.ultimoRepaso = hoyISO();
    t.proximo = sumarDias(t.intervalo);
    e.tarjetas[id] = t;
  });
}

// Devuelve los ids que tocan hoy (vencidos), los más atrasados primero.
export function pendientesHoy(ids) {
  const e = obtener();
  const hoy = hoyISO();
  return ids
    .filter((id) => {
      const t = e.tarjetas[id];
      return t && t.proximo <= hoy;
    })
    .sort((a, b) => (e.tarjetas[a].proximo < e.tarjetas[b].proximo ? -1 : 1));
}

export function nuevas(ids, limite = 10) {
  const e = obtener();
  return ids.filter((id) => !e.tarjetas[id]).slice(0, limite);
}

// Cola de repaso del día: primero lo vencido, luego palabras nuevas hasta la meta.
export function colaDelDia(ids, meta = 20) {
  const vencidas = pendientesHoy(ids);
  const hueco = Math.max(0, meta - vencidas.length);
  return [...vencidas, ...nuevas(ids, hueco)];
}

export function resumen(ids) {
  const e = obtener();
  const hoy = hoyISO();
  let vistas = 0, vencidas = 0, dominadas = 0;
  for (const id of ids) {
    const t = e.tarjetas[id];
    if (!t) continue;
    vistas += 1;
    if (t.proximo <= hoy) vencidas += 1;
    if (t.intervalo >= 21) dominadas += 1;
  }
  return { total: ids.length, vistas, nuevas: ids.length - vistas, vencidas, dominadas };
}
