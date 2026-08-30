import { el } from '../ui.js';
import { obtener, hoyISO } from '../store.js';
import { TODO_VOCAB, unidadesPorNivel, numeroDeUnidad } from '../../data/lessons.js';
import { resumen } from '../srs.js';
import { hablar } from '../tts.js';

export function vistaProgreso(raiz) {
  const estado = obtener();
  const ids = TODO_VOCAB.map((v) => v.id);
  const r = resumen(ids);

  raiz.appendChild(el('header', { class: 'cabecera-vista' }, [
    el('h1', { text: '📈 Tu progreso' }),
  ]));

  raiz.appendChild(el('div', { class: 'tarjetas-cifras' }, [
    cifra('🔥', estado.perfil.racha, 'racha'),
    cifra('⭐', estado.perfil.xp, 'XP total'),
    cifra('📚', r.vistas, 'palabras vistas'),
    cifra('🏆', r.dominadas, 'dominadas'),
  ]));

  // Actividad de los últimos 14 días
  raiz.appendChild(el('h2', { class: 'seccion-titulo', text: 'Últimos 14 días' }));
  const porDia = new Map(estado.perfil.diasActivos.map((d) => [d.dia, d.xp]));
  const maximo = Math.max(10, ...porDia.values());
  const grafico = el('div', { class: 'grafico' });
  for (let i = 13; i >= 0; i--) {
    const dia = hoyISO(new Date(Date.now() - i * 86400000));
    const xp = porDia.get(dia) || 0;
    const alto = Math.round((xp / maximo) * 100);
    grafico.appendChild(el('div', { class: 'grafico__col', title: `${dia}: ${xp} XP` }, [
      el('div', { class: 'grafico__barra' }, [
        el('div', { class: `grafico__valor ${xp ? '' : 'grafico__valor--cero'}`, style: `height:${Math.max(alto, xp ? 6 : 2)}%` }),
      ]),
      el('div', { class: 'grafico__dia', text: dia.slice(8) }),
    ]));
  }
  raiz.appendChild(grafico);

  // Estado del vocabulario
  raiz.appendChild(el('h2', { class: 'seccion-titulo', text: 'Estado del vocabulario' }));
  const totalPct = (n) => (r.total ? Math.round((n / r.total) * 100) : 0);
  raiz.appendChild(el('div', { class: 'barra-apilada' }, [
    el('div', { class: 'barra-apilada__parte barra-apilada__parte--dominada', style: `width:${totalPct(r.dominadas)}%`, title: `${r.dominadas} dominadas` }),
    el('div', { class: 'barra-apilada__parte barra-apilada__parte--aprendiendo', style: `width:${totalPct(r.vistas - r.dominadas)}%`, title: `${r.vistas - r.dominadas} aprendiendo` }),
    el('div', { class: 'barra-apilada__parte barra-apilada__parte--nueva', style: `width:${totalPct(r.nuevas)}%`, title: `${r.nuevas} sin ver` }),
  ]));
  raiz.appendChild(el('div', { class: 'leyenda' }, [
    el('span', { class: 'leyenda__item leyenda__item--dominada', text: `${r.dominadas} dominadas` }),
    el('span', { class: 'leyenda__item leyenda__item--aprendiendo', text: `${r.vistas - r.dominadas} aprendiendo` }),
    el('span', { class: 'leyenda__item leyenda__item--nueva', text: `${r.nuevas} sin empezar` }),
  ]));

  // Palabras que más se te resisten
  const porId = new Map(TODO_VOCAB.map((v) => [v.id, v]));
  const dificiles = Object.values(estado.tarjetas)
    .filter((t) => t.fallos > 0 && porId.has(t.id))
    .sort((a, b) => b.fallos - a.fallos || a.ef - b.ef)
    .slice(0, 12);

  raiz.appendChild(el('h2', { class: 'seccion-titulo', text: 'Se te resisten' }));
  if (!dificiles.length) {
    raiz.appendChild(el('p', { class: 'pista', text: 'Todavía no hay fallos registrados. ¡O eres muy bueno o acabas de empezar!' }));
  } else {
    const lista = el('div', { class: 'vocab' });
    for (const t of dificiles) {
      const v = porId.get(t.id);
      lista.appendChild(el('div', { class: 'vocab__fila' }, [
        el('button', { class: 'boton boton--audio', text: '🔊', onclick: () => hablar(v.ru) }),
        el('div', { class: 'vocab__ru' }, [
          el('span', { class: 'vocab__palabra', text: v.ru }),
          el('span', { class: 'vocab__tr', text: v.tr }),
        ]),
        el('div', { class: 'vocab__es', text: v.es }),
        el('span', { class: 'etiqueta etiqueta--aviso', text: `${t.fallos} ${t.fallos === 1 ? 'fallo' : 'fallos'}` }),
      ]));
    }
    raiz.appendChild(lista);
  }

  // Progreso por nivel y por unidad
  raiz.appendChild(el('h2', { class: 'seccion-titulo', text: 'Por nivel' }));
  for (const nivel of unidadesPorNivel()) {
    const idsNivel = nivel.unidades.flatMap((u) => u.vocab.map((v) => `${u.id}:${v.ru}`));
    const rn = resumen(idsNivel);
    const pctNivel = rn.total ? Math.round((rn.vistas / rn.total) * 100) : 0;

    const tabla = el('div', { class: 'tabla-unidades' });
    for (const u of nivel.unidades) {
      const ru = resumen(u.vocab.map((v) => `${u.id}:${v.ru}`));
      const pct = ru.total ? Math.round((ru.vistas / ru.total) * 100) : 0;
      tabla.appendChild(el('a', { class: 'tabla-unidades__fila', href: `#/unidad/${u.id}` }, [
        el('span', { class: 'tabla-unidades__emoji', text: u.emoji }),
        el('span', { class: 'tabla-unidades__titulo', text: `${numeroDeUnidad(u.id)}. ${u.titulo}` }),
        el('span', { class: 'barra barra--fina' }, [el('span', { class: 'barra__relleno', style: `width:${pct}%` })]),
        el('span', { class: 'tabla-unidades__pct', text: `${pct}%` }),
      ]));
    }

    raiz.appendChild(el('details', { class: 'nivel', open: pctNivel > 0 && pctNivel < 100 ? true : null }, [
      el('summary', { class: 'nivel__cabecera' }, [
        el('span', { class: 'nivel__emoji', text: nivel.emoji }),
        el('span', { class: 'nivel__texto' }, [
          el('span', { class: 'nivel__nombre', text: `${nivel.id} · ${nivel.nombre}` }),
          el('span', { class: 'nivel__lema', text: `${rn.vistas} de ${rn.total} palabras · ${rn.dominadas} dominadas` }),
        ]),
        el('span', { class: 'nivel__pct', text: `${pctNivel}%` }),
      ]),
      el('div', { class: 'nivel__cuerpo' }, [tabla]),
    ]));
  }
}

function cifra(emoji, valor, etiqueta) {
  return el('div', { class: 'cifra' }, [
    el('div', { class: 'cifra__emoji', text: emoji }),
    el('div', { class: 'cifra__valor', text: String(valor) }),
    el('div', { class: 'cifra__etiqueta', text: etiqueta }),
  ]);
}
