// Cliente para modelos de IA que corren en TU dispositivo.
//
// Funciona con cualquier servidor que hable el formato OpenAI
// (POST {baseUrl}/chat/completions), que es lo que exponen:
//   - Ollama (PC/Mac/Linux)            -> http://localhost:11434/v1
//   - LM Studio                        -> http://localhost:1234/v1
//   - llama.cpp (llama-server)         -> http://localhost:8080/v1
//   - Apps de iPhone tipo LM Pocket / PocketPal, cuando activas su
//     "servidor local" o "API compatible con OpenAI"
//   - El proxy incluido en esta app    -> /api/ia/v1  (evita problemas de CORS)
//
// Nada se envía a internet: la petición va a la dirección que tú configures.

import { obtener, actualizar } from './store.js';

export const PRESETS = {
  proxy: {
    nombre: 'Proxy de esta app (recomendado)',
    baseUrl: '/api/ia/v1',
    pista: 'Usa el servidor incluido (server.py / server.js). Es lo que menos problemas da, sobre todo desde el iPhone.',
  },
  ollama: {
    nombre: 'Ollama (en este mismo PC)',
    baseUrl: 'http://localhost:11434/v1',
    pista: 'Necesita arrancar Ollama con OLLAMA_ORIGINS="*" para que el navegador pueda hablarle.',
  },
  ollamaRed: {
    nombre: 'Ollama en otro equipo de la red',
    baseUrl: 'http://192.168.1.10:11434/v1',
    pista: 'Cambia la IP por la de tu PC. Útil para estudiar desde el móvil usando el modelo del ordenador.',
  },
  lmstudio: {
    nombre: 'LM Studio',
    baseUrl: 'http://localhost:1234/v1',
    pista: 'Activa el servidor local en la pestaña "Developer" de LM Studio.',
  },
  iphone: {
    nombre: 'iPhone (LM Pocket / PocketPal / Enclave)',
    baseUrl: 'http://localhost:8080/v1',
    pista: 'Activa en la app el servidor local compatible con OpenAI y copia aquí el puerto que te muestre.',
  },
  otro: {
    nombre: 'Otro servidor compatible con OpenAI',
    baseUrl: '',
    pista: 'Pega la URL base, terminada normalmente en /v1',
  },
};

export function config() {
  return obtener().ajustes.ia;
}

export function configurada() {
  const c = config();
  return Boolean(c.activa && c.baseUrl && c.modelo);
}

function url(ruta) {
  const base = config().baseUrl.replace(/\/+$/, '');
  return `${base}${ruta}`;
}

function cabeceras() {
  const h = { 'Content-Type': 'application/json' };
  const c = config();
  if (c.apiKey) h.Authorization = `Bearer ${c.apiKey}`;
  return h;
}

/** Lista los modelos disponibles en el servidor. Sirve como prueba de conexión. */
export async function listarModelos(baseUrl = config().baseUrl, apiKey = config().apiKey) {
  const base = (baseUrl || '').replace(/\/+$/, '');
  const h = { 'Content-Type': 'application/json' };
  if (apiKey) h.Authorization = `Bearer ${apiKey}`;
  const ctrl = new AbortController();
  const tiempo = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(`${base}/models`, { headers: h, signal: ctrl.signal });
    if (!r.ok) throw new Error(`El servidor respondió ${r.status}`);
    const datos = await r.json();
    const lista = (datos.data || datos.models || []).map((m) => m.id || m.name).filter(Boolean);
    return lista;
  } finally {
    clearTimeout(tiempo);
  }
}

/** Busca automáticamente un servidor de IA en las direcciones habituales. */
export async function autodetectar() {
  const candidatos = [
    '/api/ia/v1',
    'http://localhost:11434/v1',
    'http://127.0.0.1:11434/v1',
    'http://localhost:1234/v1',
    'http://localhost:8080/v1',
  ];
  for (const base of candidatos) {
    try {
      const modelos = await listarModelos(base, '');
      if (modelos.length) return { baseUrl: base, modelos };
    } catch (e) {
      // seguimos probando
    }
  }
  return null;
}

/**
 * Envía una conversación al modelo.
 * @param {Array<{role:string, content:string}>} mensajes
 * @param {{onToken?:(t:string)=>void, signal?:AbortSignal, temperatura?:number, json?:boolean}} opciones
 * @returns {Promise<string>} texto completo de la respuesta
 */
