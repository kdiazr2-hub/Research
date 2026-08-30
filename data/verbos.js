// Conjugador: los verbos rusos que de verdad se usan, conjugados enteros.
// grupo: 1 = terminaciones -ю/-ешь, 2 = terminaciones -ю/-ишь, irr = irregular.
// Para los imperfectivos, el futuro se construye con буду/будешь… + infinitivo.

const P = ['я', 'ты', 'он / она', 'мы', 'вы', 'они'];
export const PERSONAS = P;

export const VERBOS = [
  { inf: 'быть', tr: 'byt', es: 'ser, estar', aspecto: 'imperf', grupo: 'irr',
    presente: ['—', '—', 'есть', '—', '—', 'суть (arcaico)'],
    pasado: ['был', 'была', 'было', 'были'], imperativo: 'будь / будьте',
    nota: 'En presente no se dice. El futuro es буду, будешь, будет, будем, будете, будут.' },

  { inf: 'читать', tr: 'chitát', es: 'leer', aspecto: 'imperf', pareja: 'прочитать', grupo: 1,
    presente: ['читаю', 'читаешь', 'читает', 'читаем', 'читаете', 'читают'],
    pasado: ['читал', 'читала', 'читало', 'читали'], imperativo: 'читай / читайте' },

  { inf: 'делать', tr: 'diélat', es: 'hacer', aspecto: 'imperf', pareja: 'сделать', grupo: 1,
    presente: ['делаю', 'делаешь', 'делает', 'делаем', 'делаете', 'делают'],
    pasado: ['делал', 'делала', 'делало', 'делали'], imperativo: 'делай / делайте' },

  { inf: 'знать', tr: 'znat', es: 'saber, conocer', aspecto: 'imperf', grupo: 1,
    presente: ['знаю', 'знаешь', 'знает', 'знаем', 'знаете', 'знают'],
    pasado: ['знал', 'знала', 'знало', 'знали'], imperativo: 'знай / знайте' },

  { inf: 'работать', tr: 'rabótat', es: 'trabajar', aspecto: 'imperf', grupo: 1,
    presente: ['работаю', 'работаешь', 'работает', 'работаем', 'работаете', 'работают'],
    pasado: ['работал', 'работала', 'работало', 'работали'], imperativo: 'работай / работайте' },

  { inf: 'понимать', tr: 'panimát', es: 'entender', aspecto: 'imperf', pareja: 'понять', grupo: 1,
    presente: ['понимаю', 'понимаешь', 'понимает', 'понимаем', 'понимаете', 'понимают'],
    pasado: ['понимал', 'понимала', 'понимало', 'понимали'], imperativo: 'понимай / понимайте' },

  { inf: 'понять', tr: 'paniát', es: 'entender (perf.)', aspecto: 'perf', pareja: 'понимать', grupo: 1,
    presente: ['пойму', 'поймёшь', 'поймёт', 'поймём', 'поймёте', 'поймут'],
    pasado: ['понял', 'поняла', 'поняло', 'поняли'], imperativo: 'пойми / поймите',
    nota: 'Es futuro, no presente. Ojo al acento: понялá.' },

  { inf: 'говорить', tr: 'gavarít', es: 'hablar, decir', aspecto: 'imperf', pareja: 'сказать', grupo: 2,
    presente: ['говорю', 'говоришь', 'говорит', 'говорим', 'говорите', 'говорят'],
    pasado: ['говорил', 'говорила', 'говорило', 'говорили'], imperativo: 'говори / говорите' },

  { inf: 'сказать', tr: 'skazát', es: 'decir (perf.)', aspecto: 'perf', pareja: 'говорить', grupo: 1,
    presente: ['скажу', 'скажешь', 'скажет', 'скажем', 'скажете', 'скажут'],
    pasado: ['сказал', 'сказала', 'сказало', 'сказали'], imperativo: 'скажи / скажите',
    nota: 'з → ж en toda la conjugación.' },

  { inf: 'писать', tr: 'pisát', es: 'escribir', aspecto: 'imperf', pareja: 'написать', grupo: 1,
    presente: ['пишу', 'пишешь', 'пишет', 'пишем', 'пишете', 'пишут'],
    pasado: ['писал', 'писала', 'писало', 'писали'], imperativo: 'пиши / пишите',
    nota: 'с → ш en toda la conjugación.' },

  { inf: 'жить', tr: 'zhyt', es: 'vivir', aspecto: 'imperf', grupo: 1,
    presente: ['живу', 'живёшь', 'живёт', 'живём', 'живёте', 'живут'],
    pasado: ['жил', 'жила', 'жило', 'жили'], imperativo: 'живи / живите' },

  { inf: 'хотеть', tr: 'jatiét', es: 'querer', aspecto: 'imperf', grupo: 'irr',
    presente: ['хочу', 'хочешь', 'хочет', 'хотим', 'хотите', 'хотят'],
    pasado: ['хотел', 'хотела', 'хотело', 'хотели'], imperativo: '—',
    nota: 'Mezcla las dos conjugaciones: singular como la 1ª, plural como la 2ª.' },

  { inf: 'мочь', tr: 'moch', es: 'poder', aspecto: 'imperf', pareja: 'смочь', grupo: 'irr',
    presente: ['могу', 'можешь', 'может', 'можем', 'можете', 'могут'],
    pasado: ['мог', 'могла', 'могло', 'могли'], imperativo: '—',
    nota: 'г → ж salvo en я могу y они могут.' },

  { inf: 'есть', tr: 'iest', es: 'comer', aspecto: 'imperf', pareja: 'съесть', grupo: 'irr',
    presente: ['ем', 'ешь', 'ест', 'едим', 'едите', 'едят'],
    pasado: ['ел', 'ела', 'ело', 'ели'], imperativo: 'ешь / ешьте' },

  { inf: 'пить', tr: 'pit', es: 'beber', aspecto: 'imperf', pareja: 'выпить', grupo: 1,
    presente: ['пью', 'пьёшь', 'пьёт', 'пьём', 'пьёте', 'пьют'],
    pasado: ['пил', 'пила', 'пило', 'пили'], imperativo: 'пей / пейте' },

  { inf: 'идти', tr: 'ittí', es: 'ir (a pie, ahora)', aspecto: 'imperf', grupo: 1,
    presente: ['иду', 'идёшь', 'идёт', 'идём', 'идёте', 'идут'],
    pasado: ['шёл', 'шла', 'шло', 'шли'], imperativo: 'иди / идите',
    nota: 'El pasado no se parece nada al infinitivo: apréndetelo aparte.' },

  { inf: 'ходить', tr: 'jadít', es: 'ir (a pie, habitual)', aspecto: 'imperf', grupo: 2,
    presente: ['хожу', 'ходишь', 'ходит', 'ходим', 'ходите', 'ходят'],
    pasado: ['ходил', 'ходила', 'ходило', 'ходили'], imperativo: 'ходи / ходите' },

  { inf: 'ехать', tr: 'iéjat', es: 'ir (en vehículo, ahora)', aspecto: 'imperf', grupo: 1,
    presente: ['еду', 'едешь', 'едет', 'едем', 'едете', 'едут'],
    pasado: ['ехал', 'ехала', 'ехало', 'ехали'], imperativo: 'поезжай / поезжайте',
    nota: 'El imperativo se toma de otro verbo.' },

  { inf: 'ездить', tr: 'iézdit', es: 'ir (en vehículo, habitual)', aspecto: 'imperf', grupo: 2,
    presente: ['езжу', 'ездишь', 'ездит', 'ездим', 'ездите', 'ездят'],
    pasado: ['ездил', 'ездила', 'ездило', 'ездили'], imperativo: 'езди / ездите' },

  { inf: 'прийти', tr: 'priití', es: 'llegar (a pie)', aspecto: 'perf', pareja: 'приходить', grupo: 1,
    presente: ['приду', 'придёшь', 'придёт', 'придём', 'придёте', 'придут'],
    pasado: ['пришёл', 'пришла', 'пришло', 'пришли'], imperativo: 'приди / придите' },

  { inf: 'видеть', tr: 'vídiet', es: 'ver', aspecto: 'imperf', pareja: 'увидеть', grupo: 2,
    presente: ['вижу', 'видишь', 'видит', 'видим', 'видите', 'видят'],
    pasado: ['видел', 'видела', 'видело', 'видели'], imperativo: '—',
    nota: 'д → ж solo en la 1ª persona: вижу.' },

  { inf: 'смотреть', tr: 'smatriét', es: 'mirar, ver', aspecto: 'imperf', pareja: 'посмотреть', grupo: 2,
    presente: ['смотрю', 'смотришь', 'смотрит', 'смотрим', 'смотрите', 'смотрят'],
    pasado: ['смотрел', 'смотрела', 'смотрело', 'смотрели'], imperativo: 'смотри / смотрите' },

  { inf: 'слышать', tr: 'slýshat', es: 'oír', aspecto: 'imperf', pareja: 'услышать', grupo: 2,
    presente: ['слышу', 'слышишь', 'слышит', 'слышим', 'слышите', 'слышат'],
    pasado: ['слышал', 'слышала', 'слышало', 'слышали'], imperativo: '—' },

  { inf: 'слушать', tr: 'slúshat', es: 'escuchar', aspecto: 'imperf', pareja: 'послушать', grupo: 1,
    presente: ['слушаю', 'слушаешь', 'слушает', 'слушаем', 'слушаете', 'слушают'],
    pasado: ['слушал', 'слушала', 'слушало', 'слушали'], imperativo: 'слушай / слушайте' },

  { inf: 'любить', tr: 'liubít', es: 'amar, gustar mucho', aspecto: 'imperf', grupo: 2,
    presente: ['люблю', 'любишь', 'любит', 'любим', 'любите', 'любят'],
    pasado: ['любил', 'любила', 'любило', 'любили'], imperativo: 'люби / любите',
    nota: 'Aparece una л en la 1ª persona (люблю). Pasa con б, п, в, ф, м.' },

  { inf: 'брать', tr: 'brat', es: 'coger, tomar', aspecto: 'imperf', pareja: 'взять', grupo: 1,
    presente: ['беру', 'берёшь', 'берёт', 'берём', 'берёте', 'берут'],
    pasado: ['брал', 'брала', 'брало', 'брали'], imperativo: 'бери / берите' },

  { inf: 'взять', tr: 'vziat', es: 'coger (perf.)', aspecto: 'perf', pareja: 'брать', grupo: 1,
    presente: ['возьму', 'возьмёшь', 'возьмёт', 'возьмём', 'возьмёте', 'возьмут'],
    pasado: ['взял', 'взяла', 'взяло', 'взяли'], imperativo: 'возьми / возьмите' },

  { inf: 'дать', tr: 'dat', es: 'dar', aspecto: 'perf', pareja: 'давать', grupo: 'irr',
    presente: ['дам', 'дашь', 'даст', 'дадим', 'дадите', 'дадут'],
    pasado: ['дал', 'дала', 'дало', 'дали'], imperativo: 'дай / дайте' },

  { inf: 'давать', tr: 'davát', es: 'dar (imperf.)', aspecto: 'imperf', pareja: 'дать', grupo: 1,
    presente: ['даю', 'даёшь', 'даёт', 'даём', 'даёте', 'дают'],
    pasado: ['давал', 'давала', 'давало', 'давали'], imperativo: 'давай / давайте' },

  { inf: 'купить', tr: 'kupít', es: 'comprar', aspecto: 'perf', pareja: 'покупать', grupo: 2,
    presente: ['куплю', 'купишь', 'купит', 'купим', 'купите', 'купят'],
    pasado: ['купил', 'купила', 'купило', 'купили'], imperativo: 'купи / купите' },

  { inf: 'покупать', tr: 'pakupát', es: 'comprar (imperf.)', aspecto: 'imperf', pareja: 'купить', grupo: 1,
    presente: ['покупаю', 'покупаешь', 'покупает', 'покупаем', 'покупаете', 'покупают'],
    pasado: ['покупал', 'покупала', 'покупало', 'покупали'], imperativo: 'покупай / покупайте' },

  { inf: 'помнить', tr: 'pómnit', es: 'recordar', aspecto: 'imperf', grupo: 2,
    presente: ['помню', 'помнишь', 'помнит', 'помним', 'помните', 'помнят'],
    pasado: ['помнил', 'помнила', 'помнило', 'помнили'], imperativo: 'помни / помните' },

  { inf: 'забыть', tr: 'zabýt', es: 'olvidar', aspecto: 'perf', pareja: 'забывать', grupo: 1,
    presente: ['забуду', 'забудешь', 'забудет', 'забудем', 'забудете', 'забудут'],
    pasado: ['забыл', 'забыла', 'забыло', 'забыли'], imperativo: 'забудь / забудьте' },

  { inf: 'начать', tr: 'nachát', es: 'empezar', aspecto: 'perf', pareja: 'начинать', grupo: 1,
    presente: ['начну', 'начнёшь', 'начнёт', 'начнём', 'начнёте', 'начнут'],
    pasado: ['начал', 'начала', 'начало', 'начали'], imperativo: 'начни / начните',
    nota: 'Acento móvil en el pasado: началá.' },

  { inf: 'учить', tr: 'uchít', es: 'aprender, enseñar', aspecto: 'imperf', pareja: 'выучить', grupo: 2,
    presente: ['учу', 'учишь', 'учит', 'учим', 'учите', 'учат'],
    pasado: ['учил', 'учила', 'учило', 'учили'], imperativo: 'учи / учите' },

  { inf: 'учиться', tr: 'uchítsa', es: 'estudiar (ser estudiante)', aspecto: 'imperf', grupo: 2,
    presente: ['учусь', 'учишься', 'учится', 'учимся', 'учитесь', 'учатся'],
    pasado: ['учился', 'училась', 'училось', 'учились'], imperativo: 'учись / учитесь' },

  { inf: 'заниматься', tr: 'zanimátsa', es: 'dedicarse a', aspecto: 'imperf', grupo: 1,
    presente: ['занимаюсь', 'занимаешься', 'занимается', 'занимаемся', 'занимаетесь', 'занимаются'],
    pasado: ['занимался', 'занималась', 'занималось', 'занимались'], imperativo: 'занимайся / занимайтесь' },

  { inf: 'звонить', tr: 'zvanít', es: 'llamar por teléfono', aspecto: 'imperf', pareja: 'позвонить', grupo: 2,
    presente: ['звоню', 'звонишь', 'звонит', 'звоним', 'звоните', 'звонят'],
    pasado: ['звонил', 'звонила', 'звонило', 'звонили'], imperativo: 'звони / звоните',
    nota: 'El acento va siempre en la terminación: звонИт (звОнит es error muy comentado).' },

  { inf: 'спросить', tr: 'sprasít', es: 'preguntar', aspecto: 'perf', pareja: 'спрашивать', grupo: 2,
    presente: ['спрошу', 'спросишь', 'спросит', 'спросим', 'спросите', 'спросят'],
    pasado: ['спросил', 'спросила', 'спросило', 'спросили'], imperativo: 'спроси / спросите' },

  { inf: 'отвечать', tr: 'atvichát', es: 'responder', aspecto: 'imperf', pareja: 'ответить', grupo: 1,
    presente: ['отвечаю', 'отвечаешь', 'отвечает', 'отвечаем', 'отвечаете', 'отвечают'],
    pasado: ['отвечал', 'отвечала', 'отвечало', 'отвечали'], imperativo: 'отвечай / отвечайте' },

  { inf: 'ждать', tr: 'zhdat', es: 'esperar', aspecto: 'imperf', pareja: 'подождать', grupo: 1,
    presente: ['жду', 'ждёшь', 'ждёт', 'ждём', 'ждёте', 'ждут'],
    pasado: ['ждал', 'ждала', 'ждало', 'ждали'], imperativo: 'жди / ждите' },

  { inf: 'спать', tr: 'spat', es: 'dormir', aspecto: 'imperf', grupo: 2,
    presente: ['сплю', 'спишь', 'спит', 'спим', 'спите', 'спят'],
    pasado: ['спал', 'спала', 'спало', 'спали'], imperativo: 'спи / спите' },

  { inf: 'сидеть', tr: 'sidiét', es: 'estar sentado', aspecto: 'imperf', grupo: 2,
    presente: ['сижу', 'сидишь', 'сидит', 'сидим', 'сидите', 'сидят'],
    pasado: ['сидел', 'сидела', 'сидело', 'сидели'], imperativo: 'сиди / сидите' },

  { inf: 'стоять', tr: 'staiát', es: 'estar de pie', aspecto: 'imperf', grupo: 2,
    presente: ['стою', 'стоишь', 'стоит', 'стоим', 'стоите', 'стоят'],
    pasado: ['стоял', 'стояла', 'стояло', 'стояли'], imperativo: 'стой / стойте' },

  { inf: 'помочь', tr: 'pamóch', es: 'ayudar', aspecto: 'perf', pareja: 'помогать', grupo: 'irr',
    presente: ['помогу', 'поможешь', 'поможет', 'поможем', 'поможете', 'помогут'],
    pasado: ['помог', 'помогла', 'помогло', 'помогли'], imperativo: 'помоги / помогите',
    nota: 'Rige dativo: помочь другу.' },

  { inf: 'искать', tr: 'iskát', es: 'buscar', aspecto: 'imperf', pareja: 'найти', grupo: 1,
    presente: ['ищу', 'ищешь', 'ищет', 'ищем', 'ищете', 'ищут'],
    pasado: ['искал', 'искала', 'искало', 'искали'], imperativo: 'ищи / ищите' },

  { inf: 'найти', tr: 'naití', es: 'encontrar', aspecto: 'perf', pareja: 'находить', grupo: 1,
    presente: ['найду', 'найдёшь', 'найдёт', 'найдём', 'найдёте', 'найдут'],
    pasado: ['нашёл', 'нашла', 'нашло', 'нашли'], imperativo: 'найди / найдите' },

  { inf: 'открыть', tr: 'atkrýt', es: 'abrir', aspecto: 'perf', pareja: 'открывать', grupo: 1,
    presente: ['открою', 'откроешь', 'откроет', 'откроем', 'откроете', 'откроют'],
    pasado: ['открыл', 'открыла', 'открыло', 'открыли'], imperativo: 'открой / откройте' },

  { inf: 'стать', tr: 'stat', es: 'llegar a ser; ponerse', aspecto: 'perf', pareja: 'становиться', grupo: 1,
    presente: ['стану', 'станешь', 'станет', 'станем', 'станете', 'станут'],
    pasado: ['стал', 'стала', 'стало', 'стали'], imperativo: 'стань / станьте',
    nota: 'Rige instrumental: он стал врачом.' },

  { inf: 'чувствовать', tr: 'chústvavat', es: 'sentir', aspecto: 'imperf', pareja: 'почувствовать', grupo: 1,
    presente: ['чувствую', 'чувствуешь', 'чувствует', 'чувствуем', 'чувствуете', 'чувствуют'],
    pasado: ['чувствовал', 'чувствовала', 'чувствовало', 'чувствовали'], imperativo: 'чувствуй / чувствуйте',
    nota: 'Los verbos en -овать cambian a -у- : чувствовать → чувствую.' },

  { inf: 'рассказать', tr: 'raskazát', es: 'contar', aspecto: 'perf', pareja: 'рассказывать', grupo: 1,
    presente: ['расскажу', 'расскажешь', 'расскажет', 'расскажем', 'расскажете', 'расскажут'],
    pasado: ['рассказал', 'рассказала', 'рассказало', 'рассказали'], imperativo: 'расскажи / расскажите' },
];

export const FUTURO_BYT = ['буду', 'будешь', 'будет', 'будем', 'будете', 'будут'];

/** Devuelve las seis formas de futuro de un verbo. */
export function futuro(verbo) {
  if (verbo.aspecto === 'perf') return verbo.presente;
  return FUTURO_BYT.map((b) => `${b} ${verbo.inf}`);
}

export function buscarVerbo(texto) {
  const q = texto.trim().toLowerCase();
  if (!q) return VERBOS;
  return VERBOS.filter((v) =>
    v.inf.includes(q) || v.es.toLowerCase().includes(q) || v.tr.toLowerCase().includes(q)
  );
}
