import { el, mezclar, subnav } from '../ui.js';
import { ALFABETO, NOTAS_PRONUNCIACION } from '../../data/alphabet.js';
import { hablar, hayVozRusa } from '../tts.js';

const COLORES = {
  facil: 'Se parece a la latina y suena igual',
  trampa: '¡Ojo! Se parece a una latina pero suena distinto',
  nueva: 'Letra nueva, sin equivalente visual',
};

export function vistaAlfabeto(raiz) {
  raiz.appendChild(subnav('alfabeto'));
  raiz.appendChild(el('header', { class: 'cabecera-vista' }, [
    el('h1', { text: 'El alfabeto cirílico' }),
    el('p', { text: '33 letras. En unas horas puedes leer (aunque no entiendas). Toca cada letra para oírla.' }),
  ]));

  if (!hayVozRusa()) {
    raiz.appendChild(el('div', { class: 'nota nota--aviso' }, [
      el('p', { text: 'Este dispositivo no tiene voz rusa instalada, así que el audio sonará con acento raro (o no sonará). En Ajustes te explico cómo instalarla en un minuto.' }),
    ]));
  }

  raiz.appendChild(el('div', { class: 'leyenda' }, Object.entries(COLORES).map(([k, v]) =>
    el('span', { class: `leyenda__item leyenda__item--${k}`, text: v })
  )));

  const grid = el('div', { class: 'alfabeto' });
  for (const l of ALFABETO) {
    const celda = el('button', { class: `letra letra--${l.tipo}` }, [
      el('span', { class: 'letra__par', text: `${l.mayus} ${l.minus}` }),
      el('span', { class: 'letra__lat', text: l.lat }),
    ]);
    celda.addEventListener('click', () => {
      hablar(l.ejemplo);
      mostrarDetalle(l);
    });
    grid.appendChild(celda);
  }
  raiz.appendChild(grid);

  const detalle = el('div', { class: 'detalle-letra', id: 'detalle-letra' });
  raiz.appendChild(detalle);

  function mostrarDetalle(l) {
    detalle.innerHTML = '';
    detalle.appendChild(el('div', { class: 'detalle-letra__caja' }, [
      el('div', { class: 'detalle-letra__grande', text: `${l.mayus} ${l.minus}` }),
      el('div', {}, [
        el('div', { class: 'detalle-letra__nombre', text: `Se llama «${l.nombre}»` }),
        el('div', { class: 'detalle-letra__sonido', text: `Suena: ${l.sonido}` }),
        el('div', { class: 'detalle-letra__ejemplo' }, [
          el('strong', { text: l.ejemplo }),
          el('span', { text: ` — ${l.ejemploEs}` }),
          el('button', { class: 'boton boton--audio', text: '🔊', onclick: () => hablar(l.ejemplo) }),
        ]),
      ]),
    ]));
    detalle.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  raiz.appendChild(el('h2', { class: 'seccion-titulo', text: 'Cuatro cosas que debes saber' }));
  const notas = el('div', { class: 'notas' });
  for (const n of NOTAS_PRONUNCIACION) {
    notas.appendChild(el('details', { class: 'nota' }, [
      el('summary', { text: n.titulo }),
      el('p', { text: n.texto }),
    ]));
  }
  raiz.appendChild(notas);

  raiz.appendChild(el('h2', { class: 'seccion-titulo', text: 'Pon a prueba tus letras' }));
  raiz.appendChild(quizAlfabeto());
}

// Mini-juego: aparece una letra, eliges su sonido.
function quizAlfabeto() {
  const caja = el('div', { class: 'quiz-alfabeto' });
  let pendientes = mezclar(ALFABETO.filter((l) => l.lat !== '"' && l.lat !== "'"));
  let aciertos = 0;
  let intentos = 0;

  function ronda() {
    caja.innerHTML = '';
    if (!pendientes.length) pendientes = mezclar(ALFABETO.filter((l) => l.lat !== '"' && l.lat !== "'"));
    const objetivo = pendientes.shift();
    const malas = mezclar(ALFABETO.filter((l) => l.lat !== objetivo.lat)).slice(0, 3);
    const opciones = mezclar([objetivo, ...malas]);

    caja.appendChild(el('div', { class: 'quiz-alfabeto__letra', text: objetivo.mayus + ' ' + objetivo.minus }));
    caja.appendChild(el('p', { class: 'quiz-alfabeto__pregunta', text: '¿Qué sonido tiene?' }));
    const fila = el('div', { class: 'quiz-alfabeto__opciones' });
    for (const op of opciones) {
      const b = el('button', { class: 'opcion opcion--mini', text: op.lat });
      b.addEventListener('click', () => {
        intentos += 1;
        const bien = op.lat === objetivo.lat;
        if (bien) aciertos += 1;
        b.classList.add(bien ? 'opcion--bien' : 'opcion--mal');
        hablar(objetivo.ejemplo);
        marcador.textContent = `${aciertos}/${intentos}`;
        setTimeout(ronda, bien ? 500 : 1400);
      });
      fila.appendChild(b);
    }
    caja.appendChild(fila);
    caja.appendChild(marcador);
  }

  const marcador = el('div', { class: 'quiz-alfabeto__marcador', text: '0/0' });
  ronda();
  return caja;
}