export async function chat(mensajes, opciones = {}) {
  const c = config();
  if (!c.baseUrl || !c.modelo) throw new Error('Falta configurar la IA en Ajustes.');

  const streaming = Boolean(opciones.onToken);
  const cuerpo = {
    model: c.modelo,
    messages: mensajes,
    temperature: opciones.temperatura ?? c.temperatura ?? 0.6,
    stream: streaming,
  };
  if (opciones.json) cuerpo.response_format = { type: 'json_object' };

  const r = await fetch(url('/chat/completions'), {
    method: 'POST',
    headers: cabeceras(),
    body: JSON.stringify(cuerpo),
    signal: opciones.signal,
  });

  if (!r.ok) {
    const detalle = await r.text().catch(() => '');
    throw new Error(`Error ${r.status} del servidor de IA. ${detalle.slice(0, 200)}`);
  }

  if (!streaming) {
    const datos = await r.json();
    return datos.choices?.[0]?.message?.content ?? '';
  }

  // Lectura en streaming (formato SSE de OpenAI).
  const lector = r.body.getReader();
  const decodificador = new TextDecoder();
  let buffer = '';
  let completo = '';
  while (true) {
    const { done, value } = await lector.read();
    if (done) break;
    buffer += decodificador.decode(value, { stream: true });
    const lineas = buffer.split('\n');
    buffer = lineas.pop() || '';
    for (const linea of lineas) {
      const l = linea.trim();
      if (!l.startsWith('data:')) continue;
      const carga = l.slice(5).trim();
      if (carga === '[DONE]') continue;
      try {
        const trozo = JSON.parse(carga);
        const t = trozo.choices?.[0]?.delta?.content || '';
        if (t) {
          completo += t;
          opciones.onToken(t);
        }
      } catch (e) {
        // trozo incompleto: se ignora
      }
    }
  }
  return completo;
}

/** Pide una respuesta en JSON y la parsea aunque el modelo añada texto alrededor. */
export async function chatJSON(mensajes, opciones = {}) {
  const texto = await chat(mensajes, { ...opciones, json: true, temperatura: opciones.temperatura ?? 0.3 });
  return extraerJSON(texto);
}

