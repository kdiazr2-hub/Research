import { el, textoRico, aviso } from '../ui.js';
import { obtener, registrarActividad } from '../store.js';
import { hablar } from '../tts.js';
import { hayReconocimiento, escuchar } from '../speech.js';
import * as IA from '../ai.js';

// Conversación libre con el modelo local haciendo de camarero, taxista, médico…
// Habla solo en ruso; al terminar, te corrige en español.

export function vistaConversar(raiz, situacionId) {
  raiz.appendChild(el('header', { class: 'cabecera-vista' }, [
    el('h1', { text: '🎙️ Conversación' }),
    el('p', { text: 'Habla en ruso con tu modelo local. Él no sale del ruso: al final te corrige en español todo lo que hayas dicho.' }),
  ]));

  if (!IA.configurada()) {
    raiz.appendChild(el('div', { class: 'vacio' }, [
      el('div', { class: 'vacio__emoji', text: '🤖' }),
      el('h2', { text: 'Necesitas una IA local' }),
      el('p', { text: 'Este modo conversa contigo en tiempo real, así que hace falta un modelo (Ollama en el PC o una app en el iPhone). Se configura en un minuto.' }),
      el('a', { class: 'boton boton--principal', href: '#/ajustes', text: 'Configurar' }),
    ]));
    return;
  }

  const situacion = IA.SITUACIONES.find((s) => s.id === situacionId);
  if (!situacion) return elegirSituacion(raiz);
  conversacion(raiz, situacion);
}

function elegirSituacion(raiz) {
  const nivel = obtener().ajustes.nivel || 'A1';
  const orden = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1'];
  raiz.appendChild(el('p', { class: 'pista', text: `Tu nivel es ${nivel}: las situaciones marcadas por encima te exigirán más de la cuenta, pero puedes probarlas igual.` }));

  const grid = el('div', { class: 'situaciones' });
  for (const s of IA.SITUACIONES) {
    const dura = orden.indexOf(s.nivel) > orden.indexOf(nivel);
    grid.appendChild(el('a', { class: 'situacion', href: `#/conversar/${s.id}` }, [
      el('span', { class: 'situacion__emoji', text: s.emoji }),
      el('span', { class: 'situacion__titulo', text: s.titulo }),
      el('span', { class: `etiqueta ${dura ? 'etiqueta--aviso' : ''}`, text: s.nivel }),
    ]));
  }
  raiz.appendChild(grid);
}

