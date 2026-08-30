// Referencia de gramática: las tablas que querrás consultar mil veces.
// No se estudian de memoria de golpe; se miran cuando dudas.

export const CASOS = [
  {
    id: 'nom', nombre: 'Nominativo', ruso: 'именительный', pregunta: 'кто? что?',
    uso: 'El sujeto de la frase. Es la forma que aparece en el diccionario.',
    preposiciones: [],
    ejemplo: { ru: 'Брат читает книгу.', es: 'El hermano lee un libro.' },
  },
  {
    id: 'gen', nombre: 'Genitivo', ruso: 'родительный', pregunta: 'кого? чего?',
    uso: 'Posesión ("de"), ausencia (нет + genitivo), cantidades y después de muchas preposiciones. Es el caso más frecuente después del nominativo.',
    preposiciones: ['без', 'для', 'из', 'от', 'до', 'у', 'около', 'кроме', 'после', 'вместо', 'против'],
    ejemplo: { ru: 'У брата нет времени.', es: 'El hermano no tiene tiempo.' },
  },
  {
    id: 'dat', nombre: 'Dativo', ruso: 'дательный', pregunta: 'кому? чему?',
    uso: 'El destinatario ("a quién"). También la edad, los estados (мне холодно) y verbos como нравиться, помогать, звонить.',
    preposiciones: ['к', 'по', 'благодаря'],
    ejemplo: { ru: 'Я звоню брату.', es: 'Llamo a mi hermano.' },
  },
  {
    id: 'acu', nombre: 'Acusativo', ruso: 'винительный', pregunta: 'кого? что?',
    uso: 'El objeto directo. Y con в / на indica dirección (¿a dónde?).',
    preposiciones: ['в (dirección)', 'на (dirección)', 'через', 'за (a por)', 'про'],
    ejemplo: { ru: 'Я вижу брата.', es: 'Veo a mi hermano.' },
  },
  {
    id: 'ins', nombre: 'Instrumental', ruso: 'творительный', pregunta: 'кем? чем?',
    uso: 'El medio ("con qué") y la compañía con с. También la profesión con быть/стать/работать.',
    preposiciones: ['с', 'над', 'под', 'перед', 'между', 'за (detrás)'],
    ejemplo: { ru: 'Я говорю с братом.', es: 'Hablo con mi hermano.' },
  },
  {
    id: 'pre', nombre: 'Preposicional', ruso: 'предложный', pregunta: 'о ком? о чём? где?',
    uso: 'El lugar donde algo está (в/на) y el tema del que se habla (о). Nunca aparece sin preposición: por eso se llama así.',
    preposiciones: ['в (lugar)', 'на (lugar)', 'о / об', 'при'],
    ejemplo: { ru: 'Я думаю о брате.', es: 'Pienso en mi hermano.' },
  },
];