export function extraerJSON(texto) {
  if (!texto) throw new Error('Respuesta vacía del modelo.');
  const limpio = texto.replace(/```json/gi, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(limpio);
  } catch (e) {
    const inicio = limpio.search(/[[{]/);
    const fin = Math.max(limpio.lastIndexOf(']'), limpio.lastIndexOf('}'));
    if (inicio >= 0 && fin > inicio) {
      return JSON.parse(limpio.slice(inicio, fin + 1));
    }
    throw new Error('El modelo no devolvió un JSON válido.');
  }
}

// ---------------------------------------------------------------------------
// Instrucciones (prompts) para cada función pedagógica
// ---------------------------------------------------------------------------

const PERFILES_NIVEL = {
  A0: 'Está empezando desde cero: no conoce bien el alfabeto. Usa solo palabras de las primeras lecciones y transcribe SIEMPRE el ruso.',
  A1: 'Sabe leer cirílico despacio y conoce el presente y unas 300 palabras. Frases muy cortas, sin casos complicados.',
  A2: 'Maneja pasado, futuro y los casos básicos. Puedes usar frases de dos oraciones y vocabulario cotidiano.',
  B1: 'Se defiende en conversación. Puedes usar subordinadas, aspecto verbal y verbos de movimiento con prefijos.',
  B2: 'Nivel alto: puedes usar participios, gerundios, pasiva y partículas modales, y explicar matices de registro.',
  C1: 'Nivel avanzado: trátale casi como a un nativo. Explica matices finos, fraseología, estilo y connotaciones.',
};

/** El tutor se adapta al nivel que el alumno tenga declarado en Ajustes. */
export function sistemaTutor() {
  const nivel = obtener().ajustes.nivel || 'A1';
  return `Eres un profesor de ruso paciente y cercano. Tu alumno es hispanohablante y tiene nivel ${nivel}.

Perfil del alumno: ${PERFILES_NIVEL[nivel] || PERFILES_NIVEL.A1}

Reglas:
- Responde SIEMPRE en español, salvo los ejemplos en ruso.
- Cada vez que escribas ruso, añade entre paréntesis la pronunciación aproximada para un español y la traducción. Ejemplo: спасибо (spasíba — gracias).
- Marca el acento tónico en la pronunciación.
- Ajusta la dificultad al nivel ${nivel}: ni palabras que no pueda entender ni explicaciones por debajo de su nivel.
- Máximo 120 palabras por respuesta, salvo que pidan una explicación larga.
- Si el alumno escribe algo en ruso con errores, corrígelo con cariño: primero di qué estuvo bien, luego la versión correcta y el porqué en una línea.
- No inventes palabras rusas. Si no estás seguro de algo, dilo.`;
}

export function promptCorreccion(fraseEs, respuestaAlumno, referenciaRu) {
  return [
    { role: 'system', content: sistemaTutor() },
    {
      role: 'user',
      content: `Corrige esta traducción al ruso de un principiante.

Frase en español: "${fraseEs}"
Traducción de referencia: "${referenciaRu}"
Lo que escribió el alumno: "${respuestaAlumno}"

Devuelve SOLO un JSON con esta forma:
{"correcto": true|false, "puntuacion": 0-100, "correccion": "versión correcta en ruso", "explicacion": "1-2 frases en español explicando el error o felicitando"}`,
    },
  ];
}

export function promptEjercicios(unidad, cantidad = 5) {
  const vocab = unidad.vocab.map((v) => `${v.ru} = ${v.es}`).join('; ');
  return [
    { role: 'system', content: sistemaTutor() },
    {
      role: 'user',
      content: `Crea ${cantidad} ejercicios de opción múltiple para practicar la unidad "${unidad.titulo}" (nivel ${unidad.nivel}).

Usa SOLO este vocabulario: ${vocab}

Devuelve SOLO un JSON con esta forma exacta:
{"ejercicios":[{"pregunta":"texto de la pregunta en español","opciones":["a","b","c","d"],"correcta":0,"pista":"explicación breve en español"}]}

La pregunta puede ser de traducción, de completar una frase o de elegir la forma correcta. El índice "correcta" empieza en 0.`,
    },
  ];
}

export function promptExplicacion(tema) {
  return [
    { role: 'system', content: sistemaTutor() },
    { role: 'user', content: `Explícame de forma muy sencilla, con 3 ejemplos: ${tema}` },
  ];
}

export function promptDialogo(situacion, nivel = 'A1') {
  return [
    { role: 'system', content: sistemaTutor() },
    {
      role: 'user',
      content: `Escribe un diálogo muy corto (6 líneas máximo) de nivel ${nivel} en la situación: "${situacion}".
Formato de cada línea: ruso — pronunciación — traducción al español.
Al final añade 3 palabras clave para memorizar.`,
    },
  ];
}

export function guardarConfig(parcial) {
  actualizar((e) => Object.assign(e.ajustes.ia, parcial));
}

// ---------------------------------------------------------------------------
// Conversación por roles (role-play)
// ---------------------------------------------------------------------------

export const SITUACIONES = [
  { id: 'cafe', emoji: '☕', titulo: 'En una cafetería', papel: 'un camarero de una cafetería de Moscú', nivel: 'A1' },
  { id: 'taxi', emoji: '🚕', titulo: 'En un taxi', papel: 'un taxista que te lleva al centro', nivel: 'A2' },
  { id: 'tienda', emoji: '🛒', titulo: 'En una tienda', papel: 'un dependiente de una tienda de alimentación', nivel: 'A1' },
  { id: 'calle', emoji: '🧭', titulo: 'Preguntar el camino', papel: 'un transeúnte al que paras por la calle para pedir indicaciones', nivel: 'A1' },
  { id: 'hotel', emoji: '🏨', titulo: 'En el hotel', papel: 'el recepcionista de un hotel donde acabas de llegar', nivel: 'A2' },
  { id: 'amigo', emoji: '🍻', titulo: 'Quedar con un amigo', papel: 'un amigo ruso con el que estás quedando para esta tarde', nivel: 'A2' },
  { id: 'medico', emoji: '🩺', titulo: 'En el médico', papel: 'un médico de cabecera que te atiende en la consulta', nivel: 'B1' },
  { id: 'trabajo', emoji: '💼', titulo: 'Entrevista de trabajo', papel: 'un entrevistador de recursos humanos en una empresa rusa', nivel: 'B1' },
  { id: 'vecino', emoji: '🏠', titulo: 'Charla con un vecino', papel: 'tu vecina rusa, que es habladora y te pregunta por tu vida', nivel: 'B1' },
  { id: 'debate', emoji: '📰', titulo: 'Debatir una noticia', papel: 'un amigo con opiniones fuertes que quiere debatir contigo un tema de actualidad', nivel: 'B2' },
];

export function promptRolePlay(situacion) {
  const nivel = obtener().ajustes.nivel || 'A1';
  return {
    role: 'system',
    content: `Eres ${situacion.papel}. Estás hablando con un hispanohablante que aprende ruso y tiene nivel ${nivel}.

Reglas ESTRICTAS:
- Habla SOLO en ruso. Nunca en español, ni siquiera para explicar.
- Frases cortas y vocabulario del nivel ${nivel}. Si el nivel es A1 o A2, usa oraciones de 3 a 8 palabras.
- Una sola intervención por turno: di tu frase y espera. Nunca escribas las respuestas del alumno.
- Mantén viva la conversación: termina casi siempre con una pregunta sencilla.
- Si el alumno comete un error pero se le entiende, sigue la conversación con naturalidad sin corregirle (la corrección llega al final).
- Si dice algo incomprensible, responde en ruso pidiéndole que lo repita (Простите, не понял. Повторите, пожалуйста).
- No uses emojis ni acotaciones entre paréntesis. Solo diálogo.

Empieza tú saludando de forma adecuada a la situación.`,
  };
}

export function promptTraducirLinea(texto) {
  return [
    { role: 'system', content: 'Traduces del ruso al español. Responde solo con la traducción, sin comillas ni comentarios.' },
    { role: 'user', content: texto },
  ];
}

export function promptFeedbackConversacion(intervenciones, situacion) {
  return [
    { role: 'system', content: sistemaTutor() },
    {
      role: 'user',
      content: `Acabo de mantener esta conversación en ruso en la situación "${situacion}". Estas son MIS frases:

${intervenciones.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Dame feedback breve en español:
1. Una frase valorando cómo lo he hecho en general.
2. Las correcciones concretas que necesite (máximo 4), en formato "lo que dije → lo correcto → por qué" en una línea cada una.
3. Una expresión nueva que me habría venido bien en esta situación.

Si algo estaba bien, dilo. No inventes errores que no existan.`,
    },
  ];
}
