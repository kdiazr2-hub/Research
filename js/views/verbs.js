import { el, subnav } from '../ui.js';
import { VERBOS, PERSONAS, futuro, buscarVerbo } from '../../data/verbos.js';
import { hablar } from '../tts.js';

export function vistaVerbos(raiz) {
  raiz.appendChild(subnav('verbos'));
  raiz.appendChild(el('header', { class: 'cabecera-vista' }, [
    el('h1', { text: '🔀 Conjugador' }),
    el('p', { text: `Los ${VERBOS.length} verbos que más vas a necesitar, conjugados enteros. Busca por infinitivo o por su significado en español.` }),
  ]));

  const buscador = el('input', {
    class: 'entrada', type: 'search', placeholder: 'Buscar: "жить", "vivir", "zhyt"…',
  });
  raiz.appendChild(buscador);

  raiz.appendChild(el('div', { class: 'fila-botones' }, [
    el('a', { class: 'boton boton--principal', href: '#/conjugar', text: '▶ Practicar conjugación' }),
  ]));

  const lista = el('div', { class: 'verbos' });
  raiz.appendChild(lista);

  function pintar(filtro = '') {
    lista.innerHTML = '';
    const encontrados = buscarVerbo(filtro);
    if (!encontrados.length) {
      lista.appendChild(el('p', { class: 'pista', text: 'Ningún verbo coincide con esa búsqueda.' }));
      return;
    }
    for (const v of encontrados) lista.appendChild(fichaVerbo(v));
  }

  buscador.addEventListener('input', () => pintar(buscador.value));
  pintar();
}

function fichaVerbo(v) {
  const esPerf = v.aspecto === 'perf';
  const tablaPresente = el('table', { class: 'tabla tabla--verbo' }, [
    el('thead', {}, [el('tr', {}, [
      el('th', { text: '' }),
      el('th', { text: esPerf ? 'Futuro' : 'Presente' }),
      el('th', { text: esPerf ? '—' : 'Futuro' }),
    ])]),
    el('tbody', {}, PERSONAS.map((p, i) =>
      el('tr', {}, [
        el('th', { class: 'tabla__fila-titulo', text: p }),
        el('td', { text: v.presente[i] }),
        el('td', { text: esPerf ? '—' : futuro(v)[i] }),
      ])
    )),
  ]);

  const tablaPasado = el('table', { class: 'tabla tabla--verbo' }, [
    el('thead', {}, [el('tr', {}, [
      el('th', { text: 'он' }), el('th', { text: 'она' }), el('th', { text: 'оно' }), el('th', { text: 'они' }),
    ])]),
    el('tbody', {}, [el('tr', {}, v.pasado.map((f) => el('td', { text: f })))]),
  ]);

  return el('details', { class: 'verbo' }, [
    el('summary', { class: 'verbo__cabecera' }, [
      el('span', { class: 'verbo__inf', text: v.inf }),
      el('span', { class: 'verbo__es', text: v.es }),
      el('span', { class: `etiqueta ${esPerf ? 'etiqueta--aviso' : ''}`, text: esPerf ? 'perfectivo' : 'imperfectivo' }),
    ]),
    el('div', { class: 'verbo__cuerpo' }, [
      el('div', { class: 'verbo__meta' }, [
        el('button', { class: 'boton boton--audio', text: '🔊', onclick: () => hablar(v.inf) }),
        el('span', { class: 'vocab__tr', text: v.tr }),
        v.pareja ? el('span', { class: 'pista', text: `pareja aspectual: ${v.pareja}` }) : null,
        el('span', { class: 'pista', text: v.grupo === 'irr' ? 'irregular' : `${v.grupo}ª conjugación` }),
      ]),
      el('div', { class: 'tabla-scroll' }, [tablaPresente]),
      el('h4', { class: 'verbo__subtitulo', text: 'Pasado' }),
      el('div', { class: 'tabla-scroll' }, [tablaPasado]),
      el('p', { class: 'pista', text: `Imperativo: ${v.imperativo}` }),
      v.nota ? el('p', { class: 'nota-verbo', text: `💡 ${v.nota}` }) : null,
    ]),
  ]);
}
