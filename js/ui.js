// Utilidades pequeñas para construir la interfaz sin librerías externas.

export function el(etiqueta, props = {}, hijos = []) {
  const nodo = document.createElement(etiqueta);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') nodo.className = v;
    else if (k === 'html') nodo.innerHTML = v;
    else if (k === 'text') nodo.textContent = v;
    else if (k === 'dataset') Object.assign(nodo.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') nodo.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v !== null && v !== undefined && v !== false) nodo.setAttribute(k, v === true ? '' : v);
  }
  for (const h of [].concat(hijos)) {
    if (h === null || h === undefined || h === false) continue;
    nodo.appendChild(typeof h === 'string' ? document.createTextNode(h) : h);
  }
  return nodo;
}

export function escapar(texto = '') {
  return String(texto).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

export function mezclar(lista) {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function aleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

/** Compara respuestas en ruso siendo tolerante: mayúsculas, ё/е, puntuación y espacios. */
export function normalizarRuso(texto = '') {
  return texto
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[.,!?;:¡¿"'—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function igualRuso(a, b) {
  return normalizarRuso(a) === normalizarRuso(b);
}

let contenedorAvisos = null;
export function aviso(texto, tipo = 'info', ms = 2600) {
  if (!contenedorAvisos) {
    contenedorAvisos = el('div', { class: 'avisos' });
    document.body.appendChild(contenedorAvisos);
  }
  const nodo = el('div', { class: `aviso aviso--${tipo}`, text: texto });
  contenedorAvisos.appendChild(nodo);
  setTimeout(() => {
    nodo.classList.add('aviso--saliendo');
    setTimeout(() => nodo.remove(), 300);
  }, ms);
}

export function vibrar(ms = 20) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

// Teclado cirílico en pantalla (distribución ЙЦУКЕН, la estándar rusa).
const FILAS_TECLADO = [
  'йцукенгшщзхъ',
  'фывапролджэ',
  'ячсмитьбю',
];

export function tecladoCirilico(objetivo) {
  const teclado = el('div', { class: 'teclado' });
  for (const fila of FILAS_TECLADO) {
    const f = el('div', { class: 'teclado__fila' });
    for (const letra of fila) {
      f.appendChild(el('button', {
        class: 'tecla', type: 'button', text: letra,
        onclick: (ev) => {
          ev.preventDefault();
          insertar(objetivo, letra);
        },
      }));
    }
    teclado.appendChild(f);
  }
  const extra = el('div', { class: 'teclado__fila' }, [
    el('button', { class: 'tecla tecla--ancha', type: 'button', text: 'ё', onclick: (ev) => { ev.preventDefault(); insertar(objetivo, 'ё'); } }),
    el('button', { class: 'tecla tecla--ancha', type: 'button', text: 'espacio', onclick: (ev) => { ev.preventDefault(); insertar(objetivo, ' '); } }),
    el('button', { class: 'tecla tecla--ancha', type: 'button', text: '⌫', onclick: (ev) => {
      ev.preventDefault();
      objetivo.value = objetivo.value.slice(0, -1);
      objetivo.dispatchEvent(new Event('input'));
      objetivo.focus();
    } }),
  ]);
  teclado.appendChild(extra);
  return teclado;
}

function insertar(objetivo, texto) {
  objetivo.value += texto;
  objetivo.dispatchEvent(new Event('input'));
  objetivo.focus();
}

/** Convierte texto con *negrita* y saltos de línea en HTML seguro. */
export function textoRico(texto = '') {
  return escapar(texto)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}
