import { el } from '../ui.js';
import { obtener, actualizar } from '../store.js';
import { TODO_VOCAB, unidadesPorNivel, numeroDeUnidad } from '../../data/lessons.js';
import { colaDelDia, resumen, pendientesHoy } from '../srs.js';

export function vistaInicio(raiz) {
  const estado = obtener();
  const ids = TODO_VOCAB.map((v) => v.id);
  const r = resumen(ids);
  const pendientes = pendientesHoy(ids).length;
  const cola = colaDelDia(ids, estado.ajustes.metaDiaria).length;
  const nombre = estado.perfil.nombre;

  raiz.appendChild(el('header', { class: 'saludo' }, [
    el('h1', { text: nombre ? `Привет, ${nombre}!` : 'Привет! 👋' }),
    el('p', { class: 'saludo__sub', text: 'Curso completo de ruso, del alfabeto al nivel avanzado.' }),
  ]));

  raiz.appendChild(el('div', { class: 'tarjetas-cifras' }, [
    cifra('🔥', estado.perfil.racha, estado.perfil.racha === 1 ? 'día seguido' : 'días seguidos'),
    cifra('⭐', estado.perfil.xp, 'XP'),
    cifra('📚', r.vistas, `de ${r.total} palabras`),
    cifra('🏆', r.dominadas, 'dominadas'),
  ]));

  raiz.appendChild(el('section', { class: 'destacado' }, [
    el('div', { class: 'destacado__texto' }, [
      el('h2', { text: 'Repaso de hoy' }),
      el('p', {
        text: pendientes
          ? `Tienes ${pendientes} ${pendientes === 1 ? 'palabra' : 'palabras'} que repasar. Son las que estás a punto de olvidar.`
          : cola
            ? `Nada pendiente: toca aprender ${cola} palabras nuevas.`
            : '¡Todo al día! Vuelve mañana o explora una unidad nueva.',
      }),
    ]),
    el('a', {
      class: `boton boton--principal ${cola ? '' : 'boton--desactivado'}`,
      href: cola ? '#/repaso' : '#/inicio',
      text: cola ? `Empezar (${cola})` : 'Al día ✓',
    }),
  ]));

  raiz.appendChild(el('div', { class: 'accesos' }, [
    acceso('🔤', 'Alfabeto', 'Las 33 letras', '#/alfabeto'),
    acceso('📖', 'Gramática', 'Casos y tablas', '#/gramatica'),
    acceso('🔀', 'Verbos', 'Conjugador', '#/verbos'),
    acceso('🎭', 'Diálogos', 'Conversaciones', '#/dialogos'),
    acceso('⚡', 'Práctica', '10 preguntas', '#/rapida'),
    acceso('📈', 'Progreso', 'Tus cifras', '#/progreso'),
  ]));

  // --- La ruta: unidades agrupadas por nivel -------------------------------
  raiz.appendChild(el('h2', { class: 'seccion-titulo', text: 'Tu ruta' }));

  const niveles = unidadesPorNivel();
  const abiertoGuardado = estado.ui?.nivelAbierto;
  const nivelActual = abiertoGuardado || primerNivelIncompleto(niveles);

  for (const nivel of niveles) {
    const idsNivel = nivel.unidades.flatMap((u) => u.vocab.map((v) => `${u.id}:${v.ru}`));
    const rn = resumen(idsNivel);
    const pct = rn.total ? Math.round((rn.vistas / rn.total) * 100) : 0;
    const abierto = nivel.id === nivelActual;

    const lista = el('div', { class: 'unidades' });
    nivel.unidades.forEach((u) => lista.appendChild(tarjetaUnidad(u, estado)));

    const bloque = el('details', { class: 'nivel', open: abierto || null }, [
      el('summary', { class: 'nivel__cabecera' }, [
        el('span', { class: 'nivel__emoji', text: nivel.emoji }),
        el('span', { class: 'nivel__texto' }, [
          el('span', { class: 'nivel__nombre', text: `${nivel.id} · ${nivel.nombre}` }),
          el('span', { class: 'nivel__lema', text: nivel.lema }),
        ]),
        el('span', { class: 'nivel__pct', text: `${pct}%` }),
      ]),
      el('div', { class: 'nivel__cuerpo' }, [
        el('p', { class: 'nivel__meta', text: nivel.meta }),
        el('div', { class: 'barra barra--fina' }, [el('div', { class: 'barra__relleno', style: `width:${pct}%` })]),
        lista,
      ]),
    ]);
    bloque.addEventListener('toggle', () => {
      if (bloque.open) actualizar((e) => { e.ui = { ...(e.ui || {}), nivelAbierto: nivel.id }; });
    });
    raiz.appendChild(bloque);
  }
}

function primerNivelIncompleto(niveles) {
  const estado = obtener();
  for (const nivel of niveles) {
    const incompleta = nivel.unidades.some((u) => !estado.unidades[u.id]?.completada);
    if (incompleta) return nivel.id;
  }
  return niveles[niveles.length - 1]?.id;
}

function tarjetaUnidad(u, estado) {
  const idsU = u.vocab.map((v) => `${u.id}:${v.ru}`);
  const ru = resumen(idsU);
  const pct = ru.total ? Math.round((ru.vistas / ru.total) * 100) : 0;
  const progreso = estado.unidades[u.id] || {};
  return el('a', { class: 'unidad', href: `#/unidad/${u.id}` }, [
    el('div', { class: 'unidad__emoji', text: u.emoji }),
    el('div', { class: 'unidad__cuerpo' }, [
      el('div', { class: 'unidad__cabecera' }, [
        el('span', { class: 'unidad__num', text: `Unidad ${numeroDeUnidad(u.id)}` }),
        progreso.completada ? el('span', { class: 'etiqueta etiqueta--ok', text: '✓ hecha' }) : null,
      ]),
      el('h3', { text: u.titulo }),
      el('p', { class: 'unidad__desc', text: u.descripcion }),
      el('div', { class: 'barra barra--fina' }, [
        el('div', { class: 'barra__relleno', style: `width:${pct}%` }),
      ]),
    ]),
  ]);
}

function cifra(emoji, valor, etiqueta) {
  return el('div', { class: 'cifra' }, [
    el('div', { class: 'cifra__emoji', text: emoji }),
    el('div', { class: 'cifra__valor', text: String(valor) }),
    el('div', { class: 'cifra__etiqueta', text: etiqueta }),
  ]);
}

function acceso(emoji, titulo, sub, href) {
  return el('a', { class: 'acceso', href }, [
    el('span', { class: 'acceso__emoji', text: emoji }),
    el('span', { class: 'acceso__titulo', text: titulo }),
    el('span', { class: 'acceso__sub', text: sub }),
  ]);
}
