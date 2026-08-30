import { el, aviso, textoRico } from '../ui.js';
import { unidadPorId, TODO_VOCAB, vocabHastaNivel } from '../../data/lessons.js';
import { obtener, actualizar } from '../store.js';
import { hablar } from '../tts.js';
import { resumen, tarjeta, colaDelDia } from '../srs.js';
import { ejerciciosCompletos, ejerciciosDeRepaso, ejercicioAleatorio, desdeIA,
         ejerciciosConjugacion, ejerciciosHablar } from '../exercises.js';
import { reproductor } from '../player.js';
import * as IA from '../ai.js';

export function vistaUnidad(raiz, id) {
  const u = unidadPorId(id);
  if (!u) {
    raiz.appendChild(el('p', { class: 'vacio', text: 'Esa unidad no existe.' }));
    return;
  }
  const ids = u.vocab.map((v) => `${u.id}:${v.ru}`);
  const r = resumen(ids);

  raiz.appendChild(el('header', { class: 'cabecera-vista' }, [
    el('a', { class: 'volver', href: '#/inicio', text: '← Unidades' }),
    el('h1', { text: `${u.emoji} ${u.titulo}` }),
    el('p', { text: u.descripcion }),
    el('div', { class: 'unidad__cabecera' }, [
      el('span', { class: 'etiqueta', text: u.nivel }),
      el('span', { class: 'etiqueta', text: `${u.vocab.length} palabras` }),
      el('span', { class: 'etiqueta', text: `${r.vistas} vistas` }),
    ]),
  ]));

  raiz.appendChild(el('div', { class: 'acciones-unidad' }, [
    el('a', { class: 'boton boton--principal', href: `#/practica/${u.id}`, text: '▶ Practicar esta unidad' }),
    el('button', {
      class: 'boton', text: '🤖 Ejercicios con IA',
      onclick: () => { location.hash = `#/practica/${u.id}/ia`; },
    }),
  ]));

  raiz.appendChild(el('p', { class: 'pista', text: `Nivel ${u.nivel} · ${u.vocab.length} palabras · ${u.frases.length} frases` }));

  // --- Gramática ---
  raiz.appendChild(el('h2', { class: 'seccion-titulo', text: 'Gramática' }));
  for (const g of u.gramatica) {
    const ejemplos = el('ul', { class: 'ejemplos' });
    for (const ej of g.ejemplos || []) {
      ejemplos.appendChild(el('li', {}, [
        el('button', { class: 'boton boton--audio', text: '🔊', onclick: () => hablar(ej.ru) }),
        el('span', { class: 'ejemplo__ru', text: ej.ru }),
        el('span', { class: 'ejemplo__tr', text: ej.tr }),
        el('span', { class: 'ejemplo__es', text: ej.es }),
      ]));
    }
    raiz.appendChild(el('article', { class: 'bloque-gramatica' }, [
      el('h3', { text: g.titulo }),
      el('p', { html: textoRico(g.texto) }),
      ejemplos,
      el('button', {
        class: 'boton boton--sutil', text: '🤖 Que me lo explique la IA con más ejemplos',
        onclick: (e) => explicarConIA(e.currentTarget, `${g.titulo}. ${g.texto}`),
      }),
    ]));
  }

  // --- Vocabulario ---
  raiz.appendChild(el('h2', { class: 'seccion-titulo', text: 'Vocabulario' }));
  const tabla = el('div', { class: 'vocab' });
  for (const v of u.vocab) {
    const idT = `${u.id}:${v.ru}`;
    const t = obtener().tarjetas[idT];
    const estado = !t ? 'nueva' : t.intervalo >= 21 ? 'dominada' : 'aprendiendo';
    tabla.appendChild(el('div', { class: `vocab__fila vocab__fila--${estado}` }, [
      el('button', { class: 'boton boton--audio', text: '🔊', onclick: () => hablar(v.ru) }),
      el('div', { class: 'vocab__ru' }, [
        el('span', { class: 'vocab__palabra', text: v.ru }),
        obtener().ajustes.transliteracion ? el('span', { class: 'vocab__tr', text: v.tr }) : null,
      ]),
      el('div', { class: 'vocab__es' }, [
        el('span', { text: v.es }),
        v.nota ? el('span', { class: 'vocab__nota', text: v.nota }) : null,
      ]),
      el('span', { class: `punto punto--${estado}`, title: estado }),
    ]));
  }
  raiz.appendChild(tabla);

  // --- Frases ---
  raiz.appendChild(el('h2', { class: 'seccion-titulo', text: 'Frases de la unidad' }));
  const frases = el('div', { class: 'frases' });
  for (const f of u.frases) {
    frases.appendChild(el('div', { class: 'frase' }, [
      el('button', { class: 'boton boton--audio', text: '🔊', onclick: () => hablar(f.ru) }),
      el('div', {}, [
        el('div', { class: 'frase__ru', text: f.ru }),
        el('div', { class: 'frase__tr', text: f.tr }),
        el('div', { class: 'frase__es', text: f.es }),
      ]),
    ]));
  }
  raiz.appendChild(frases);

  // --- Diálogo con IA ---
  raiz.appendChild(el('div', { class: 'caja-ia' }, [
    el('h3', { text: '🤖 Practica con tu IA local' }),
    el('p', { text: 'Si tienes un modelo configurado, puede inventarte un diálogo con este vocabulario.' }),
    el('button', {
      class: 'boton', text: 'Generar un diálogo',
      onclick: (e) => generarDialogo(e.currentTarget, u),
    }),
  ]));
}

