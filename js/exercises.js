// Generador de ejercicios. A partir del vocabulario y las frases del curso
// construye preguntas variadas. Todo funciona sin IA; la IA (si la activas)
// añade ejercicios extra y corrige tus traducciones libres.

import { TODO_VOCAB } from '../data/lessons.js';
import { mezclar, aleatorio } from './ui.js';

const TIPOS = ['ru2es', 'es2ru', 'audio', 'escribir'];

function distractores(objetivo, campo, pool, n = 3) {
  const candidatos = pool.filter((v) => v[campo] !== objetivo[campo] && v.ru !== objetivo.ru);
  // Preferimos distractores de la misma categoría: se parecen más y obligan a pensar.
  const mismos = mezclar(candidatos.filter((v) => v.cat === objetivo.cat));
  const otros = mezclar(candidatos);
  const elegidos = [];
  for (const v of [...mismos, ...otros]) {
    if (elegidos.length >= n) break;
    if (!elegidos.some((e) => e[campo] === v[campo])) elegidos.push(v);
  }
  return elegidos;
}

function opcionMultiple(palabra, pool, { desde }) {
  const campo = desde === 'ru' ? 'es' : 'ru';
  const malas = distractores(palabra, campo, pool, 3);
  const opciones = mezclar([palabra, ...malas]).map((v) => v[campo]);
  return {
    tipo: desde === 'ru' ? 'ru2es' : 'es2ru',
    idTarjeta: palabra.id,
    palabra,
    enunciado: desde === 'ru' ? '¿Qué significa?' : '¿Cómo se dice en ruso?',
    muestra: desde === 'ru' ? palabra.ru : palabra.es,
    audio: desde === 'ru' ? palabra.ru : null,
    opciones,
    correcta: opciones.indexOf(palabra[campo]),
  };
}

function ejercicioAudio(palabra, pool) {
  const malas = distractores(palabra, 'ru', pool, 3);
  const opciones = mezclar([palabra, ...malas]).map((v) => v.ru);
  return {
    tipo: 'audio',
    idTarjeta: palabra.id,
    palabra,
    enunciado: 'Escucha y elige la palabra que oyes',
    muestra: '🔊',
    audio: palabra.ru,
    autoAudio: true,
    opciones,
    correcta: opciones.indexOf(palabra.ru),
  };
}

function ejercicioEscribir(palabra) {
  return {
    tipo: 'escribir',
    idTarjeta: palabra.id,
    palabra,
    enunciado: 'Escríbelo en ruso',
    muestra: palabra.es,
    audio: palabra.ru,
    respuesta: palabra.ru,
  };
}

function ejercicioOrdenar(frase, idTarjeta) {
  const palabras = frase.ru.replace(/([.,!?])/g, '').split(/\s+/).filter(Boolean);
  if (palabras.length < 3) return null;
  return {
    tipo: 'ordenar',
    idTarjeta,
    enunciado: 'Ordena las palabras para formar la frase',
    muestra: frase.es,
    audio: frase.ru,
    fichas: mezclar(palabras),
    respuesta: palabras.join(' '),
    frase,
  };
}

/**
 * Crea la tanda de ejercicios de una unidad.
 * Alterna tipos para que no se haga repetitivo y termina con las frases.
 */
export function ejerciciosDeUnidad(unidad, { conAudio = true } = {}) {
  const pool = TODO_VOCAB.filter((v) => v.unidad === unidad.id);
  const global = TODO_VOCAB;
  const lista = [];

  pool.forEach((palabra, i) => {
    const tipo = TIPOS[i % TIPOS.length];
    if (tipo === 'audio' && !conAudio) {
      lista.push(opcionMultiple(palabra, global, { desde: 'ru' }));
      return;
    }
    if (tipo === 'ru2es') lista.push(opcionMultiple(palabra, global, { desde: 'ru' }));
    else if (tipo === 'es2ru') lista.push(opcionMultiple(palabra, global, { desde: 'es' }));
    else if (tipo === 'audio') lista.push(ejercicioAudio(palabra, global));
    else lista.push(ejercicioEscribir(palabra));
  });

  for (const frase of unidad.frases) {
    const ej = ejercicioOrdenar(frase, `${unidad.id}:frase:${frase.ru}`);
    if (ej) lista.push(ej);
  }

  return lista;
}

/** Ejercicios de repaso a partir de una lista de ids de tarjeta (repetición espaciada). */
export function ejerciciosDeRepaso(ids, { conAudio = true } = {}) {
  const porId = new Map(TODO_VOCAB.map((v) => [v.id, v]));
  const lista = [];
  ids.forEach((id, i) => {
    const palabra = porId.get(id);
    if (!palabra) return;
    const tipos = conAudio ? TIPOS : TIPOS.filter((t) => t !== 'audio');
    const tipo = tipos[i % tipos.length];
    if (tipo === 'ru2es') lista.push(opcionMultiple(palabra, TODO_VOCAB, { desde: 'ru' }));
    else if (tipo === 'es2ru') lista.push(opcionMultiple(palabra, TODO_VOCAB, { desde: 'es' }));
    else if (tipo === 'audio') lista.push(ejercicioAudio(palabra, TODO_VOCAB));
    else lista.push(ejercicioEscribir(palabra));
  });
  return lista;
}

/** Ejercicio suelto para el modo "práctica rápida". */
export function ejercicioAleatorio() {
  const palabra = aleatorio(TODO_VOCAB);
  const tipo = aleatorio(['ru2es', 'es2ru', 'audio']);
  if (tipo === 'audio') return ejercicioAudio(palabra, TODO_VOCAB);
  return opcionMultiple(palabra, TODO_VOCAB, { desde: tipo === 'ru2es' ? 'ru' : 'es' });
}

/** Convierte los ejercicios que devuelve la IA al formato interno. */
export function desdeIA(datos, unidad) {
  const bruto = Array.isArray(datos) ? datos : datos?.ejercicios || [];
  return bruto
    .filter((e) => e && e.pregunta && Array.isArray(e.opciones) && e.opciones.length >= 2)
    .map((e, i) => ({
      tipo: 'ia',
      idTarjeta: `${unidad.id}:ia:${i}`,
      enunciado: 'Ejercicio generado por tu IA local',
      muestra: String(e.pregunta),
      opciones: e.opciones.map(String),
      correcta: Math.max(0, Math.min(e.opciones.length - 1, Number(e.correcta) || 0)),
      pista: e.pista ? String(e.pista) : '',
      audio: null,
    }));
}
