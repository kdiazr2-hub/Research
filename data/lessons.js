// Índice del curso completo: A0 → C1.
// El contenido vive en data/curso/, un archivo por nivel. Aquí solo se une
// todo y se calculan los índices que usan los ejercicios y el repaso.

import { A0_A1 } from './curso/a0-a1.js';
import { A2 } from './curso/a2.js';
import { B1 } from './curso/b1.js';
import { B2 } from './curso/b2.js';
import { C1 } from './curso/c1.js';

export const UNIDADES = [...A0_A1, ...A2, ...B1, ...B2, ...C1];

// Metadatos de cada nivel, para agrupar y orientar al alumno.
export const NIVELES = [
  {
    id: 'A0', nombre: 'Primeros pasos', emoji: '🌱',
    lema: 'Leer cirílico y sobrevivir a una presentación.',
    meta: 'Al terminar: lees cualquier palabra en voz alta, saludas, te presentas y preguntas dónde está algo.',
  },
  {
    id: 'A1', nombre: 'Principiante', emoji: '🚶',
    lema: 'Frases sencillas sobre ti y tu entorno.',
    meta: 'Al terminar: cuentas, hablas de tu familia y tu trabajo, pides en un bar y te orientas en una ciudad.',
  },
  {
    id: 'A2', nombre: 'Básico', emoji: '🚲',
    lema: 'Pasado, futuro y los casos que faltaban.',
    meta: 'Al terminar: cuentas lo que hiciste y lo que harás, comparas, pides cosas y manejas cuatro de los seis casos.',
  },
  {
    id: 'B1', nombre: 'Intermedio', emoji: '🚗',
    lema: 'Frases largas y conversación real.',
    meta: 'Al terminar: das opiniones, explicas causas, viajas solo, vas al médico y hablas de tu trabajo con soltura.',
  },
  {
    id: 'B2', nombre: 'Intermedio alto', emoji: '✈️',
    lema: 'La lengua escrita y los matices del habla.',
    meta: 'Al terminar: lees prensa, escribes correos formales y usas las partículas que hacen que suenes natural.',
  },
  {
    id: 'C1', nombre: 'Avanzado', emoji: '🚀',
    lema: 'Precisión, estilo y expresiones hechas.',
    meta: 'Al terminar: distingues registros, entiendes ironía y fraseología, y te mueves en textos académicos o periodísticos.',
  },
];

export function unidadesPorNivel() {
  return NIVELES.map((nivel) => ({
    ...nivel,
    unidades: UNIDADES.filter((u) => u.nivel === nivel.id),
  })).filter((n) => n.unidades.length);
}

// Índice plano de todo el vocabulario, con id estable para el sistema de repaso.
export const TODO_VOCAB = UNIDADES.flatMap((u) =>
  u.vocab.map((v) => ({ ...v, id: `${u.id}:${v.ru}`, unidad: u.id, unidadTitulo: u.titulo, nivel: u.nivel }))
);

export const TODAS_FRASES = UNIDADES.flatMap((u) =>
  u.frases.map((f) => ({ ...f, id: `${u.id}:frase:${f.ru}`, unidad: u.id, nivel: u.nivel }))
);

export function unidadPorId(id) {
  return UNIDADES.find((u) => u.id === id);
}

/** Vocabulario de un nivel concreto (o de todos hasta ese nivel). */
export function vocabHastaNivel(nivelId) {
  const orden = NIVELES.map((n) => n.id);
  const limite = orden.indexOf(nivelId);
  if (limite < 0) return TODO_VOCAB;
  return TODO_VOCAB.filter((v) => orden.indexOf(v.nivel) <= limite);
}

export function numeroDeUnidad(id) {
  return UNIDADES.findIndex((u) => u.id === id) + 1;
}
