// Guardado local del progreso. Todo vive en el navegador (localStorage):
// no hay servidor, no hay cuenta, no sale nada de tu dispositivo.

const CLAVE = 'ruso-app-v1';

const ESTADO_INICIAL = {
  version: 1,
  perfil: {
    nombre: '',
    xp: 0,
    racha: 0,
    ultimoDiaActivo: null,   // 'YYYY-MM-DD'
    diasActivos: [],         // historial para la gráfica
  },
  tarjetas: {},              // id -> datos de repetición espaciada
  unidades: {},              // id -> { completada, mejorPuntaje, veces }
  ajustes: {
    transliteracion: true,
    audio: true,
    metaDiaria: 20,          // tarjetas por día
    ia: {
      activa: false,
      preset: 'ollama',
      baseUrl: 'http://localhost:11434/v1',
      modelo: 'qwen2.5:7b-instruct',
      apiKey: '',
      temperatura: 0.6,
    },
  },
  chat: [],
};

function clonar(x) {
  return JSON.parse(JSON.stringify(x));
}

// Mezcla defaults con lo guardado, para que actualizar la app no rompa el progreso.
function fusionar(base, guardado) {
  if (!guardado || typeof guardado !== 'object') return clonar(base);
  const salida = clonar(base);
  for (const clave of Object.keys(guardado)) {
    const valor = guardado[clave];
    if (valor && typeof valor === 'object' && !Array.isArray(valor) && salida[clave] && typeof salida[clave] === 'object' && !Array.isArray(salida[clave])) {
      salida[clave] = fusionar(salida[clave], valor);
    } else if (valor !== undefined) {
      salida[clave] = valor;
    }
  }
  return salida;
}

let estado = cargar();

function cargar() {
  try {
    const crudo = localStorage.getItem(CLAVE);
    return fusionar(ESTADO_INICIAL, crudo ? JSON.parse(crudo) : null);
  } catch (e) {
    console.warn('No se pudo leer el progreso guardado, empiezo de cero.', e);
    return clonar(ESTADO_INICIAL);
  }
}

let pendienteGuardar = null;
export function guardar() {
  // Agrupa varias escrituras seguidas en una sola.
  clearTimeout(pendienteGuardar);
  pendienteGuardar = setTimeout(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch (e) {
      console.warn('No se pudo guardar el progreso.', e);
    }
  }, 120);
}

export function obtener() {
  return estado;
}

export function actualizar(fn) {
  fn(estado);
  guardar();
  return estado;
}

export function hoyISO(fecha = new Date()) {
  const d = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
  return d.toISOString().slice(0, 10);
}

// Suma XP y mantiene la racha de días seguidos.
export function registrarActividad(xp = 0) {
  const hoy = hoyISO();
  actualizar((e) => {
    e.perfil.xp += xp;
    const ultimo = e.perfil.ultimoDiaActivo;
    if (ultimo !== hoy) {
      const ayer = hoyISO(new Date(Date.now() - 86400000));
      e.perfil.racha = ultimo === ayer ? e.perfil.racha + 1 : 1;
      e.perfil.ultimoDiaActivo = hoy;
      e.perfil.diasActivos.push({ dia: hoy, xp });
      if (e.perfil.diasActivos.length > 400) e.perfil.diasActivos.shift();
    } else {
      const registro = e.perfil.diasActivos[e.perfil.diasActivos.length - 1];
      if (registro && registro.dia === hoy) registro.xp += xp;
      else e.perfil.diasActivos.push({ dia: hoy, xp });
    }
  });
}

export function reiniciarTodo() {
  estado = clonar(ESTADO_INICIAL);
  guardar();
}

export function exportarJSON() {
  return JSON.stringify(estado, null, 2);
}

export function importarJSON(texto) {
  const datos = JSON.parse(texto);
  estado = fusionar(ESTADO_INICIAL, datos);
  guardar();
}
