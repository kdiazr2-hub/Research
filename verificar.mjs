#!/usr/bin/env node
// Verificador del contenido del curso. Ejecútalo tras editar data/:
//     node verificar.mjs
//
// Comprueba que todas las unidades, diálogos, verbos y tablas estén completos,
// que el ruso esté escrito en cirílico y que no se haya colado ningún carácter
// de otro alfabeto (pasa más de lo que parece al copiar y pegar).

import { UNIDADES, TODO_VOCAB, TODAS_FRASES, NIVELES } from './data/lessons.js';
import { DIALOGOS, LINEAS_DIALOGO } from './data/dialogos.js';
import { VERBOS } from './data/verbos.js';
import { TABLAS, CASOS } from './data/gramatica.js';
import { ALFABETO } from './data/alphabet.js';

const problemas = [];
const aviso = (donde, que) => problemas.push(`${donde}: ${que}`);

// Cirílico, latín con tildes, dígitos, espacios y puntuación admitida.
const CARACTERES_RU = /^[Ѐ-ӿ\s0-9.,!?;:()«»"'—–\-…→/]+$/;
const TIENE_CIRILICO = /[Ѐ-ӿ]/;

function revisarRuso(donde, texto) {
  if (!TIENE_CIRILICO.test(texto)) return aviso(donde, `no parece ruso: "${texto}"`);
  if (!CARACTERES_RU.test(texto)) {
    const intrusos = [...texto].filter((c) => !CARACTERES_RU.test(c));
    aviso(donde, `carácter ajeno al cirílico ${JSON.stringify(intrusos)} en "${texto}"`);
  }
}

// --- Unidades --------------------------------------------------------------
const idsUnidad = new Set();
for (const u of UNIDADES) {
  const donde = `unidad ${u.id}`;
  if (idsUnidad.has(u.id)) aviso(donde, 'id repetido');
  idsUnidad.add(u.id);
  for (const campo of ['emoji', 'nivel', 'titulo', 'descripcion']) {
    if (!u[campo]) aviso(donde, `falta ${campo}`);
  }
  if (!NIVELES.some((n) => n.id === u.nivel)) aviso(donde, `nivel desconocido "${u.nivel}"`);
  if (!u.gramatica?.length) aviso(donde, 'sin bloques de gramática');
  if ((u.vocab?.length || 0) < 10) aviso(donde, `solo ${u.vocab?.length} palabras`);
  if ((u.frases?.length || 0) < 3) aviso(donde, `solo ${u.frases?.length} frases`);

  for (const g of u.gramatica || []) {
    if (!g.titulo || !g.texto) aviso(donde, 'bloque de gramática incompleto');
    for (const ej of g.ejemplos || []) {
      if (!ej.ru || !ej.tr || !ej.es) aviso(donde, `ejemplo incompleto: ${JSON.stringify(ej)}`);
      else revisarRuso(`${donde} (ejemplo)`, ej.ru);
    }
  }
  for (const v of u.vocab || []) {
    if (!v.ru || !v.tr || !v.es || !v.cat) aviso(donde, `vocab incompleto: ${JSON.stringify(v)}`);
    else revisarRuso(`${donde} (vocab)`, v.ru.replace(' / ', ' '));
  }
  for (const f of u.frases || []) {
    if (!f.ru || !f.tr || !f.es) aviso(donde, `frase incompleta: ${JSON.stringify(f)}`);
    else revisarRuso(`${donde} (frase)`, f.ru);
  }
}

// --- Ids de tarjeta únicos (los usa la repetición espaciada) ---------------
const vistos = new Set();
for (const v of TODO_VOCAB) {
  if (vistos.has(v.id)) aviso('vocabulario', `id de tarjeta repetido: ${v.id}`);
  vistos.add(v.id);
}

// --- Diálogos --------------------------------------------------------------
for (const d of DIALOGOS) {
  const donde = `diálogo ${d.id}`;
  if (d.personajes?.length !== 2) aviso(donde, 'debe tener exactamente 2 personajes');
  if ((d.lineas?.length || 0) < 4) aviso(donde, 'demasiado corto');
  if (!d.lineas?.some((l) => l.quien === 1)) aviso(donde, 'el alumno no tiene ninguna línea');
  for (const l of d.lineas || []) {
    if (![0, 1].includes(l.quien) || !l.ru || !l.tr || !l.es) aviso(donde, `línea incompleta: ${JSON.stringify(l)}`);
    else revisarRuso(donde, l.ru);
  }
}

// --- Verbos ----------------------------------------------------------------
for (const v of VERBOS) {
  const donde = `verbo ${v.inf}`;
  if (v.presente?.length !== 6) aviso(donde, 'el presente debe tener 6 formas');
  if (v.pasado?.length !== 4) aviso(donde, 'el pasado debe tener 4 formas');
  if (!['imperf', 'perf'].includes(v.aspecto)) aviso(donde, `aspecto inválido "${v.aspecto}"`);
  revisarRuso(donde, v.inf);
}

// --- Tablas de gramática ---------------------------------------------------
for (const t of TABLAS) {
  for (const fila of t.filas) {
    if (fila.length !== t.columnas.length) aviso(`tabla ${t.id}`, `fila con ${fila.length} celdas y ${t.columnas.length} columnas`);
  }
}
if (CASOS.length !== 6) aviso('gramática', 'deberían ser 6 casos');
if (ALFABETO.length !== 33) aviso('alfabeto', `hay ${ALFABETO.length} letras y deberían ser 33`);

// --- Resultado -------------------------------------------------------------
if (problemas.length) {
  console.error(`\n✗ ${problemas.length} problema(s):\n`);
  for (const p of problemas) console.error('  · ' + p);
  process.exit(1);
}

console.log(`
✓ Contenido correcto
  ${UNIDADES.length} unidades · ${TODO_VOCAB.length} palabras · ${TODAS_FRASES.length} frases
  ${DIALOGOS.length} diálogos (${LINEAS_DIALOGO.length} líneas) · ${VERBOS.length} verbos
  ${TABLAS.length} tablas · ${ALFABETO.length} letras
`);
