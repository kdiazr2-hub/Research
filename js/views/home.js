import { el } from '../ui.js';
import { obtener } from '../store.js';
import { UNIDADES, TODO_VOCAB } from '../../data/lessons.js';
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
    el('p', { class: 'saludo__sub', text: 'Aprende ruso desde cero, a tu ritmo y sin conexión.' }),
  ]));

  raiz.appendChild(el('div', { class: 'tarjetas-cifras' }, [
    cifra('🔥', estado.perfil.racha, estado.perfil.racha === 1 ? 'día seguido' : 'días seguidos'),
    cifra('⭐', estado.perfil.xp, 'XP'),
    cifra('📚', r.vistas, `de ${r.total} palabras`),
    cifra('🏆', r.dominadas, 'dominadas'),
  ]));

  // Bloque destacado: el repaso del día.
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
    acceso('⚡', 'Práctica rápida', '10 preguntas', '#/rapida'),
    acceso('💬', 'Tutor IA', 'Chatea en ruso', '#/tutor'),
    acceso('📈', 'Progreso', 'Tus cifras', '#/progreso'),
  ]));

  raiz.appendChild(el('h2', { class: 'seccion-titulo', text: 'Unidades' }));
  const lista = el('div', { class: 'unidades' });
  UNIDADES.forEach((u, i) => {
    const idsU = u.vocab.map((v) => `${u.id}:${v.ru}`);
    const ru = resumen(idsU);
    const pct = ru.total ? Math.round((ru.vistas / ru.total) * 100) : 0;
    const progreso = estado.unidades[u.id] || {};
    lista.appendChild(el('a', { class: 'unidad', href: `#/unidad/${u.id}` }, [
      el('div', { class: 'unidad__emoji', text: u.emoji }),
      el('div', { class: 'unidad__cuerpo' }, [
        el('div', { class: 'unidad__cabecera' }, [
          el('span', { class: 'unidad__num', text: `Unidad ${i + 1}` }),
          el('span', { class: 'etiqueta', text: u.nivel }),
          progreso.completada ? el('span', { class: 'etiqueta etiqueta--ok', text: '✓ hecha' }) : null,
        ]),
        el('h3', { text: u.titulo }),
        el('p', { class: 'unidad__desc', text: u.descripcion }),
        el('div', { class: 'barra barra--fina' }, [
          el('div', { class: 'barra__relleno', style: `width:${pct}%` }),
        ]),
      ]),
    ]));
  });
  raiz.appendChild(lista);
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