export const TABLAS = [
  {
    id: 'sust-sg',
    titulo: 'Sustantivos en singular',
    nota: 'En acusativo, los masculinos ANIMADOS copian el genitivo (вижу брата) y los inanimados copian el nominativo (вижу стол).',
    columnas: ['Caso', 'Masc. стол', 'Fem. машина', 'Neutro окно'],
    filas: [
      ['Nominativo', 'стол', 'машина', 'окно'],
      ['Genitivo', 'стола', 'машины', 'окна'],
      ['Dativo', 'столу', 'машине', 'окну'],
      ['Acusativo', 'стол', 'машину', 'окно'],
      ['Instrumental', 'столом', 'машиной', 'окном'],
      ['Preposicional', 'о столе', 'о машине', 'об окне'],
    ],
  },
  {
    id: 'sust-pl',
    titulo: 'Sustantivos en plural',
    nota: 'El genitivo plural es el más irregular del ruso: машин (sin terminación), столов, друзей, книг. Se aprende palabra a palabra.',
    columnas: ['Caso', 'Masc. столы', 'Fem. машины', 'Neutro окна'],
    filas: [
      ['Nominativo', 'столы', 'машины', 'окна'],
      ['Genitivo', 'столов', 'машин', 'окон'],
      ['Dativo', 'столам', 'машинам', 'окнам'],
      ['Acusativo', 'столы', 'машины', 'окна'],
      ['Instrumental', 'столами', 'машинами', 'окнами'],
      ['Preposicional', 'о столах', 'о машинах', 'об окнах'],
    ],
  },
  {
    id: 'adj',
    titulo: 'Adjetivos (новый)',
    nota: 'Fíjate en que el femenino tiene la MISMA forma (новой) en genitivo, dativo, instrumental y preposicional. Es la mejor noticia de la tabla.',
    columnas: ['Caso', 'Masculino', 'Femenino', 'Neutro', 'Plural'],
    filas: [
      ['Nominativo', 'новый', 'новая', 'новое', 'новые'],
      ['Genitivo', 'нового', 'новой', 'нового', 'новых'],
      ['Dativo', 'новому', 'новой', 'новому', 'новым'],
      ['Acusativo', 'новый / нового', 'новую', 'новое', 'новые / новых'],
      ['Instrumental', 'новым', 'новой', 'новым', 'новыми'],
      ['Preposicional', 'о новом', 'о новой', 'о новом', 'о новых'],
    ],
  },
  {
    id: 'pron',
    titulo: 'Pronombres personales',
    nota: 'Después de preposición, los de 3ª persona añaden н-: у него, с ней, о них.',
    columnas: ['Caso', 'я', 'ты', 'он / оно', 'она', 'мы', 'вы', 'они'],
    filas: [
      ['Nominativo', 'я', 'ты', 'он', 'она', 'мы', 'вы', 'они'],
      ['Genitivo', 'меня', 'тебя', 'его', 'её', 'нас', 'вас', 'их'],
      ['Dativo', 'мне', 'тебе', 'ему', 'ей', 'нам', 'вам', 'им'],
      ['Acusativo', 'меня', 'тебя', 'его', 'её', 'нас', 'вас', 'их'],
      ['Instrumental', 'мной', 'тобой', 'им', 'ей', 'нами', 'вами', 'ими'],
      ['Preposicional', 'обо мне', 'о тебе', 'о нём', 'о ней', 'о нас', 'о вас', 'о них'],
    ],
  },
  {
    id: 'posesivos',
    titulo: 'Posesivos',
    nota: 'его (de él), её (de ella) y их (de ellos) NO cambian nunca: его дом, его машина, его окна.',
    columnas: ['', 'Masculino', 'Femenino', 'Neutro', 'Plural'],
    filas: [
      ['mi', 'мой', 'моя', 'моё', 'мои'],
      ['tu', 'твой', 'твоя', 'твоё', 'твои'],
      ['nuestro', 'наш', 'наша', 'наше', 'наши'],
      ['vuestro / de usted', 'ваш', 'ваша', 'ваше', 'ваши'],
      ['propio (reflexivo)', 'свой', 'своя', 'своё', 'свои'],
    ],
  },
  {
    id: 'presente',
    titulo: 'Presente: las dos conjugaciones',
    nota: 'Casi todo verbo ruso sigue uno de estos dos patrones. Los irregulares son pocos, pero son los más usados.',
    columnas: ['Persona', '1ª conjug. (читать)', '2ª conjug. (говорить)'],
    filas: [
      ['я', 'читаю', 'говорю'],
      ['ты', 'читаешь', 'говоришь'],
      ['он / она', 'читает', 'говорит'],
      ['мы', 'читаем', 'говорим'],
      ['вы', 'читаете', 'говорите'],
      ['они', 'читают', 'говорят'],
    ],
  },
  {
    id: 'movimiento',
    titulo: 'Verbos de movimiento',
    nota: 'La columna de la izquierda es "ahora, en una dirección"; la de la derecha, "habitualmente o ida y vuelta".',
    columnas: ['Significado', 'Unidireccional', 'Multidireccional'],
    filas: [
      ['ir a pie', 'идти', 'ходить'],
      ['ir en vehículo', 'ехать', 'ездить'],
      ['correr', 'бежать', 'бегать'],
      ['volar', 'лететь', 'летать'],
      ['llevar (en brazos)', 'нести', 'носить'],
      ['llevar (en vehículo)', 'везти', 'возить'],
    ],
  },
  {
    id: 'numeros',
    titulo: 'Qué caso pide cada número',
    nota: 'Se decide por la ÚLTIMA cifra: 21 se comporta como 1, 22 como 2, 25 como 5.',
    columnas: ['Número', 'Forma del sustantivo', 'Ejemplo'],
    filas: [
      ['1, 21, 31…', 'nominativo singular', 'один рубль'],
      ['2, 3, 4, 22…', 'genitivo singular', 'два рубля'],
      ['5–20, 25…', 'genitivo plural', 'пять рублей'],
      ['много, мало, сколько', 'genitivo plural', 'много рублей'],
    ],
  },
];

export const ATAJOS = [
  {
    titulo: 'Cómo elegir el caso en tres preguntas',
    texto: '1. ¿Es el que hace la acción? → nominativo.\n2. ¿Hay preposición? → el caso lo manda la preposición (mira la tabla de arriba).\n3. Si no hay preposición: ¿recibe la acción? → acusativo. ¿Es el destinatario? → dativo. ¿Es "de algo"? → genitivo. ¿Es el medio o la compañía? → instrumental.',
  },
  {
    titulo: 'Los cinco errores más típicos de un hispanohablante',
    texto: '1. Usar "ser/estar" en presente: *Я есть студент* → Я студент.\n2. Poner "un/una": el ruso no tiene artículos.\n3. Olvidar la doble negación: Я ничего **не** знаю.\n4. Decir "звОнит" en vez de звонИт.\n5. Usar el perfectivo para el presente: *я скажу* no significa "digo", significa "diré".',
  },
  {
    titulo: 'El acento cambia el significado',
    texto: 'зáмок (castillo) / замóк (candado) · плáчу (lloro) / плачý (pago) · пúсать / писáть. No hay reglas fijas: apréndete el acento con la palabra, como parte de ella.',
  },
];
