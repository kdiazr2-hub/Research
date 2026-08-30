import { el, textoRico, aviso } from '../ui.js';
import { obtener, actualizar } from '../store.js';
import { hablar } from '../tts.js';
import * as IA from '../ai.js';

const SUGERENCIAS = [
  '¿Cómo pido un café en ruso?',
  'Explícame la diferencia entre ты y вы',
  'Invéntame 5 frases con el verbo жить',
  'Hazme un diálogo en un taxi en Moscú',
  '¿Por qué "молоко" se pronuncia "malakó"?',
  'Ponme un examen de 5 preguntas de nivel A1',
];

export function vistaTutor(raiz) {
  raiz.appendChild(el('header', { class: 'cabecera-vista' }, [
    el('h1', { text: '💬 Tutor de ruso' }),
    el('p', { text: 'Habla con el modelo de IA que corre en tu propio dispositivo. Nada sale a internet.' }),
  ]));

  if (!IA.configurada()) {
    raiz.appendChild(el('div', { class: 'vacio' }, [
      el('div', { class: 'vacio__emoji', text: '🤖' }),
      el('h2', { text: 'Aún no hay IA configurada' }),
      el('p', { text: 'El tutor necesita un modelo local: Ollama en el ordenador o una app como LM Pocket en el iPhone. Se configura en un minuto.' }),
      el('a', { class: 'boton boton--principal', href: '#/ajustes', text: 'Configurar ahora' }),
    ]));
    return;
  }

  const historial = el('div', { class: 'chat' });
  const estado = obtener();

  if (!estado.chat.length) {
    pintarMensaje(historial, 'assistant',
      'Привет! Soy tu profe de ruso. Pregúntame lo que quieras: gramática, cómo se dice algo, o pídeme que te corrija una frase. Puedes escribirme en español.');
  } else {
    for (const m of estado.chat) pintarMensaje(historial, m.role, m.content);
  }
  raiz.appendChild(historial);

  const chips = el('div', { class: 'sugerencias' });
  for (const s of SUGERENCIAS) {
    chips.appendChild(el('button', { class: 'chip', text: s, onclick: () => { entrada.value = s; enviar(); } }));
  }
  raiz.appendChild(chips);

  const entrada = el('textarea', {
    class: 'entrada entrada--chat', rows: '2',
    placeholder: 'Escribe tu pregunta…',
  });
  const botonEnviar = el('button', { class: 'boton boton--principal', text: 'Enviar', onclick: () => enviar() });
  const botonLimpiar = el('button', {
    class: 'boton boton--sutil', text: 'Borrar conversación',
    onclick: () => {
      actualizar((e) => { e.chat = []; });
      historial.innerHTML = '';
      pintarMensaje(historial, 'assistant', 'Conversación borrada. ¿Por dónde seguimos?');
    },
  });

  entrada.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); enviar(); }
  });

  raiz.appendChild(el('div', { class: 'compositor' }, [entrada, botonEnviar]));
  raiz.appendChild(el('div', { class: 'compositor__extra' }, [botonLimpiar]));

  let enCurso = false;
  async function enviar() {
    const texto = entrada.value.trim();
    if (!texto || enCurso) return;
    enCurso = true;
    entrada.value = '';
    botonEnviar.disabled = true;

    pintarMensaje(historial, 'user', texto);
    actualizar((e) => {
      e.chat.push({ role: 'user', content: texto });
      if (e.chat.length > 30) e.chat.splice(0, e.chat.length - 30);
    });

    const burbuja = pintarMensaje(historial, 'assistant', '');
    const cuerpo = burbuja.querySelector('.mensaje__texto');
    cuerpo.classList.add('escribiendo');
    cuerpo.textContent = '…';

    try {
      let respuesta = '';
      const mensajes = [
        { role: 'system', content: IA.sistemaTutor() },
        ...obtener().chat.slice(-12),
      ];
      await IA.chat(mensajes, {
        onToken: (t) => {
          respuesta += t;
          cuerpo.classList.remove('escribiendo');
          cuerpo.innerHTML = textoRico(respuesta);
          historial.scrollTop = historial.scrollHeight;
        },
      });
      actualizar((e) => { e.chat.push({ role: 'assistant', content: respuesta }); });
      añadirAudio(burbuja, respuesta);
    } catch (e) {
      cuerpo.classList.remove('escribiendo');
      cuerpo.textContent = `No pude hablar con el modelo: ${e.message}`;
      burbuja.classList.add('mensaje--error');
      aviso('Revisa la configuración de la IA en Ajustes.', 'error');
    } finally {
      enCurso = false;
      botonEnviar.disabled = false;
      historial.scrollTop = historial.scrollHeight;
    }
  }
}

function pintarMensaje(contenedor, rol, texto) {
  const burbuja = el('div', { class: `mensaje mensaje--${rol === 'user' ? 'yo' : 'ia'}` }, [
    el('div', { class: 'mensaje__texto', html: textoRico(texto) }),
  ]);
  contenedor.appendChild(burbuja);
  if (rol !== 'user' && texto) añadirAudio(burbuja, texto);
  contenedor.scrollTop = contenedor.scrollHeight;
  return burbuja;
}

// Si la respuesta contiene cirílico, ofrece escucharlo.
function añadirAudio(burbuja, texto) {
  if (burbuja.querySelector('.boton--audio')) return;
  const cirilico = texto.match(/[Ѐ-ӿ][Ѐ-ӿ\s,.'!?-]{2,}/g);
  if (!cirilico) return;
  burbuja.appendChild(el('button', {
    class: 'boton boton--audio', text: '🔊 Escuchar en ruso',
    onclick: () => hablar(cirilico.join('. ')),
  }));
}
