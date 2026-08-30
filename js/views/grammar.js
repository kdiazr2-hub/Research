import { el, textoRico, aviso, subnav } from '../ui.js';
import { CASOS, TABLAS, ATAJOS } from '../../data/gramatica.js';
import { hablar } from '../tts.js';
import * as IA from '../ai.js';

export function vistaGramatica(raiz) {
  raiz.appendChild(subnav('gramatica'));
  raiz.appendChild(el('header', { class: 'cabecera-vista' }, [
    el('h1', { text: '📖 Gramática de consulta' }),
    el('p', { text: 'No hace falta memorizar esto. Está aquí para que lo mires cada vez que dudes: acabarás aprendiéndolo de tanto consultarlo.' }),
  ]));

  // --- Los seis casos ------------------------------------------------------
  raiz.appendChild(el('h2', { class: 'seccion-titulo', text: 'Los seis casos' }));
  const casos = el('div', { class: 'casos' });
  for (const c of CASOS) {
    casos.appendChild(el('details', { class: 'caso' }, [
      el('summary', { class: 'caso__cabecera' }, [
        el('span', { class: 'caso__nombre', text: c.nombre }),
        el('span', { class: 'caso__pregunta', text: c.pregunta }),
      ]),
      el('div', { class: 'caso__cuerpo' }, [
        el('p', { text: c.uso }),
        c.preposiciones.length
          ? el('div', { class: 'caso__preps' }, [
              el('span', { class: 'caso__preps-titulo', text: 'Preposiciones que lo rigen: ' }),
              ...c.preposiciones.map((p) => el('span', { class: 'etiqueta', text: p })),
            ])
          : null,
        el('div', { class: 'caso__ejemplo' }, [
          el('button', { class: 'boton boton--audio', text: '🔊', onclick: () => hablar(c.ejemplo.ru) }),
          el('span', { class: 'ejemplo__ru', text: c.ejemplo.ru }),
          el('span', { class: 'ejemplo__es', text: c.ejemplo.es }),
        ]),
      ]),
    ]));
  }
  raiz.appendChild(casos);

  // --- Tablas --------------------------------------------------------------
  raiz.appendChild(el('h2', { class: 'seccion-titulo', text: 'Tablas' }));
  for (const t of TABLAS) {
    const tabla = el('table', { class: 'tabla' }, [
      el('thead', {}, [el('tr', {}, t.columnas.map((c) => el('th', { text: c })))]),
      el('tbody', {}, t.filas.map((fila) =>
        el('tr', {}, fila.map((celda, i) =>
          el(i === 0 ? 'th' : 'td', { class: i === 0 ? 'tabla__fila-titulo' : '', text: celda })
        ))
      )),
    ]);
    raiz.appendChild(el('section', { class: 'bloque-gramatica' }, [
      el('h3', { text: t.titulo }),
      el('div', { class: 'tabla-scroll' }, [tabla]),
      t.nota ? el('p', { class: 'pista', text: t.nota }) : null,
    ]));
  }

  // --- Atajos y errores típicos -------------------------------------------
  raiz.appendChild(el('h2', { class: 'seccion-titulo', text: 'Atajos mentales' }));
  for (const a of ATAJOS) {
    raiz.appendChild(el('article', { class: 'bloque-gramatica' }, [
      el('h3', { text: a.titulo }),
      el('p', { html: textoRico(a.texto) }),
    ]));
  }

  // --- Preguntar a la IA ---------------------------------------------------
  raiz.appendChild(el('div', { class: 'caja-ia' }, [
    el('h3', { text: '🤖 ¿Te queda una duda concreta?' }),
    el('p', { text: 'Si tienes un modelo local configurado, pregúntale por lo que no entiendas de esta página.' }),
    (() => {
      const entrada = el('input', { class: 'entrada', type: 'text', placeholder: 'Ej.: ¿cuándo uso в y cuándo на?' });
      const boton = el('button', {
        class: 'boton', text: 'Preguntar',
        onclick: async () => {
          const tema = entrada.value.trim();
          if (!tema) return;
          if (!IA.configurada()) {
            aviso('Primero configura tu IA local en Ajustes.', 'aviso');
            location.hash = '#/ajustes';
            return;
          }
          salida.textContent = 'Pensando…';
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
        },
      });
      const salida = el('div', { class: 'salida-ia oculto-si-vacio' });
      entrada.addEventListener('keydown', (e) => { if (e.key === 'Enter') boton.click(); });
      return el('div', {}, [entrada, el('div', { class: 'fila-botones' }, [boton]), salida]);
    })(),
  ]));
}
