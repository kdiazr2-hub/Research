import { el, aviso } from '../ui.js';
import { obtener, actualizar, exportarJSON, importarJSON, reiniciarTodo } from '../store.js';
import { hayVozRusa, vozRusa, hablar } from '../tts.js';
import { hayReconocimiento } from '../speech.js';
import { NIVELES } from '../../data/lessons.js';
import * as IA from '../ai.js';

export function vistaAjustes(raiz) {
  const estado = obtener();

  raiz.appendChild(el('header', { class: 'cabecera-vista' }, [
    el('h1', { text: '⚙️ Ajustes' }),
  ]));

  // ---------------- Perfil ----------------
  raiz.appendChild(seccion('Tu perfil', [
    campoTexto('Nombre (solo se guarda en este dispositivo)', estado.perfil.nombre, (v) => {
      actualizar((e) => { e.perfil.nombre = v; });
    }),
  ]));

  // ---------------- IA local ----------------
  const ia = estado.ajustes.ia;

  const selectorPreset = el('select', { class: 'entrada' },
    Object.entries(IA.PRESETS).map(([clave, p]) =>
      el('option', { value: clave, selected: clave === ia.preset }, [p.nombre])
    ));
  const pista = el('p', { class: 'pista', text: IA.PRESETS[ia.preset]?.pista || '' });
  const campoUrl = el('input', { class: 'entrada', type: 'text', value: ia.baseUrl, placeholder: 'http://localhost:11434/v1' });
  const campoModelo = el('input', { class: 'entrada', type: 'text', value: ia.modelo, placeholder: 'qwen2.5:7b-instruct', list: 'lista-modelos' });
  const listaModelos = el('datalist', { id: 'lista-modelos' });
  const campoClave = el('input', { class: 'entrada', type: 'password', value: ia.apiKey, placeholder: '(normalmente vacío en local)' });
  const estadoConexion = el('div', { class: 'estado-conexion', text: ia.activa ? 'IA activada' : 'IA desactivada' });

  selectorPreset.addEventListener('change', () => {
    const p = IA.PRESETS[selectorPreset.value];
    pista.textContent = p.pista;
    if (p.baseUrl) campoUrl.value = p.baseUrl;
    guardarIA();
  });
  [campoUrl, campoModelo, campoClave].forEach((c) => c.addEventListener('change', guardarIA));

  function guardarIA() {
    IA.guardarConfig({
      preset: selectorPreset.value,
      baseUrl: campoUrl.value.trim(),
      modelo: campoModelo.value.trim(),
      apiKey: campoClave.value,
    });
  }

  const interruptorIA = interruptor('Usar IA local', ia.activa, (v) => {
    IA.guardarConfig({ activa: v });
    estadoConexion.textContent = v ? 'IA activada' : 'IA desactivada';
  });

  const botonProbar = el('button', {
    class: 'boton boton--principal', text: 'Probar conexión',
    onclick: async () => {
      guardarIA();
      estadoConexion.textContent = 'Conectando…';
      estadoConexion.className = 'estado-conexion';
      try {
        const modelos = await IA.listarModelos(campoUrl.value.trim(), campoClave.value);
        listaModelos.innerHTML = '';
        for (const m of modelos) listaModelos.appendChild(el('option', { value: m }));
        if (!campoModelo.value && modelos[0]) campoModelo.value = modelos[0];
        guardarIA();
        estadoConexion.textContent = `✓ Conectado. ${modelos.length} modelo(s): ${modelos.slice(0, 4).join(', ')}${modelos.length > 4 ? '…' : ''}`;
        estadoConexion.classList.add('estado-conexion--ok');
      } catch (e) {
        estadoConexion.textContent = `✗ Sin conexión: ${e.message}`;
        estadoConexion.classList.add('estado-conexion--error');
      }
    },
  });

  const botonDetectar = el('button', {
    class: 'boton', text: 'Buscar automáticamente',
    onclick: async () => {
      estadoConexion.textContent = 'Buscando servidores de IA…';
      estadoConexion.className = 'estado-conexion';
      const encontrado = await IA.autodetectar();
      if (!encontrado) {
        estadoConexion.textContent = '✗ No encontré ningún servidor. Revisa que Ollama esté arrancado.';
        estadoConexion.classList.add('estado-conexion--error');
        return;
      }
      campoUrl.value = encontrado.baseUrl;
      campoModelo.value = encontrado.modelos[0] || '';
      listaModelos.innerHTML = '';
      for (const m of encontrado.modelos) listaModelos.appendChild(el('option', { value: m }));
      IA.guardarConfig({ activa: true, baseUrl: encontrado.baseUrl, modelo: campoModelo.value });
      estadoConexion.textContent = `✓ Encontrado en ${encontrado.baseUrl} (${encontrado.modelos.length} modelos)`;
      estadoConexion.classList.add('estado-conexion--ok');
      aviso('IA activada', 'ok');
    },
  });

  raiz.appendChild(seccion('🤖 IA local', [
    el('p', { class: 'pista', text: 'La app funciona entera sin IA. Si activas un modelo local, desbloqueas el tutor, las explicaciones a medida y los ejercicios generados.' }),
    interruptorIA,
    etiquetado('Dónde está tu modelo', selectorPreset),
    pista,
    etiquetado('URL del servidor', campoUrl),
    etiquetado('Modelo', el('div', {}, [campoModelo, listaModelos])),
    etiquetado('Clave API (opcional)', campoClave),
    el('div', { class: 'fila-botones' }, [botonProbar, botonDetectar]),
    estadoConexion,
    el('details', { class: 'nota' }, [
      el('summary', { text: '¿Cómo lo pongo en marcha? (guía rápida)' }),
      el('div', { class: 'guia', html: `
        <p><strong>En el PC / Mac (Ollama)</strong></p>
        <ol>
          <li>Instala Ollama desde ollama.com</li>
          <li>En una terminal: <code>ollama pull qwen2.5:7b-instruct</code></li>
          <li>Arráncalo permitiendo al navegador conectarse:<br>
              Mac/Linux: <code>OLLAMA_ORIGINS="*" ollama serve</code><br>
              Windows (PowerShell): <code>$env:OLLAMA_ORIGINS="*"; ollama serve</code></li>
          <li>Aquí elige «Ollama (en este mismo PC)» y pulsa Probar conexión.</li>
        </ol>
        <p><strong>Más fácil todavía:</strong> arranca la app con <code>python3 server.py</code> y elige el preset «Proxy de esta app». El servidor habla con Ollama por ti y te ahorras los problemas de CORS.</p>
        <p><strong>En el iPhone</strong></p>
        <ol>
          <li>Opción A: en la app del modelo (LM Pocket, PocketPal, Enclave…) activa su <em>servidor local compatible con OpenAI</em> y pon aquí esa dirección.</li>
          <li>Opción B (la que siempre funciona): deja Ollama corriendo en el PC y, desde el iPhone en la misma wifi, abre <code>http://IP-DE-TU-PC:8000</code>. El proxy de la app se encarga del resto.</li>
        </ol>` }),
    ]),
  ]));

  // ---------------- Nivel ----------------
  const selectorNivel = el('select', { class: 'entrada' },
    NIVELES.map((n) => el('option', { value: n.id, selected: n.id === estado.ajustes.nivel }, [`${n.id} · ${n.nombre}`])));
  const descripcionNivel = el('p', { class: 'pista', text: NIVELES.find((n) => n.id === estado.ajustes.nivel)?.meta || '' });
  selectorNivel.addEventListener('change', () => {
    actualizar((e) => { e.ajustes.nivel = selectorNivel.value; });
    descripcionNivel.textContent = NIVELES.find((n) => n.id === selectorNivel.value)?.meta || '';
    aviso('Nivel actualizado: el tutor te hablará acorde a él.', 'ok');
  });

  raiz.appendChild(seccion('🎯 Tu nivel', [
    el('p', { class: 'pista', text: 'Esto no bloquea nada del curso: solo le dice al tutor de IA con qué dificultad hablarte y filtra las frases de la práctica de pronunciación.' }),
    etiquetado('Nivel actual', selectorNivel),
    descripcionNivel,
  ]));

  // ---------------- Estudio ----------------
  raiz.appendChild(seccion('📚 Estudio', [
    interruptor('Mostrar pronunciación aproximada', estado.ajustes.transliteracion, (v) => {
      actualizar((e) => { e.ajustes.transliteracion = v; });
    }),
    interruptor('Audio y ejercicios de escucha', estado.ajustes.audio, (v) => {
      actualizar((e) => { e.ajustes.audio = v; });
    }),
    etiquetado('Meta diaria (tarjetas por día)', deslizador(estado.ajustes.metaDiaria, (v) => {
      actualizar((e) => { e.ajustes.metaDiaria = v; });
    })),
  ]));

  // ---------------- Voz ----------------
  const voz = vozRusa();
  raiz.appendChild(seccion('🔊 Voz rusa', [
    el('p', { class: hayVozRusa() ? 'estado-conexion estado-conexion--ok' : 'estado-conexion estado-conexion--error',
      text: hayVozRusa() ? `✓ Voz detectada: ${voz.name}` : '✗ Este dispositivo no tiene voz rusa instalada' }),
    el('button', { class: 'boton', text: 'Probar: «Здравствуйте»', onclick: () => hablar('Здравствуйте') }),
    el('p', { class: hayReconocimiento() ? 'estado-conexion estado-conexion--ok' : 'estado-conexion estado-conexion--error',
      text: hayReconocimiento()
        ? '✓ Este navegador puede escucharte: la práctica de pronunciación está disponible'
        : '✗ Este navegador no reconoce voz (usa Chrome, Edge o Safari para practicar pronunciación)' }),
    el('details', { class: 'nota' }, [
      el('summary', { text: 'Cómo instalar la voz rusa' }),
      el('div', { class: 'guia', html: `
        <p><strong>iPhone/iPad:</strong> Ajustes → Accesibilidad → Contenido hablado → Voces → Ruso (descarga «Milena»).</p>
        <p><strong>Windows:</strong> Configuración → Hora e idioma → Idioma → Añadir «Русский» y marcar «Voz».</p>
        <p><strong>Mac:</strong> Ajustes → Accesibilidad → Contenido hablado → Voz del sistema → Gestionar voces → Ruso.</p>
        <p><strong>Android:</strong> Ajustes → Sistema → Idiomas → Salida de texto a voz → instalar el paquete de ruso.</p>` }),
    ]),
  ]));

  // ---------------- Datos ----------------
  const entradaArchivo = el('input', { type: 'file', accept: 'application/json', class: 'oculto' });
  entradaArchivo.addEventListener('change', async () => {
    const archivo = entradaArchivo.files?.[0];
    if (!archivo) return;
    try {
      importarJSON(await archivo.text());
      aviso('Progreso importado', 'ok');
      setTimeout(() => location.reload(), 600);
    } catch (e) {
      aviso('El archivo no es válido', 'error');
    }
  });

  raiz.appendChild(seccion('💾 Tus datos', [
    el('p', { class: 'pista', text: 'Todo tu progreso vive solo en este navegador. Si borras los datos del navegador, se pierde: haz una copia de vez en cuando.' }),
    el('div', { class: 'fila-botones' }, [
      el('button', { class: 'boton', text: 'Exportar copia', onclick: descargarCopia }),
      el('button', { class: 'boton', text: 'Importar copia', onclick: () => entradaArchivo.click() }),
      el('button', {
        class: 'boton boton--peligro', text: 'Borrar todo',
        onclick: () => {
          if (confirm('¿Seguro? Se borra todo tu progreso y no se puede deshacer.')) {
            reiniciarTodo();
            aviso('Progreso borrado', 'ok');
            setTimeout(() => location.reload(), 600);
          }
        },
      }),
    ]),
    entradaArchivo,
  ]));
}

