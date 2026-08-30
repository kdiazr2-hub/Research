// Generador de ejercicios. A partir del vocabulario y las frases del curso
// construye preguntas variadas. Todo funciona sin IA; la IA (si la activas)
// añade ejercicios extra y corrige tus traducciones libres.

import { TODO_VOCAB, TODAS_FRASES, UNIDADES } from '../data/lessons.js';
import { VERBOS, PERSONAS, futuro } from '../data/verbos.js';
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

/**
 * Ejercicio suelto para el modo "práctica rápida".
 * Se queda dentro del pool que le pases (por defecto, todo el curso), para no
 * preguntarle vocabulario de C1 a alguien que va por la unidad 3.
 */
export function ejercicioAleatorio(pool = TODO_VOCAB) {
  const fuente = pool.length ? pool : TODO_VOCAB;
  const palabra = aleatorio(fuente);
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

// ---------------------------------------------------------------------------
// Ejercicios de conjugación
// ---------------------------------------------------------------------------

/** "читать → я …?" con cuatro formas donde elegir. */
function ejercicioConjugar(verbo, tiempo = 'presente') {
  const i = Math.floor(Math.random() * PERSONAS.length);
  const formas = tiempo === 'futuro' ? futuro(verbo) : verbo.presente;
  const correcta = formas[i];
  if (!correcta || correcta === '—' || correcta.includes('arcaico')) return null;

  // Distractores: otras personas del mismo verbo y formas de verbos parecidos.
  const mismas = formas.filter((f) => f !== correcta && f !== '—');
  const otras = mezclar(VERBOS.filter((v) => v.grupo === verbo.grupo && v.inf !== verbo.inf))
    .slice(0, 4)
    .map((v) => (tiempo === 'futuro' ? futuro(v) : v.presente)[i])
    .filter((f) => f && f !== '—' && f !== correcta);

  const malas = [...mezclar(mismas).slice(0, 2), ...otras].slice(0, 3);
  if (malas.length < 2) return null;
  const opciones = mezclar([correcta, ...malas]);

  return {
    tipo: 'conjugar',
    idTarjeta: `verbo:${verbo.inf}:${i}:${tiempo}`,
    enunciado: `Conjuga en ${tiempo === 'futuro' ? 'futuro' : verbo.aspecto === 'perf' ? 'futuro' : 'presente'}`,
    muestra: `${verbo.inf} → ${PERSONAS[i]} …`,
    audio: correcta,
    opciones,
    correcta: opciones.indexOf(correcta),
    pista: `${verbo.inf} = ${verbo.es}${verbo.nota ? '. ' + verbo.nota : ''}`,
  };
}

export function ejerciciosConjugacion(cantidad = 12) {
  const lista = [];
  const pool = mezclar(VERBOS.filter((v) => v.presente[0] !== '—'));
  let i = 0;
  while (lista.length < cantidad && i < pool.length * 2) {
    const verbo = pool[i % pool.length];
    const ej = ejercicioConjugar(verbo, Math.random() < 0.25 ? 'futuro' : 'presente');
    if (ej) lista.push(ej);
    i += 1;
  }
  return lista;
}

// ---------------------------------------------------------------------------
// Ejercicios de pronunciación (hablar)
// ---------------------------------------------------------------------------

export function ejerciciosHablar(cantidad = 8, nivelesPermitidos = null) {
  const pool = TODAS_FRASES.filter((f) => !nivelesPermitidos || nivelesPermitidos.includes(f.nivel));
  return mezclar(pool.length ? pool : TODAS_FRASES).slice(0, cantidad).map((f) => ({
    tipo: 'hablar',
    idTarjeta: f.id,
    enunciado: 'Léelo en voz alta',
    muestra: f.ru,
    audio: f.ru,
    respuesta: f.ru,
    frase: f,
  }));
}

// ---------------------------------------------------------------------------
// Traducción libre (se corrige con la IA local si está activada)
// ---------------------------------------------------------------------------

export function ejercicioTraducir(frase) {
  return {
    tipo: 'traducir',
    idTarjeta: frase.id,
    enunciado: 'Tradúcelo al ruso',
    muestra: frase.es,
    audio: frase.ru,
    respuesta: frase.ru,
    frase,
  };
}

export function ejerciciosTraduccion(cantidad = 8, unidadId = null) {
  const pool = unidadId ? TODAS_FRASES.filter((f) => f.unidad === unidadId) : TODAS_FRASES;
  return mezclar(pool).slice(0, cantidad).map(ejercicioTraducir);
}

/** Sesión mixta de una unidad: vocabulario + frases + traducción libre. */
export function ejerciciosCompletos(unidad, opciones = {}) {
  const base = ejerciciosDeUnidad(unidad, opciones);
  const frases = TODAS_FRASES.filter((f) => f.unidad === unidad.id);
  // A partir de A2 pedimos también traducir una frase entera: es lo que
  // de verdad enseña a construir, no solo a reconocer.
  if (['A2', 'B1', 'B2', 'C1'].includes(unidad.nivel) && frases.length) {
    base.push(...mezclar(frases).slice(0, 2).map(ejercicioTraducir));
  }
  return base;
}