async function explicarConIA(boton, tema) {
  if (!IA.configurada()) {
    aviso('Primero activa y configura tu IA local en Ajustes.', 'aviso');
    location.hash = '#/ajustes';
    return;
  }
  const salida = el('div', { class: 'salida-ia', text: 'Pensando…' });
  boton.after(salida);
  boton.disabled = true;
  try {
    let texto = '';
    await IA.chat(IA.promptExplicacion(tema), {
      onToken: (t) => { texto += t; salida.innerHTML = textoRico(texto); },
    });
  } catch (e) {
    salida.textContent = `No pude conectar con la IA: ${e.message}`;
    salida.classList.add('salida-ia--error');
  } finally {
    boton.disabled = false;
  }
}

async function generarDialogo(boton, unidad) {
  if (!IA.configurada()) {
    aviso('Primero activa y configura tu IA local en Ajustes.', 'aviso');
    location.hash = '#/ajustes';
    return;
  }
  const salida = el('div', { class: 'salida-ia', text: 'Escribiendo el diálogo…' });
  boton.after(salida);
  boton.disabled = true;
  try {
    let texto = '';
    await IA.chat(IA.promptDialogo(unidad.titulo, unidad.nivel), {
      onToken: (t) => { texto += t; salida.innerHTML = textoRico(texto); },
    });
  } catch (e) {
    salida.textContent = `No pude conectar con la IA: ${e.message}`;
    salida.classList.add('salida-ia--error');
  } finally {
    boton.disabled = false;
  }
}

// --------------------------------------------------------------------------
// Sesiones de práctica
// --------------------------------------------------------------------------

export function vistaPractica(raiz, id, modo) {
  const u = unidadPorId(id);
  if (!u) {
    raiz.appendChild(el('p', { class: 'vacio', text: 'Esa unidad no existe.' }));
    return;
  }
  const conAudio = obtener().ajustes.audio;

  if (modo === 'ia') return practicaIA(raiz, u, conAudio);

  const ejercicios = ejerciciosCompletos(u, { conAudio });
  reproductor(raiz, ejercicios, {
    alTerminar: ({ precision }) => {
      actualizar((e) => {
        const p = e.unidades[u.id] || { veces: 0, mejorPuntaje: 0, completada: false };
        p.veces += 1;
        p.mejorPuntaje = Math.max(p.mejorPuntaje, precision);
        if (precision >= 70) p.completada = true;
        e.unidades[u.id] = p;
      });
    },
  });
}

async function practicaIA(raiz, unidad, conAudio) {
  if (!IA.configurada()) {
    raiz.appendChild(el('div', { class: 'vacio' }, [
      el('p', { text: 'Para generar ejercicios con IA necesitas configurar un modelo local.' }),
      el('a', { class: 'boton boton--principal', href: '#/ajustes', text: 'Ir a Ajustes' }),
    ]));
    return;
  }
  const cargando = el('div', { class: 'cargando' }, [
    el('div', { class: 'spinner' }),
    el('p', { text: 'Tu modelo local está creando ejercicios… (puede tardar unos segundos)' }),
  ]);
  raiz.appendChild(cargando);
  try {
    const datos = await IA.chatJSON(IA.promptEjercicios(unidad, 6));
    const ejercicios = desdeIA(datos, unidad);
    cargando.remove();
    if (!ejercicios.length) throw new Error('El modelo no devolvió ejercicios utilizables.');
    reproductor(raiz, ejercicios);
  } catch (e) {
    cargando.remove();
    raiz.appendChild(el('div', { class: 'vacio' }, [
      el('p', { text: `No se pudieron generar los ejercicios: ${e.message}` }),
      el('p', { class: 'pista', text: 'Con modelos pequeños esto falla a veces. Prueba otro modelo o usa la práctica normal.' }),
      el('a', { class: 'boton', href: `#/practica/${unidad.id}`, text: 'Práctica normal' }),
    ]));
  }
}

export function vistaRepaso(raiz) {
  const estado = obtener();
  const ids = TODO_VOCAB.map((v) => v.id);
  const cola = colaDelDia(ids, estado.ajustes.metaDiaria);
  if (!cola.length) {
    raiz.appendChild(el('div', { class: 'vacio' }, [
      el('div', { class: 'vacio__emoji', text: '✅' }),
      el('h2', { text: '¡Repaso al día!' }),
      el('p', { text: 'No hay nada vencido. Puedes hacer práctica rápida o empezar una unidad nueva.' }),
      el('a', { class: 'boton boton--principal', href: '#/rapida', text: 'Práctica rápida' }),
    ]));
    return;
  }
  reproductor(raiz, ejerciciosDeRepaso(cola, { conAudio: estado.ajustes.audio }));
}

export function vistaRapida(raiz) {
  // Preferimos palabras que ya has visto alguna vez; si acabas de empezar,
  // tiramos del vocabulario de tu nivel para no asustarte con léxico de C1.
  const estado = obtener();
  const vistas = TODO_VOCAB.filter((v) => estado.tarjetas[v.id]);
  const pool = vistas.length >= 12 ? vistas : vocabHastaNivel(estado.ajustes.nivel || 'A1');
  const ejercicios = Array.from({ length: 10 }, () => ejercicioAleatorio(pool));
  reproductor(raiz, ejercicios);
}

export function vistaConjugar(raiz) {
  reproductor(raiz, ejerciciosConjugacion(14));
}

export function vistaHablar(raiz) {
  const estado = obtener();
  const nivel = estado.ajustes.nivel;
  const orden = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1'];
  const permitidos = nivel ? orden.slice(0, orden.indexOf(nivel) + 1) : null;
  reproductor(raiz, ejerciciosHablar(10, permitidos));
}
