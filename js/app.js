// Arranque y navegación. La app es una sola página; el "router" mira el
// trozo de URL que va después de # y decide qué pantalla dibujar.

import { vistaInicio } from './views/home.js';
import { vistaAlfabeto } from './views/alphabet.js';
import { vistaUnidad, vistaPractica, vistaRepaso, vistaRapida, vistaConjugar, vistaHablar } from './views/lesson.js';
import { vistaGramatica } from './views/grammar.js';
import { vistaDialogos, vistaDialogo, vistaActuar } from './views/dialogues.js';
import { vistaConversar } from './views/roleplay.js';
import { vistaHablarHub } from './views/speaking.js';
import { vistaVerbos } from './views/verbs.js';
import { vistaTutor } from './views/tutor.js';
import { vistaAjustes } from './views/settings.js';
import { vistaProgreso } from './views/progress.js';
import { obtener } from './store.js';
import { TODO_VOCAB } from '../data/lessons.js';
import { pendientesHoy } from './srs.js';

const contenido = document.getElementById('contenido');
const navegacion = document.getElementById('navegacion');

const RUTAS = [
  { patron: /^\/inicio$/, vista: (r) => vistaInicio(r), nav: 'inicio' },
  { patron: /^\/alfabeto$/, vista: (r) => vistaAlfabeto(r), nav: 'consulta' },
  { patron: /^\/unidad\/([\w-]+)$/, vista: (r, m) => vistaUnidad(r, m[1]), nav: 'inicio' },
  { patron: /^\/practica\/([\w-]+)(?:\/(ia))?$/, vista: (r, m) => vistaPractica(r, m[1], m[2]), nav: 'inicio', limpia: true },
  { patron: /^\/repaso$/, vista: (r) => vistaRepaso(r), nav: 'repaso', limpia: true },
  { patron: /^\/rapida$/, vista: (r) => vistaRapida(r), nav: 'repaso', limpia: true },
  { patron: /^\/gramatica$/, vista: (r) => vistaGramatica(r), nav: 'consulta' },
  { patron: /^\/verbos$/, vista: (r) => vistaVerbos(r), nav: 'consulta' },
  { patron: /^\/conjugar$/, vista: (r) => vistaConjugar(r), nav: 'consulta', limpia: true },
  { patron: /^\/hablar$/, vista: (r) => vistaHablarHub(r), nav: 'hablar' },
  { patron: /^\/pronunciacion$/, vista: (r) => vistaHablar(r), nav: 'hablar', limpia: true },
  { patron: /^\/dialogos$/, vista: (r) => vistaDialogos(r), nav: 'hablar' },
  { patron: /^\/dialogo\/([\w-]+)$/, vista: (r, m) => vistaDialogo(r, m[1]), nav: 'hablar' },
  { patron: /^\/actuar\/([\w-]+)$/, vista: (r, m) => vistaActuar(r, m[1]), nav: 'hablar', limpia: true },
  { patron: /^\/conversar(?:\/([\w-]+))?$/, vista: (r, m) => vistaConversar(r, m[1]), nav: 'hablar' },
  { patron: /^\/tutor$/, vista: (r) => vistaTutor(r), nav: 'hablar' },
  { patron: /^\/progreso$/, vista: (r) => vistaProgreso(r), nav: 'progreso' },
  { patron: /^\/ajustes$/, vista: (r) => vistaAjustes(r), nav: 'ajustes' },
];

const ENLACES_NAV = [
  { id: 'inicio', emoji: '🏠', texto: 'Inicio', href: '#/inicio' },
  { id: 'consulta', emoji: '📖', texto: 'Consulta', href: '#/gramatica' },
  { id: 'repaso', emoji: '🔁', texto: 'Repaso', href: '#/repaso' },
  { id: 'hablar', emoji: '🗣️', texto: 'Hablar', href: '#/hablar' },
  { id: 'ajustes', emoji: '⚙️', texto: 'Ajustes', href: '#/ajustes' },
];

function pintarNav(activo) {
  navegacion.innerHTML = '';
  const pendientes = pendientesHoy(TODO_VOCAB.map((v) => v.id)).length;
  for (const enlace of ENLACES_NAV) {
    const a = document.createElement('a');
    a.className = `nav__item ${enlace.id === activo ? 'nav__item--activo' : ''}`;
    a.href = enlace.href;
    a.innerHTML = `<span class="nav__emoji">${enlace.emoji}</span><span class="nav__texto">${enlace.texto}</span>`;
    if (enlace.id === 'repaso' && pendientes) {
      const globo = document.createElement('span');
      globo.className = 'nav__globo';
      globo.textContent = pendientes > 99 ? '99+' : String(pendientes);
      a.appendChild(globo);
    }
    navegacion.appendChild(a);
  }
}

function enrutar() {
  const ruta = location.hash.replace(/^#/, '') || '/inicio';
  const encontrada = RUTAS.find((r) => r.patron.test(ruta));

  contenido.innerHTML = '';
  contenido.scrollTop = 0;
  window.scrollTo(0, 0);

  if (!encontrada) {
    location.hash = '#/inicio';
    return;
  }
  document.body.classList.toggle('modo-practica', Boolean(encontrada.limpia));
  const coincidencia = ruta.match(encontrada.patron);
  try {
    encontrada.vista(contenido, coincidencia);
  } catch (e) {
    console.error(e);
    contenido.innerHTML = `<div class="vacio"><p>Algo se rompió al dibujar esta pantalla.</p><pre class="pista">${String(e.message)}</pre></div>`;
  }
  pintarNav(encontrada.nav);
}

window.addEventListener('hashchange', enrutar);

// Aviso de bienvenida la primera vez.
function bienvenida() {
  const estado = obtener();
  if (estado.perfil.xp > 0 || localStorage.getItem('ruso-bienvenida')) return;
  localStorage.setItem('ruso-bienvenida', '1');
  const caja = document.createElement('div');
  caja.className = 'modal';
  caja.innerHTML = `
    <div class="modal__caja">
      <h2>Добро пожаловать 👋</h2>
      <p>Bienvenido/a. Un curso completo de ruso: del alfabeto (A0) al nivel avanzado (C1), 46 unidades y 752 palabras.</p>
      <ol class="modal__lista">
        <li><strong>Empieza por el alfabeto.</strong> Con leer cirílico ya ganas media batalla.</li>
        <li><strong>Haz la Unidad 1</strong> y luego el <strong>repaso diario</strong>: son 5 minutos y es lo que de verdad fija las palabras.</li>
        <li><strong>Habla desde el primer día.</strong> En «Hablar» el móvil te escucha y te puntúa la pronunciación.</li>
        <li><strong>Opcional:</strong> conecta un modelo de IA local (Ollama o una app del iPhone) para tener tutor y ejercicios infinitos.</li>
      </ol>
      <button class="boton boton--principal boton--ancho">¡Vamos!</button>
    </div>`;
  caja.querySelector('button').addEventListener('click', () => caja.remove());
  caja.addEventListener('click', (e) => { if (e.target === caja) caja.remove(); });
  document.body.appendChild(caja);
}

// Service worker: permite usar la app sin conexión.
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => { /* sin conexión offline, no pasa nada */ });
  });
}

enrutar();
bienvenida();
