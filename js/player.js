// Reproductor de ejercicios: lo usan tanto las lecciones como el repaso diario.
// Si fallas una pregunta, vuelve a aparecer al final de la tanda (como en Duolingo).

import { el, mezclar, igualRuso, tecladoCirilico, aviso, vibrar, textoRico } from './ui.js';
import { hablar, hayVozRusa } from './tts.js';
import { registrarRespuesta, CALIDAD } from './srs.js';
import { registrarActividad, obtener } from './store.js';
import { hayReconocimiento, escuchar, puntuar } from './speech.js';
import * as IA from './ai.js';

export function reproductor(contenedor, ejercicios, { alTerminar } = {}) {
  if (!ejercicios.length) {
    contenedor.appendChild(el('p', { class: 'vacio', text: 'No hay nada que practicar aquí ahora mismo.' }));
    return;
  }

  const cola = [...ejercicios];
  const total = cola.length;
  let aciertos = 0;
  let fallos = 0;
  let xp = 0;
  const yaFallados = new Set();
  const reintentos = new Map();   // cuántas veces ha vuelto cada ejercicio
  const MAX_REINTENTOS = 2;       // para no quedarte atrapado en una palabra imposible

  const barra = el('div', { class: 'barra' }, [el('div', { class: 'barra__relleno' })]);
  const marcador = el('div', { class: 'marcador' });
  const zona = el('div', { class: 'zona-ejercicio' });
  const pie = el('div', { class: 'pie-ejercicio' });

  contenedor.appendChild(el('div', { class: 'cabecera-practica' }, [
    el('button', {
      class: 'boton boton--icono', title: 'Salir', text: '✕',
      onclick: () => { location.hash = '#/inicio'; },
    }),
    barra,
    marcador,
  ]));
  contenedor.appendChild(zona);
  contenedor.appendChild(pie);

  function actualizarBarra() {
    // Avanza solo con los aciertos: una pregunta fallada vuelve a la cola,
    // así la barra nunca retrocede y refleja lo que de verdad llevas hecho.
    const pct = Math.round((aciertos / total) * 100);
    barra.querySelector('.barra__relleno').style.width = `${Math.min(pct, 100)}%`;
    marcador.textContent = `${aciertos} ✓`;
  }

  function siguiente() {
    zona.innerHTML = '';
    pie.innerHTML = '';
    if (!cola.length) return terminar();
    const ej = cola.shift();
    actualizarBarra();
    render(ej);
  }

  function terminar() {
    const precision = aciertos + fallos ? Math.round((aciertos / (aciertos + fallos)) * 100) : 100;
    registrarActividad(xp);
    barra.querySelector('.barra__relleno').style.width = '100%';
    zona.appendChild(el('div', { class: 'resultado' }, [
      el('div', { class: 'resultado__emoji', text: precision >= 80 ? '🎉' : precision >= 50 ? '💪' : '🌱' }),
      el('h2', { text: precision >= 80 ? '¡Muy bien!' : '¡Sigue así!' }),
      el('p', { class: 'resultado__cifras', text: `${aciertos} aciertos · ${fallos} fallos · ${precision}% de acierto` }),
      el('p', { class: 'resultado__xp', text: `+${xp} XP` }),
      el('div', { class: 'resultado__acciones' }, [
        el('button', { class: 'boton boton--principal', text: 'Continuar', onclick: () => { location.hash = '#/inicio'; } }),
      ]),
    ]));
    if (alTerminar) alTerminar({ aciertos, fallos, precision, xp });
  }

  function calificar(ej, correcto) {
    if (correcto) {
      aciertos += 1;
      xp += yaFallados.has(ej.idTarjeta) ? 5 : 10;
      if (ej.idTarjeta && !ej.idTarjeta.includes(':ia:')) {
        registrarRespuesta(ej.idTarjeta, yaFallados.has(ej.idTarjeta) ? CALIDAD.DIFICIL : CALIDAD.BIEN);
      }
    } else {
      fallos += 1;
      vibrar(60);
      if (ej.idTarjeta) yaFallados.add(ej.idTarjeta);
      if (ej.idTarjeta && !ej.idTarjeta.includes(':ia:')) registrarRespuesta(ej.idTarjeta, CALIDAD.OTRA_VEZ);
      const vueltas = (reintentos.get(ej) || 0) + 1;
      reintentos.set(ej, vueltas);
      // Vuelve a preguntarse más adelante, pero no eternamente: si se te resiste
      // mucho, seguimos y la repetición espaciada te la traerá otro día.
      if (vueltas <= MAX_REINTENTOS) cola.push(ej);
    }
  }

  function retro(ej, correcto, textoCorrecto) {
    const ajustes = obtener().ajustes;
    const caja = el('div', { class: `retro retro--${correcto ? 'bien' : 'mal'}` }, [
      el('div', { class: 'retro__titulo', text: correcto ? '¡Correcto!' : 'Casi…' }),
      textoCorrecto ? el('div', { class: 'retro__respuesta', html: textoRico(textoCorrecto) }) : null,
      ej.palabra && ajustes.transliteracion ? el('div', { class: 'retro__tr', text: `pronunciación: ${ej.palabra.tr}` }) : null,
      ej.palabra && ej.palabra.nota ? el('div', { class: 'retro__nota', text: ej.palabra.nota }) : null,
      ej.frase ? el('div', { class: 'retro__tr', text: ej.frase.tr }) : null,
      ej.pista ? el('div', { class: 'retro__nota', text: ej.pista }) : null,
    ]);
    pie.innerHTML = '';
    pie.appendChild(caja);
    const botonSeguir = el('button', {
      class: 'boton boton--principal boton--ancho', text: 'Continuar', onclick: siguiente,
    });
    pie.appendChild(botonSeguir);
    botonSeguir.focus();
    const ru = ej.audio || ej.respuesta || (ej.palabra && ej.palabra.ru);
    if (ru && correcto) hablar(ru);
  }

  function botonAudio(texto) {
    if (!texto) return null;
    return el('button', {
      class: 'boton boton--audio', title: 'Escuchar', text: '🔊',
      onclick: () => {
        if (!hayVozRusa()) aviso('No hay voz rusa instalada en este dispositivo (mira Ajustes).', 'aviso');
        hablar(texto);
      },
    });
  }

  function render(ej) {
    if (ej.tipo === 'escribir') return renderEscribir(ej);
    if (ej.tipo === 'ordenar') return renderOrdenar(ej);
    if (ej.tipo === 'hablar') return renderHablar(ej);
    if (ej.tipo === 'traducir') return renderTraducir(ej);
    return renderOpciones(ej);
  }

  function renderOpciones(ej) {
    zona.appendChild(el('p', { class: 'enunciado', text: ej.enunciado }));
    zona.appendChild(el('div', { class: 'muestra' }, [
      el('span', { class: ej.tipo === 'audio' ? 'muestra__icono' : 'muestra__texto', text: ej.muestra }),
      botonAudio(ej.audio),
    ]));
    if (ej.autoAudio) hablar(ej.audio);

    const grid = el('div', { class: 'opciones' });
    ej.opciones.forEach((op, i) => {
      const b = el('button', { class: 'opcion', text: op });
      b.addEventListener('click', () => {
        if (grid.classList.contains('opciones--bloqueadas')) return;
        grid.classList.add('opciones--bloqueadas');
        const correcto = i === ej.correcta;
        b.classList.add(correcto ? 'opcion--bien' : 'opcion--mal');
        if (!correcto) grid.children[ej.correcta]?.classList.add('opcion--bien');
        calificar(ej, correcto);
        retro(ej, correcto, correcto ? null : `Respuesta: ${ej.opciones[ej.correcta]}`);
      });
      grid.appendChild(b);
    });
    zona.appendChild(grid);
  }

  function renderEscribir(ej) {
    zona.appendChild(el('p', { class: 'enunciado', text: ej.enunciado }));
    zona.appendChild(el('div', { class: 'muestra' }, [
      el('span', { class: 'muestra__texto', text: ej.muestra }),
    ]));
    const entrada = el('input', {
      class: 'entrada', type: 'text', autocomplete: 'off', autocorrect: 'off',
      spellcheck: 'false', placeholder: 'escribe aquí en ruso…', lang: 'ru',
    });
    zona.appendChild(entrada);
    zona.appendChild(tecladoCirilico(entrada));

    const comprobar = () => {
      if (!entrada.value.trim()) return;
      const correcto = igualRuso(entrada.value, ej.respuesta);
      entrada.classList.add(correcto ? 'entrada--bien' : 'entrada--mal');
      entrada.disabled = true;
      calificar(ej, correcto);
      retro(ej, correcto, `Respuesta: **${ej.respuesta}**`);
    };
    entrada.addEventListener('keydown', (e) => { if (e.key === 'Enter') comprobar(); });
    pie.appendChild(el('button', { class: 'boton boton--principal boton--ancho', text: 'Comprobar', onclick: comprobar }));
    setTimeout(() => entrada.focus(), 50);
  }

  function renderOrdenar(ej) {
    zona.appendChild(el('p', { class: 'enunciado', text: ej.enunciado }));
    zona.appendChild(el('div', { class: 'muestra' }, [
      el('span', { class: 'muestra__texto', text: ej.muestra }),
      botonAudio(ej.audio),
    ]));

    const elegidas = [];
    const zonaRespuesta = el('div', { class: 'fichas fichas--respuesta' });
    const zonaFichas = el('div', { class: 'fichas' });

    function pintar() {
      zonaRespuesta.innerHTML = '';
      elegidas.forEach((palabra, i) => {
        zonaRespuesta.appendChild(el('button', {
          class: 'ficha ficha--puesta', text: palabra,
          onclick: () => { disponibles.push(elegidas.splice(i, 1)[0]); pintar(); },
        }));
      });
      zonaFichas.innerHTML = '';
      disponibles.forEach((palabra, i) => {
        zonaFichas.appendChild(el('button', {
          class: 'ficha', text: palabra,
          onclick: () => { elegidas.push(disponibles.splice(i, 1)[0]); pintar(); },
        }));
      });
    }
    const disponibles = mezclar(ej.fichas);
    zona.appendChild(zonaRespuesta);
    zona.appendChild(zonaFichas);
    pintar();

    pie.appendChild(el('button', {
      class: 'boton boton--principal boton--ancho', text: 'Comprobar',
      onclick: () => {
        if (!elegidas.length) return;
        const correcto = igualRuso(elegidas.join(' '), ej.respuesta);
        calificar(ej, correcto);
        retro(ej, correcto, `Respuesta: **${ej.respuesta}**`);
      },
    }));
  }

  // --- Pronunciación: te escucha y te puntúa -------------------------------
  function renderHablar(ej) {
    zona.appendChild(el('p', { class: 'enunciado', text: ej.enunciado }));
    zona.appendChild(el('div', { class: 'muestra' }, [
      el('span', { class: 'muestra__texto muestra__texto--frase', text: ej.muestra }),
      botonAudio(ej.audio),
    ]));
    if (ej.frase) {
      zona.appendChild(el('p', { class: 'muestra__ayuda', text: ej.frase.tr }));
      zona.appendChild(el('p', { class: 'muestra__ayuda muestra__ayuda--es', text: ej.frase.es }));
    }

    if (!hayReconocimiento()) {
      // Sin reconocimiento de voz: escuchas el modelo y te autoevalúas.
      zona.appendChild(el('p', { class: 'pista', text: 'Este navegador no puede escucharte. Escucha el audio, repítelo en voz alta y valora tú mismo qué tal ha ido (en Chrome, Edge o Safari sí funciona el micrófono).' }));
      pie.appendChild(el('div', { class: 'fila-botones fila-botones--ancha' }, [
        el('button', { class: 'boton boton--principal', text: 'Lo he dicho bien', onclick: () => { calificar(ej, true); retro(ej, true, ej.respuesta); } }),
        el('button', { class: 'boton', text: 'Me ha costado', onclick: () => { calificar(ej, false); retro(ej, false, ej.respuesta); } }),
      ]));
      return;
    }

    const estadoMicro = el('div', { class: 'micro__estado', text: 'Pulsa el micrófono y lee la frase' });
    const botonMicro = el('button', { class: 'micro', text: '🎤', title: 'Hablar' });
    zona.appendChild(el('div', { class: 'micro__caja' }, [botonMicro, estadoMicro]));

    botonMicro.addEventListener('click', async () => {
      if (botonMicro.classList.contains('micro--escuchando')) return;
      botonMicro.classList.add('micro--escuchando');
      estadoMicro.textContent = 'Escuchando… habla ahora';
      try {
        const { texto, alternativas } = await escuchar();
        // Nos quedamos con la alternativa que más se parezca a la frase objetivo.
        const nota = Math.max(...alternativas.map((a) => puntuar(a, ej.respuesta)));
        const correcto = nota >= 70;
        estadoMicro.textContent = `He oído: «${texto}»`;
        calificar(ej, correcto);
        retro(ej, correcto, `${correcto ? 'Puntuación' : 'Te ha faltado'}: ${nota}/100 · Frase: **${ej.respuesta}**`);
      } catch (e) {
        estadoMicro.textContent = e.message;
        botonMicro.classList.remove('micro--escuchando');
      }
    });

    pie.appendChild(el('button', {
      class: 'boton boton--sutil', text: 'Saltar esta',
      onclick: () => { calificar(ej, false); retro(ej, false, ej.respuesta); },
    }));
  }

  // --- Traducción libre: la corrige la IA si está activada -----------------
  function renderTraducir(ej) {
    zona.appendChild(el('p', { class: 'enunciado', text: ej.enunciado }));
    zona.appendChild(el('div', { class: 'muestra' }, [
      el('span', { class: 'muestra__texto muestra__texto--frase', text: ej.muestra }),
    ]));
    const entrada = el('input', {
      class: 'entrada', type: 'text', autocomplete: 'off', autocorrect: 'off',
      spellcheck: 'false', placeholder: 'escribe la frase en ruso…', lang: 'ru',
    });
    zona.appendChild(entrada);
    zona.appendChild(tecladoCirilico(entrada));

    const comprobar = async () => {
      const respuesta = entrada.value.trim();
      if (!respuesta) return;
      entrada.disabled = true;
      boton.disabled = true;

      // 1) Comparación literal (rápida y sin IA).
      if (igualRuso(respuesta, ej.respuesta)) {
        entrada.classList.add('entrada--bien');
        calificar(ej, true);
        return retro(ej, true, `**${ej.respuesta}**`);
      }

      // 2) Si hay IA local, que juzgue si tu versión también vale.
      if (IA.configurada()) {
        boton.textContent = 'Corrigiendo…';
        try {
          const juicio = await IA.chatJSON(IA.promptCorreccion(ej.muestra, respuesta, ej.respuesta));
          const correcto = Boolean(juicio.correcto);
          entrada.classList.add(correcto ? 'entrada--bien' : 'entrada--mal');
          calificar(ej, correcto);
          return retro(ej, correcto,
            `${juicio.explicacion || ''}\n\nVersión del curso: **${ej.respuesta}**` +
            (juicio.correccion && !correcto ? `\nCorrección: ${juicio.correccion}` : ''));
        } catch (e) {
          // Si la IA falla, seguimos con la corrección literal.
        }
      }

      entrada.classList.add('entrada--mal');
      calificar(ej, false);
      retro(ej, false, `Respuesta: **${ej.respuesta}**` + (IA.configurada() ? '' : '\n\nCon una IA local activada, aquí te diría si tu versión también es válida.'));
    };

    entrada.addEventListener('keydown', (e) => { if (e.key === 'Enter') comprobar(); });
    const boton = el('button', { class: 'boton boton--principal boton--ancho', text: 'Comprobar', onclick: comprobar });
    pie.appendChild(boton);
    setTimeout(() => entrada.focus(), 50);
  }

  siguiente();
}