function conversacion(raiz, situacion) {
  const mensajes = [IA.promptRolePlay(situacion)];
  const misFrases = [];
  let ocupado = false;

  raiz.appendChild(el('div', { class: 'unidad__cabecera' }, [
    el('a', { class: 'volver', href: '#/conversar', text: '← Cambiar situación' }),
    el('span', { class: 'etiqueta', text: `${situacion.emoji} ${situacion.titulo}` }),
  ]));

  const chat = el('div', { class: 'chat' });
  raiz.appendChild(chat);

  const entrada = el('input', {
    class: 'entrada', type: 'text', lang: 'ru', autocomplete: 'off', spellcheck: 'false',
    placeholder: 'Responde en ruso…',
  });
  const botonEnviar = el('button', { class: 'boton boton--principal', text: 'Enviar' });
  const botonMicro = el('button', { class: 'boton boton--micro', text: '🎤', title: 'Hablar en vez de escribir' });

  const compositor = el('div', { class: 'compositor' }, [
    hayReconocimiento() ? botonMicro : null,
    entrada,
    botonEnviar,
  ]);
  raiz.appendChild(compositor);

  const botonTerminar = el('button', {
    class: 'boton boton--sutil', text: 'Terminar y que me corrija',
    onclick: () => terminar(),
  });
  raiz.appendChild(el('div', { class: 'compositor__extra' }, [botonTerminar]));

  entrada.addEventListener('keydown', (e) => { if (e.key === 'Enter') enviar(); });
  botonEnviar.addEventListener('click', () => enviar());

  botonMicro.addEventListener('click', async () => {
    if (ocupado) return;
    botonMicro.classList.add('boton--micro-activo');
    botonMicro.textContent = '●';
    try {
      const { texto } = await escuchar();
      entrada.value = texto;
      enviar();
    } catch (e) {
      aviso(e.message, 'aviso');
    } finally {
      botonMicro.classList.remove('boton--micro-activo');
      botonMicro.textContent = '🎤';
    }
  });

  // El modelo abre la conversación.
  responder();

  async function enviar() {
    const texto = entrada.value.trim();
    if (!texto || ocupado) return;
    entrada.value = '';
    misFrases.push(texto);
    mensajes.push({ role: 'user', content: texto });
    pintar('yo', texto);
    await responder();
  }

  async function responder() {
    ocupado = true;
    botonEnviar.disabled = true;
    const burbuja = pintar('ia', '');
    const cuerpo = burbuja.querySelector('.mensaje__texto');
    cuerpo.textContent = '…';
    try {
      let respuesta = '';
      await IA.chat(mensajes, {
        onToken: (t) => {
          respuesta += t;
          cuerpo.textContent = respuesta;
          chat.scrollTop = chat.scrollHeight;
        },
      });
      mensajes.push({ role: 'assistant', content: respuesta });
      herramientasDeLinea(burbuja, respuesta);
      hablar(respuesta);
    } catch (e) {
      cuerpo.textContent = `No pude hablar con el modelo: ${e.message}`;
      burbuja.classList.add('mensaje--error');
    } finally {
      ocupado = false;
      botonEnviar.disabled = false;
      chat.scrollTop = chat.scrollHeight;
      entrada.focus();
    }
  }

  function pintar(quien, texto) {
    const burbuja = el('div', { class: `mensaje mensaje--${quien}` }, [
      el('div', { class: 'mensaje__texto', text: texto }),
    ]);
    chat.appendChild(burbuja);
    chat.scrollTop = chat.scrollHeight;
    return burbuja;
  }

  // Cada frase del modelo lleva "escuchar" y "¿qué ha dicho?".
  function herramientasDeLinea(burbuja, texto) {
    const fila = el('div', { class: 'mensaje__acciones' }, [
      el('button', { class: 'boton boton--audio', text: '🔊', onclick: () => hablar(texto) }),
      el('button', {
        class: 'boton boton--audio', text: '¿Qué ha dicho?',
        onclick: async (ev) => {
          const boton = ev.currentTarget;
          boton.disabled = true;
          const traduccion = el('div', { class: 'mensaje__traduccion', text: 'Traduciendo…' });
          burbuja.appendChild(traduccion);
          try {
            const t = await IA.chat(IA.promptTraducirLinea(texto), { temperatura: 0.2 });
            traduccion.textContent = t.trim();
          } catch (e) {
            traduccion.textContent = 'No pude traducirlo.';
          }
          boton.remove();
        },
      }),
    ]);
    burbuja.appendChild(fila);
  }

  async function terminar() {
    if (!misFrases.length) {
      aviso('Di algo primero: sin frases tuyas no hay nada que corregir.', 'aviso');
      return;
    }
    botonTerminar.disabled = true;
    compositor.classList.add('oculto');
    const caja = el('div', { class: 'caja-ia' }, [
      el('h3', { text: '📝 Cómo lo has hecho' }),
      el('div', { class: 'salida-ia', text: 'Revisando tus frases…' }),
    ]);
    raiz.appendChild(caja);
    const salida = caja.querySelector('.salida-ia');
    caja.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      let texto = '';
      await IA.chat(IA.promptFeedbackConversacion(misFrases, situacion.titulo), {
        onToken: (t) => { texto += t; salida.innerHTML = textoRico(texto); },
      });
      registrarActividad(15 + misFrases.length * 5);
    } catch (e) {
      salida.textContent = `No pude generar la corrección: ${e.message}`;
      salida.classList.add('salida-ia--error');
    }
    caja.appendChild(el('div', { class: 'fila-botones' }, [
      el('a', { class: 'boton boton--principal', href: '#/conversar', text: 'Otra conversación' }),
      el('a', { class: 'boton', href: '#/inicio', text: 'Volver al inicio' }),
    ]));
  }
}
