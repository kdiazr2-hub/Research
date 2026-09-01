import { el } from '../ui.js';
import { obtener } from '../store.js';
import { DIALOGOS } from '../../data/dialogos.js';
import { hayReconocimiento } from '../speech.js';
import * as IA from '../ai.js';

// Centro de "hablar": todo lo que te hace pasar de entender a producir.
export function vistaHablarHub(raiz) {
  const estado = obtener();
  const actuados = Object.values(estado.dialogos || {}).filter((d) => d.actuado).length;

  raiz.appendChild(el('header', { class: 'cabecera-vista' }, [
    el('h1', { text: '🗣️ Hablar' }),
    el('p', { text: 'Entender ruso y hablarlo son dos músculos distintos. Aquí se entrena el segundo, que es el que casi nadie entrena.' }),
  ]));

  raiz.appendChild(el('div', { class: 'accesos-grandes' }, [
    tarjeta('🎭', 'Diálogos', `${DIALOGOS.length} conversaciones graduadas. Escúchalas y luego actúa uno de los dos papeles en voz alta.`,
      '#/dialogos', actuados ? `${actuados} actuados` : 'Empieza por aquí'),
    tarjeta('🎙️', 'Conversación con IA', 'Tu modelo local hace de camarero, taxista o médico y habla solo en ruso. Al terminar te corrige en español.',
      '#/conversar', IA.configurada() ? 'Listo' : 'Necesita IA local'),
    tarjeta('🔊', 'Pronunciación', 'Frases sueltas de tu nivel: las lees en voz alta y el dispositivo te puntúa de 0 a 100.',
      '#/pronunciacion', hayReconocimiento() ? 'Micrófono disponible' : 'Sin micrófono en este navegador'),
    tarjeta('💬', 'Tutor', 'Pregúntale dudas en español: gramática, cómo se dice algo, o que te corrija una frase.',
      '#/tutor', IA.configurada() ? 'Listo' : 'Necesita IA local'),
  ]));

  raiz.appendChild(el('div', { class: 'nota' }, [
    el('p', { text: 'Consejo: no esperes a "estar listo" para hablar. Actúa un diálogo de tu nivel el primer día, aunque leas la línea. El oído y la boca aprenden antes que la cabeza.' }),
  ]));
}

function tarjeta(emoji, titulo, texto, href, estado) {
  return el('a', { class: 'acceso-grande', href }, [
    el('span', { class: 'acceso-grande__emoji', text: emoji }),
    el('span', { class: 'acceso-grande__cuerpo' }, [
      el('span', { class: 'acceso-grande__titulo', text: titulo }),
      el('span', { class: 'acceso-grande__texto', text: texto }),
      el('span', { class: 'acceso-grande__estado', text: estado }),
    ]),
  ]);
}
