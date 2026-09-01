import { el, textoRico } from '../ui.js';
import { DIALOGOS, dialogoPorId } from '../../data/dialogos.js';
import { obtener, actualizar, registrarActividad } from '../store.js';
import { hablar, hablarEsperando, callar } from '../tts.js';
import { hayReconocimiento, escuchar, puntuar } from '../speech.js';
import { NIVELES } from '../../data/lessons.js';

export function vistaDialogos(raiz) {
  raiz.appendChild(el('header', { class: 'cabecera-vista' }, [
    el('h1', { text: '🎭 Diálogos' }),
    el('p', { text: 'Conversaciones enteras, de lo más simple a un debate. Escúchalas, repítelas y luego actúa tú uno de los dos papeles: es el paso que separa entender de hablar.' }),
  ]));

  for (const nivel of NIVELES) {
    const delNivel = DIALOGOS.filter((d) => d.nivel === nivel.id);
    if (!delNivel.length) continue;
    raiz.appendChild(el('h2', { class: 'seccion-titulo', text: `${nivel.emoji} ${nivel.id} · ${nivel.nombre}` }));
    const lista = el('div', { class: 'unidades' });
    for (const d of delNivel) {
      const hecho = obtener().dialogos?.[d.id];
      lista.appendChild(el('a', { class: 'unidad', href: `#/dialogo/${d.id}` }, [
        el('div', { class: 'unidad__emoji', text: d.emoji }),
        el('div', { class: 'unidad__cuerpo' }, [
          el('div', { class: 'unidad__cabecera' }, [
            el('span', { class: 'unidad__num', text: `${d.lineas.length} líneas` }),
            hecho?.actuado ? el('span', { class: 'etiqueta etiqueta--ok', text: '✓ actuado' }) : null,
          ]),
          el('h3', { text: d.titulo }),
          el('p', { class: 'unidad__desc', text: d.situacion }),
        ]),
      ]));
    }
    raiz.appendChild(lista);
  }
}

export function vistaDialogo(raiz, id) {
  const d = dialogoPorId(id);
  if (!d) {
    raiz.appendChild(el('p', { class: 'vacio', text: 'Ese diálogo no existe.' }));
    return;
  }
  const ajustes = obtener().ajustes;
  let verTraduccion = true;
  let verTranscripcion = ajustes.transliteracion;

  raiz.appendChild(el('header', { class: 'cabecera-vista' }, [
    el('a', { class: 'volver', href: '#/dialogos', text: '← Diálogos' }),
    el('h1', { text: `${d.emoji} ${d.titulo}` }),
    el('p', { text: d.situacion }),
    el('div', { class: 'unidad__cabecera' }, [
      el('span', { class: 'etiqueta', text: d.nivel }),
      el('span', { class: 'etiqueta', text: `${d.personajes[0]} y ${d.personajes[1]}` }),
    ]),
  ]));

  // --- Controles ----------------------------------------------------------
  const botonLeer = el('button', { class: 'boton boton--principal', text: '▶ Escuchar entero' });
  const controles = el('div', { class: 'acciones-unidad' }, [
    botonLeer,
    el('button', {
      class: 'boton', text: '🎬 Actuar mi papel',
      onclick: () => { location.hash = `#/actuar/${d.id}`; },
    }),
  ]);
  raiz.appendChild(controles);

  const alternar = el('div', { class: 'leyenda' }, [
    botonAlternar('Traducción', () => verTraduccion, (v) => { verTraduccion = v; pintar(); }),
    botonAlternar('Pronunciación', () => verTranscripcion, (v) => { verTranscripcion = v; pintar(); }),
  ]);
  raiz.appendChild(alternar);

  const zona = el('div', { class: 'dialogo' });
  raiz.appendChild(zona);

  function pintar() {
    zona.innerHTML = '';
    d.lineas.forEach((l, i) => {
      const mio = l.quien === 1;
      zona.appendChild(el('div', { class: `replica replica--${mio ? 'yo' : 'otro'}`, dataset: { linea: String(i) } }, [
        el('div', { class: 'replica__quien', text: d.personajes[l.quien] }),
        el('div', { class: 'replica__burbuja' }, [
          el('div', { class: 'replica__ru' }, [
            el('span', { text: l.ru }),
            el('button', { class: 'boton boton--audio', text: '🔊', onclick: () => hablar(l.ru) }),
          ]),
          verTranscripcion ? el('div', { class: 'replica__tr', text: l.tr }) : null,
          verTraduccion ? el('div', { class: 'replica__es', text: l.es }) : null,
        ]),
      ]));
    });
  }
  pintar();

  // Lectura secuencial, resaltando la línea que suena.
  let leyendo = false;
  botonLeer.addEventListener('click', async () => {
    if (leyendo) {
      leyendo = false;
      callar();
      botonLeer.textContent = '▶ Escuchar entero';
      return;
    }
    leyendo = true;
    botonLeer.textContent = '⏹ Parar';
    for (let i = 0; i < d.lineas.length && leyendo; i++) {
      const nodo = zona.querySelector(`[data-linea="${i}"]`);
      zona.querySelectorAll('.replica--sonando').forEach((n) => n.classList.remove('replica--sonando'));
      nodo?.classList.add('replica--sonando');
      nodo?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await hablarEsperando(d.lineas[i].ru);
      await pausa(350);
    }
    zona.querySelectorAll('.replica--sonando').forEach((n) => n.classList.remove('replica--sonando'));
    leyendo = false;
    botonLeer.textContent = '▶ Escuchar entero';
  });

  // --- Notas ---------------------------------------------------------------
  if (d.notas?.length) {
    raiz.appendChild(el('h2', { class: 'seccion-titulo', text: 'Fíjate en esto' }));
    for (const n of d.notas) {
      raiz.appendChild(el('div', { class: 'nota' }, [el('p', { html: textoRico(n) })]));
    }
  }
}