function descargarCopia() {
  const blob = new Blob([exportarJSON()], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `ruso-progreso-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function seccion(titulo, hijos) {
  return el('section', { class: 'ajustes__seccion' }, [el('h2', { text: titulo }), ...hijos]);
}

function etiquetado(texto, control) {
  return el('label', { class: 'campo' }, [el('span', { class: 'campo__etiqueta', text: texto }), control]);
}

function campoTexto(etiqueta, valor, alCambiar) {
  const input = el('input', { class: 'entrada', type: 'text', value: valor });
  input.addEventListener('change', () => alCambiar(input.value.trim()));
  return etiquetado(etiqueta, input);
}

function interruptor(etiqueta, valor, alCambiar) {
  const input = el('input', { type: 'checkbox', checked: valor });
  input.addEventListener('change', () => alCambiar(input.checked));
  return el('label', { class: 'interruptor' }, [input, el('span', { text: etiqueta })]);
}

function deslizador(valor, alCambiar) {
  const salida = el('span', { class: 'deslizador__valor', text: String(valor) });
  const input = el('input', { type: 'range', min: '5', max: '60', step: '5', value: String(valor), class: 'deslizador' });
  input.addEventListener('input', () => { salida.textContent = input.value; });
  input.addEventListener('change', () => alCambiar(Number(input.value)));
  return el('div', { class: 'deslizador__caja' }, [input, salida]);
}