// ---------------------------------------------------------------------------
// Modo actuar: la app hace un papel y tú el otro, en voz alta.
// ---------------------------------------------------------------------------

export function vistaActuar(raiz, id) {
  const d = dialogoPorId(id);
  if (!d) {
    raiz.appendChild(el('p', { class: 'vacio', text: 'Ese diálogo no existe.' }));
    return;
  }

  let miPapel = 1;
  const cabecera = el('div', { class: 'cabecera-practica' }, [
    el('button', { class: 'boton boton--icono', text: '✕', title: 'Salir', onclick: () => { callar(); location.hash = `#/dialogo/${d.id}`; } }),
    el('div', { class: 'barra' }, [el('div', { class: 'barra__relleno' })]),
    el('div', { class: 'marcador', text: '0 ✓' }),
  ]);
  raiz.appendChild(cabecera);
  const zona = el('div', { class: 'zona-ejercicio' });
  const pie = el('div', { class: 'pie-ejercicio' });
  raiz.appendChild(zona);
  raiz.appendChild(pie);

  elegirPapel();

  function elegirPapel() {
    zona.innerHTML = '';
    pie.innerHTML = '';
    zona.appendChild(el('div', { class: 'eleccion' }, [
      el('h2', { text: '¿Qué papel haces?' }),
      el('p', { class: 'pista', text: 'La app dirá las líneas del otro personaje y esperará a que digas las tuyas en voz alta.' }),
      el('div', { class: 'fila-botones--ancha' }, d.personajes.map((nombre, i) =>
        el('button', {
          class: `boton ${i === 1 ? 'boton--principal' : ''}`, text: nombre,
          onclick: () => { miPapel = i; empezar(); },
        })
      )),
      !hayReconocimiento()
        ? el('p', { class: 'pista', text: 'Este navegador no puede escucharte, así que en tus líneas te mostraremos el texto para que lo digas y sigas tú. En Chrome, Edge o Safari sí te puntuaría.' })
        : null,
    ]));
  }

  async function empezar() {
    let indice = 0;
    let aciertos = 0;
    let notaTotal = 0;
    let mias = 0;

    const barra = cabecera.querySelector('.barra__relleno');
    const marcador = cabecera.querySelector('.marcador');

    while (indice < d.lineas.length) {
      const linea = d.lineas[indice];
      barra.style.width = `${Math.round((indice / d.lineas.length) * 100)}%`;
      marcador.textContent = `${aciertos} ✓`;

      if (linea.quien !== miPapel) {
        await turnoDeLaApp(linea);
      } else {
        mias += 1;
        const nota = await miTurno(linea);
        notaTotal += nota;
        if (nota >= 70) aciertos += 1;
      }
      indice += 1;
    }

    barra.style.width = '100%';
    const media = mias ? Math.round(notaTotal / mias) : 0;
    registrarActividad(10 + aciertos * 5);
    actualizar((e) => {
      e.dialogos = e.dialogos || {};
      e.dialogos[d.id] = { actuado: true, mejorNota: Math.max(media, e.dialogos[d.id]?.mejorNota || 0) };
    });

    zona.innerHTML = '';
    pie.innerHTML = '';
    zona.appendChild(el('div', { class: 'resultado' }, [
      el('div', { class: 'resultado__emoji', text: media >= 80 ? '🎉' : media >= 50 ? '💪' : '🌱' }),
      el('h2', { text: media >= 80 ? '¡Has sonado muy bien!' : 'Sigue practicando' }),
      el('p', { class: 'resultado__cifras', text: mias ? `${aciertos} de ${mias} líneas bien · nota media ${media}/100` : 'Diálogo completado' }),
      el('div', { class: 'resultado__acciones fila-botones--ancha' }, [
        el('button', { class: 'boton', text: 'Otra vez', onclick: () => elegirPapel() }),
        el('a', { class: 'boton boton--principal', href: '#/dialogos', text: 'Otro diálogo' }),
      ]),
    ]));
  }

  function turnoDeLaApp(linea) {
    zona.innerHTML = '';
    pie.innerHTML = '';
    zona.appendChild(el('div', { class: 'actuar' }, [
      el('p', { class: 'enunciado', text: `${d.personajes[linea.quien]} dice:` }),
      el('div', { class: 'muestra' }, [el('span', { class: 'muestra__texto muestra__texto--frase', text: linea.ru })]),
      el('p', { class: 'muestra__ayuda', text: linea.tr }),
      el('p', { class: 'muestra__ayuda muestra__ayuda--es', text: linea.es }),
    ]));
    return new Promise((resolve) => {
      const seguir = () => { callar(); resolve(); };
      pie.appendChild(el('button', { class: 'boton boton--sutil boton--ancho', text: 'Saltar →', onclick: seguir }));
      hablarEsperando(linea.ru).then(() => pausa(500)).then(resolve);
    });
  }

  function miTurno(linea) {
    zona.innerHTML = '';
    pie.innerHTML = '';
    zona.appendChild(el('div', { class: 'actuar' }, [
      el('p', { class: 'enunciado', text: 'Te toca. Di en ruso:' }),
      el('div', { class: 'muestra' }, [el('span', { class: 'muestra__texto muestra__texto--frase', text: linea.es })]),
    ]));

    // Pista: se muestra solo si la pides, para que primero lo intentes tú.
    const pista = el('div', { class: 'pista-oculta' });
    const verPista = el('button', {
      class: 'boton boton--sutil', text: '¿Cómo se decía?',
      onclick: () => {
        pista.innerHTML = '';
        pista.appendChild(el('div', { class: 'replica__ru', text: linea.ru }));
        pista.appendChild(el('div', { class: 'replica__tr', text: linea.tr }));
        verPista.remove();
      },
    });
    zona.appendChild(verPista);
    zona.appendChild(pista);

    if (!hayReconocimiento()) {
      return new Promise((resolve) => {
        pista.innerHTML = '';
        pista.appendChild(el('div', { class: 'replica__ru', text: linea.ru }));
        pista.appendChild(el('div', { class: 'replica__tr', text: linea.tr }));
        verPista.remove();
        pie.appendChild(el('div', { class: 'fila-botones--ancha' }, [
          el('button', { class: 'boton boton--principal', text: 'Lo he dicho ✓', onclick: () => resolve(100) }),
          el('button', { class: 'boton', text: 'Me ha costado', onclick: () => resolve(40) }),
        ]));
      });
    }

    const estado = el('div', { class: 'micro__estado', text: 'Pulsa y habla' });
    const micro = el('button', { class: 'micro', text: '🎤' });
    zona.appendChild(el('div', { class: 'micro__caja' }, [micro, estado]));

    return new Promise((resolve) => {
      micro.addEventListener('click', async () => {
        if (micro.classList.contains('micro--escuchando')) return;
        micro.classList.add('micro--escuchando');
        estado.textContent = 'Escuchando…';
        try {
          const { texto, alternativas } = await escuchar();
          const nota = Math.max(...alternativas.map((a) => puntuar(a, linea.ru)));
          micro.classList.remove('micro--escuchando');
          estado.textContent = `He oído: «${texto}» · ${nota}/100`;
          pie.innerHTML = '';
          pie.appendChild(el('div', { class: `retro retro--${nota >= 70 ? 'bien' : 'mal'}` }, [
            el('div', { class: 'retro__titulo', text: nota >= 70 ? '¡Bien dicho!' : 'Casi' }),
            el('div', { class: 'retro__respuesta', text: linea.ru }),
            el('div', { class: 'retro__tr', text: linea.tr }),
          ]));
          pie.appendChild(el('button', {
            class: 'boton boton--principal boton--ancho', text: 'Continuar',
            onclick: () => resolve(nota),
          }));
        } catch (e) {
          micro.classList.remove('micro--escuchando');
          estado.textContent = e.message;
        }
      });
      pie.appendChild(el('button', { class: 'boton boton--sutil boton--ancho', text: 'Saltar esta', onclick: () => resolve(0) }));
    });
  }
}

function botonAlternar(texto, leer, escribir) {
  const b = el('button', { class: `chip ${leer() ? 'chip--activo' : ''}`, text: `${leer() ? '✓' : '○'} ${texto}` });
  b.addEventListener('click', () => {
    const nuevo = !leer();
    escribir(nuevo);
    b.className = `chip ${nuevo ? 'chip--activo' : ''}`;
    b.textContent = `${nuevo ? '✓' : '○'} ${texto}`;
  });
  return b;
}

function pausa(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
