// Curso de ruso para hispanohablantes: nivel A0 -> A1.
// Cada unidad tiene: gramática explicada en español, vocabulario y frases.
// Los ejercicios se generan automáticamente a partir de este contenido (ver js/exercises.js).

export const UNIDADES = [
  {
    id: 'u1',
    emoji: '🔤',
    nivel: 'A0',
    titulo: 'Tus primeras palabras',
    descripcion: 'Palabras que casi puedes leer ya, con las letras más fáciles del cirílico.',
    gramatica: [
      {
        titulo: 'El ruso se lee como se escribe (casi)',
        texto: 'No hay letras mudas ni combinaciones raras. Una letra = un sonido. Lo único que cambia es que las vocales SIN acento se "comen" un poco: la о átona suena como "a".',
        ejemplos: [
          { ru: 'мама', tr: 'máma', es: 'mamá' },
          { ru: 'молоко', tr: 'malakó', es: 'leche' },
          { ru: 'хорошо', tr: 'jarashó', es: 'bien' },
        ],
      },
      {
        titulo: 'El acento manda',
        texto: 'Cada palabra rusa tiene UNA sílaba fuerte y no se marca por escrito. En este curso te la marcamos en la transcripción (má-ma). Apréndete el acento junto con la palabra, como parte de ella.',
        ejemplos: [
          { ru: 'вода', tr: 'vadá', es: 'agua (acento en la última)' },
          { ru: 'город', tr: 'górat', es: 'ciudad (acento en la primera)' },
        ],
      },
    ],
    vocab: [
      { ru: 'мама', tr: 'máma', es: 'mamá', cat: 'sustantivo' },
      { ru: 'папа', tr: 'pápa', es: 'papá', cat: 'sustantivo' },
      { ru: 'кот', tr: 'kot', es: 'gato', cat: 'sustantivo' },
      { ru: 'дом', tr: 'dom', es: 'casa', cat: 'sustantivo' },
      { ru: 'вода', tr: 'vadá', es: 'agua', cat: 'sustantivo' },
      { ru: 'молоко', tr: 'malakó', es: 'leche', cat: 'sustantivo' },
      { ru: 'хлеб', tr: 'jlep', es: 'pan', cat: 'sustantivo' },
      { ru: 'город', tr: 'górat', es: 'ciudad', cat: 'sustantivo' },
      { ru: 'книга', tr: 'kníga', es: 'libro', cat: 'sustantivo' },
      { ru: 'стол', tr: 'stol', es: 'mesa', cat: 'sustantivo' },
      { ru: 'окно', tr: 'aknó', es: 'ventana', cat: 'sustantivo' },
      { ru: 'да', tr: 'da', es: 'sí', cat: 'partícula' },
      { ru: 'нет', tr: 'niet', es: 'no', cat: 'partícula' },
      { ru: 'хорошо', tr: 'jarashó', es: 'bien / vale', cat: 'adverbio' },
    ],
    frases: [
      { ru: 'Это дом.', tr: 'Éta dom.', es: 'Esto es una casa.' },
      { ru: 'Это кот.', tr: 'Éta kot.', es: 'Esto es un gato.' },
      { ru: 'Вода и хлеб.', tr: 'Vadá i jlep.', es: 'Agua y pan.' },
      { ru: 'Да, хорошо.', tr: 'Da, jarashó.', es: 'Sí, bien.' },
    ],
  },

  {
    id: 'u2',
    emoji: '👋',
    nivel: 'A0',
    titulo: 'Saludos y cortesía',
    descripcion: 'Saludar, despedirse, dar las gracias y disculparse.',
    gramatica: [
      {
        titulo: 'Tú y usted',
        texto: 'привет = "hola" informal (amigos, familia, gente joven). здравствуйте = "hola" formal o a varias personas. Si dudas, usa здравствуйте: nunca queda mal.',
        ejemplos: [
          { ru: 'Привет, Анна!', tr: 'Privét, Ánna!', es: '¡Hola, Anna!' },
          { ru: 'Здравствуйте!', tr: 'Zdrástvuitie!', es: '¡Buenos días! (formal)' },
        ],
      },
      {
        titulo: '"Me llamo" en ruso es "a mí me llaman"',
        texto: 'Меня зовут… literalmente es "a mí me llaman…". No cambia nunca, apréndetela en bloque. Para preguntar: Как вас зовут? (formal) / Как тебя зовут? (informal).',
        ejemplos: [
          { ru: 'Меня зовут Мария.', tr: 'Miniá zavút María.', es: 'Me llamo María.' },
          { ru: 'Как вас зовут?', tr: '¿Kak vas zavút?', es: '¿Cómo se llama usted?' },
        ],
      },
    ],
    vocab: [
      { ru: 'привет', tr: 'privét', es: 'hola (informal)', cat: 'saludo' },
      { ru: 'здравствуйте', tr: 'zdrástvuitie', es: 'hola (formal)', cat: 'saludo' },
      { ru: 'доброе утро', tr: 'dóbraie útra', es: 'buenos días', cat: 'saludo' },
      { ru: 'добрый день', tr: 'dóbry dien', es: 'buenas tardes', cat: 'saludo' },
      { ru: 'добрый вечер', tr: 'dóbry viécher', es: 'buenas noches (al llegar)', cat: 'saludo' },
      { ru: 'пока', tr: 'paká', es: 'chao (informal)', cat: 'saludo' },
      { ru: 'до свидания', tr: 'da svidánia', es: 'adiós (formal)', cat: 'saludo' },
      { ru: 'спасибо', tr: 'spasíba', es: 'gracias', cat: 'cortesía' },
      { ru: 'пожалуйста', tr: 'pazhálusta', es: 'por favor / de nada', cat: 'cortesía' },
      { ru: 'извините', tr: 'izvinítie', es: 'perdone / disculpe', cat: 'cortesía' },
      { ru: 'как дела?', tr: '¿kak dielá?', es: '¿qué tal?', cat: 'frase' },
      { ru: 'очень приятно', tr: 'óchen priátna', es: 'mucho gusto', cat: 'cortesía' },
      { ru: 'меня зовут', tr: 'miniá zavút', es: 'me llamo', cat: 'frase' },
      { ru: 'да', tr: 'da', es: 'sí', cat: 'partícula' },
    ],
    frases: [
      { ru: 'Привет! Как дела?', tr: '¡Privét! ¿Kak dielá?', es: '¡Hola! ¿Qué tal?' },
      { ru: 'Хорошо, спасибо!', tr: '¡Jarashó, spasíba!', es: '¡Bien, gracias!' },
      { ru: 'Меня зовут Иван. А вас?', tr: 'Miniá zavút Iván. ¿A vas?', es: 'Me llamo Iván. ¿Y usted?' },
      { ru: 'Очень приятно!', tr: '¡Óchen priátna!', es: '¡Mucho gusto!' },
      { ru: 'До свидания!', tr: '¡Da svidánia!', es: '¡Adiós!' },
    ],
  },

  {
    id: 'u3',
    emoji: '🙋',
    nivel: 'A0',
    titulo: 'Yo, tú, él… y el verbo que no existe',
    descripcion: 'Pronombres personales y la gran sorpresa: en ruso no se dice "ser" en presente.',
    gramatica: [
      {
        titulo: 'El verbo "ser" desaparece',
        texto: 'En presente el ruso NO usa "soy/eres/es". Simplemente juntas las dos palabras: Я студент = "Yo (soy) estudiante". Al escribir a veces se pone un guion: Москва — город.',
        ejemplos: [
          { ru: 'Я студент.', tr: 'Ya studiént.', es: 'Soy estudiante.' },
          { ru: 'Она врач.', tr: 'Aná vrach.', es: 'Ella es médica.' },
          { ru: 'Мы дома.', tr: 'My dóma.', es: 'Estamos en casa.' },
        ],
      },
      {
        titulo: 'Los pronombres',
        texto: 'я (yo), ты (tú), он (él), она (ella), оно (ello), мы (nosotros), вы (vosotros / usted), они (ellos). Ojo: вы con mayúscula (Вы) es el "usted" de respeto.',
        ejemplos: [
          { ru: 'Ты дома?', tr: '¿Ty dóma?', es: '¿Estás en casa?' },
          { ru: 'Они студенты.', tr: 'Aní studiénty.', es: 'Ellos son estudiantes.' },
        ],
      },
    ],
    vocab: [
      { ru: 'я', tr: 'ya', es: 'yo', cat: 'pronombre' },
      { ru: 'ты', tr: 'ty', es: 'tú', cat: 'pronombre' },
      { ru: 'он', tr: 'on', es: 'él', cat: 'pronombre' },
      { ru: 'она', tr: 'aná', es: 'ella', cat: 'pronombre' },
      { ru: 'мы', tr: 'my', es: 'nosotros', cat: 'pronombre' },
      { ru: 'вы', tr: 'vy', es: 'vosotros / usted', cat: 'pronombre' },
      { ru: 'они', tr: 'aní', es: 'ellos', cat: 'pronombre' },
      { ru: 'студент', tr: 'studiént', es: 'estudiante', cat: 'sustantivo' },
      { ru: 'врач', tr: 'vrach', es: 'médico', cat: 'sustantivo' },
      { ru: 'учитель', tr: 'uchítiel', es: 'profesor', cat: 'sustantivo' },
      { ru: 'друг', tr: 'druk', es: 'amigo', cat: 'sustantivo' },
      { ru: 'русский', tr: 'rúsky', es: 'ruso (nacionalidad/idioma)', cat: 'adjetivo' },
      { ru: 'испанец', tr: 'ispániets', es: 'español (hombre)', cat: 'sustantivo' },
      { ru: 'испанка', tr: 'ispánka', es: 'española (mujer)', cat: 'sustantivo' },
      { ru: 'дома', tr: 'dóma', es: 'en casa', cat: 'adverbio' },
    ],
    frases: [
      { ru: 'Я испанец.', tr: 'Ya ispániets.', es: 'Soy español.' },
      { ru: 'Она учитель.', tr: 'Aná uchítiel.', es: 'Ella es profesora.' },
      { ru: 'Мы друзья.', tr: 'My druziá.', es: 'Somos amigos.' },
      { ru: 'Он дома?', tr: '¿On dóma?', es: '¿Está él en casa?' },
    ],
  },

  {
    id: 'u4',
    emoji: '❓',
    nivel: 'A0',
    titulo: 'Preguntar: quién, qué, dónde',
    descripcion: 'Las preguntas más útiles y la palabra mágica это.',
    gramatica: [
      {
        titulo: 'это = "esto es"',
        texto: 'это sirve para señalar cualquier cosa, de cualquier género y número: Это книга (esto es un libro), Это мой друг (este es mi amigo). No cambia.',
        ejemplos: [
          { ru: 'Что это?', tr: '¿Shto éta?', es: '¿Qué es esto?' },
          { ru: 'Это книга.', tr: 'Éta kníga.', es: 'Esto es un libro.' },
        ],
      },
      {
        titulo: 'Preguntas sin inversión',
        texto: 'Para hacer una pregunta de sí/no no cambias el orden de las palabras: solo subes la entonación. Ты дома. (afirmación) → Ты дома? (pregunta). Mucho más fácil que en español.',
        ejemplos: [
          { ru: 'Это ваш дом?', tr: '¿Éta vash dom?', es: '¿Es esta su casa?' },
          { ru: 'Где метро?', tr: '¿Gdie mitró?', es: '¿Dónde está el metro?' },
        ],
      },
    ],
    vocab: [
      { ru: 'кто', tr: 'kto', es: 'quién', cat: 'interrogativo' },
      { ru: 'что', tr: 'shto', es: 'qué', cat: 'interrogativo', nota: 'Se escribe что pero se pronuncia "shto".' },
      { ru: 'где', tr: 'gdie', es: 'dónde', cat: 'interrogativo' },
      { ru: 'когда', tr: 'kagdá', es: 'cuándo', cat: 'interrogativo' },
      { ru: 'как', tr: 'kak', es: 'cómo', cat: 'interrogativo' },
      { ru: 'почему', tr: 'pachimú', es: 'por qué', cat: 'interrogativo' },
      { ru: 'сколько', tr: 'skólka', es: 'cuánto', cat: 'interrogativo' },
      { ru: 'это', tr: 'éta', es: 'esto (es)', cat: 'demostrativo' },
      { ru: 'там', tr: 'tam', es: 'allí', cat: 'adverbio' },
      { ru: 'здесь', tr: 'zdies', es: 'aquí', cat: 'adverbio' },
      { ru: 'сейчас', tr: 'sichás', es: 'ahora', cat: 'adverbio' },
      { ru: 'метро', tr: 'mitró', es: 'metro', cat: 'sustantivo' },
      { ru: 'вокзал', tr: 'vakzál', es: 'estación de tren', cat: 'sustantivo' },
      { ru: 'туалет', tr: 'tualiét', es: 'baño', cat: 'sustantivo' },
    ],
    frases: [
      { ru: 'Что это?', tr: '¿Shto éta?', es: '¿Qué es esto?' },
      { ru: 'Кто это?', tr: '¿Kto éta?', es: '¿Quién es?' },
      { ru: 'Где туалет?', tr: '¿Gdie tualiét?', es: '¿Dónde está el baño?' },
      { ru: 'Извините, где метро?', tr: 'Izvinítie, ¿gdie mitró?', es: 'Perdone, ¿dónde está el metro?' },
      { ru: 'Метро там.', tr: 'Mitró tam.', es: 'El metro está allí.' },
    ],
  },

  {
    id: 'u5',
    emoji: '🔢',
    nivel: 'A1',
    titulo: 'Números',
    descripcion: 'Contar del 0 al 1000: precios, teléfonos y edad.',
    gramatica: [
      {
        titulo: 'Cómo se construyen las decenas',
        texto: 'Del 11 al 19 se añade -надцать: один→одиннадцать, три→тринадцать. Las decenas mezcladas se dicen en orden lógico: двадцать один (21), тридцать пять (35).',
        ejemplos: [
          { ru: 'двадцать пять', tr: 'dvátsat piat', es: 'veinticinco' },
          { ru: 'сто десять', tr: 'sto diésiat', es: 'ciento diez' },
        ],
      },
      {
        titulo: 'Después del número, el sustantivo cambia',
        texto: 'Regla de supervivencia: 1 → рубль, 2-4 → рубля, 5 y más → рублей. Suena raro pero es automático. Con 21, 31… se usa la forma de 1 (двадцать один рубль).',
        ejemplos: [
          { ru: 'один рубль', tr: 'adín rubl', es: '1 rublo' },
          { ru: 'три рубля', tr: 'tri rubliá', es: '3 rublos' },
          { ru: 'пять рублей', tr: 'piat rubliéi', es: '5 rublos' },
        ],
      },
    ],
    vocab: [
      { ru: 'ноль', tr: 'nol', es: 'cero', cat: 'número' },
      { ru: 'один', tr: 'adín', es: 'uno', cat: 'número' },
      { ru: 'два', tr: 'dva', es: 'dos', cat: 'número' },
      { ru: 'три', tr: 'tri', es: 'tres', cat: 'número' },
      { ru: 'четыре', tr: 'chitýrie', es: 'cuatro', cat: 'número' },
      { ru: 'пять', tr: 'piat', es: 'cinco', cat: 'número' },
      { ru: 'шесть', tr: 'shest', es: 'seis', cat: 'número' },
      { ru: 'семь', tr: 'siem', es: 'siete', cat: 'número' },
      { ru: 'восемь', tr: 'vósiem', es: 'ocho', cat: 'número' },
      { ru: 'девять', tr: 'diéviat', es: 'nueve', cat: 'número' },
      { ru: 'десять', tr: 'diésiat', es: 'diez', cat: 'número' },
      { ru: 'двадцать', tr: 'dvátsat', es: 'veinte', cat: 'número' },
      { ru: 'тридцать', tr: 'trítsat', es: 'treinta', cat: 'número' },
      { ru: 'сто', tr: 'sto', es: 'cien', cat: 'número' },
      { ru: 'тысяча', tr: 'týsiacha', es: 'mil', cat: 'número' },
      { ru: 'сколько стоит?', tr: '¿skólka stóit?', es: '¿cuánto cuesta?', cat: 'frase' },
      { ru: 'рубль', tr: 'rubl', es: 'rublo', cat: 'sustantivo' },
    ],
    frases: [
      { ru: 'Сколько это стоит?', tr: '¿Skólka éta stóit?', es: '¿Cuánto cuesta esto?' },
      { ru: 'Сто рублей.', tr: 'Sto rubliéi.', es: 'Cien rublos.' },
      { ru: 'Мне двадцать пять лет.', tr: 'Mnie dvátsat piat liet.', es: 'Tengo 25 años.' },
      { ru: 'Два кофе, пожалуйста.', tr: 'Dva kófie, pazhálusta.', es: 'Dos cafés, por favor.' },
    ],
  },

  {
    id: 'u6',
    emoji: '⚧',
    nivel: 'A1',
    titulo: 'El género de las palabras',
    descripcion: 'Masculino, femenino y neutro: cómo saberlo mirando la última letra.',
    gramatica: [
      {
        titulo: 'Mira la última letra',
        texto: 'Masculino: termina en consonante (дом, стол, брат). Femenino: termina en -а / -я (мама, книга, семья). Neutro: termina en -о / -е (окно, море). Las que acaban en -ь pueden ser de los dos géneros: hay que aprenderlas (мать es femenino, день masculino).',
        ejemplos: [
          { ru: 'дом (м)', tr: 'dom', es: 'casa → masculino' },
          { ru: 'книга (ж)', tr: 'kníga', es: 'libro → femenino' },
          { ru: 'окно (ср)', tr: 'aknó', es: 'ventana → neutro' },
        ],
      },
      {
        titulo: 'Mi, tu, su… concuerdan',
        texto: 'мой (m) / моя (f) / моё (n) / мои (pl). Igual: твой, твоя, твоё, твои (tu). Para "su" de usted: ваш, ваша, ваше, ваши.',
        ejemplos: [
          { ru: 'мой дом', tr: 'moi dom', es: 'mi casa' },
          { ru: 'моя книга', tr: 'maiá kníga', es: 'mi libro' },
          { ru: 'моё окно', tr: 'maió aknó', es: 'mi ventana' },
        ],
      },
    ],
    vocab: [
      { ru: 'мой', tr: 'moi', es: 'mi (masculino)', cat: 'posesivo' },
      { ru: 'моя', tr: 'maiá', es: 'mi (femenino)', cat: 'posesivo' },
      { ru: 'моё', tr: 'maió', es: 'mi (neutro)', cat: 'posesivo' },
      { ru: 'мои', tr: 'maí', es: 'mis', cat: 'posesivo' },
      { ru: 'твой', tr: 'tvoi', es: 'tu (masculino)', cat: 'posesivo' },
      { ru: 'ваш', tr: 'vash', es: 'su (de usted)', cat: 'posesivo' },
      { ru: 'машина', tr: 'mashýna', es: 'coche', cat: 'sustantivo' },
      { ru: 'улица', tr: 'úlitsa', es: 'calle', cat: 'sustantivo' },
      { ru: 'море', tr: 'mórie', es: 'mar', cat: 'sustantivo' },
      { ru: 'работа', tr: 'rabóta', es: 'trabajo', cat: 'sustantivo' },
      { ru: 'телефон', tr: 'tiliefón', es: 'teléfono', cat: 'sustantivo' },
      { ru: 'квартира', tr: 'kvartíra', es: 'piso, apartamento', cat: 'sustantivo' },
      { ru: 'имя', tr: 'ímia', es: 'nombre', cat: 'sustantivo' },
      { ru: 'день', tr: 'dien', es: 'día', cat: 'sustantivo' },
    ],
    frases: [
      { ru: 'Это моя машина.', tr: 'Éta maiá mashýna.', es: 'Este es mi coche.' },
      { ru: 'Где твой телефон?', tr: '¿Gdie tvoi tiliefón?', es: '¿Dónde está tu teléfono?' },
      { ru: 'Моя квартира там.', tr: 'Maiá kvartíra tam.', es: 'Mi piso está allí.' },
      { ru: 'Как ваше имя?', tr: '¿Kak váshe ímia?', es: '¿Cuál es su nombre?' },
    ],
  },

  {
    id: 'u7',
    emoji: '👨‍👩‍👧',
    nivel: 'A1',
    titulo: 'Familia y personas',
    descripcion: 'Hablar de tu familia y decir "tengo".',
    gramatica: [
      {
        titulo: '"Tener" se dice "en mí hay"',
        texto: 'El ruso no tiene un verbo "tener" normal. Se dice У меня есть… ("junto a mí hay…"). У тебя есть? = ¿Tienes? Para negar: У меня нет + genitivo (У меня нет машины).',
        ejemplos: [
          { ru: 'У меня есть брат.', tr: 'U miniá iest brat.', es: 'Tengo un hermano.' },
          { ru: 'У тебя есть сестра?', tr: '¿U tibiá iest sistrá?', es: '¿Tienes hermana?' },
          { ru: 'У меня нет машины.', tr: 'U miniá niet mashýny.', es: 'No tengo coche.' },
        ],
      },
    ],
    vocab: [
      { ru: 'семья', tr: 'simiá', es: 'familia', cat: 'sustantivo' },
      { ru: 'мать', tr: 'mat', es: 'madre', cat: 'sustantivo' },
      { ru: 'отец', tr: 'atiéts', es: 'padre', cat: 'sustantivo' },
      { ru: 'брат', tr: 'brat', es: 'hermano', cat: 'sustantivo' },
      { ru: 'сестра', tr: 'sistrá', es: 'hermana', cat: 'sustantivo' },
      { ru: 'сын', tr: 'syn', es: 'hijo', cat: 'sustantivo' },
      { ru: 'дочь', tr: 'doch', es: 'hija', cat: 'sustantivo' },
      { ru: 'жена', tr: 'zhyná', es: 'esposa', cat: 'sustantivo' },
      { ru: 'муж', tr: 'mush', es: 'esposo', cat: 'sustantivo' },
      { ru: 'ребёнок', tr: 'ribiónak', es: 'niño, hijo pequeño', cat: 'sustantivo' },
      { ru: 'бабушка', tr: 'bábushka', es: 'abuela', cat: 'sustantivo' },
      { ru: 'дедушка', tr: 'diédushka', es: 'abuelo', cat: 'sustantivo' },
      { ru: 'у меня есть', tr: 'u miniá iest', es: 'yo tengo', cat: 'frase' },
      { ru: 'человек', tr: 'chilaviék', es: 'persona', cat: 'sustantivo' },
    ],
    frases: [
      { ru: 'Это моя семья.', tr: 'Éta maiá simiá.', es: 'Esta es mi familia.' },
      { ru: 'У меня есть брат и сестра.', tr: 'U miniá iest brat i sistrá.', es: 'Tengo un hermano y una hermana.' },
      { ru: 'У тебя есть дети?', tr: '¿U tibiá iest diéti?', es: '¿Tienes hijos?' },
      { ru: 'Мой отец врач.', tr: 'Moi atiéts vrach.', es: 'Mi padre es médico.' },
    ],
  },

  {
    id: 'u8',
    emoji: '🏃',
    nivel: 'A1',
    titulo: 'Verbos en presente',
    descripcion: 'Las dos conjugaciones y los verbos más usados del día a día.',
    gramatica: [
      {
        titulo: 'Primera conjugación (-ать): читать',
        texto: 'Quita -ть y añade las terminaciones: я читаю, ты читаешь, он читает, мы читаем, вы читаете, они читают. Igual funcionan: работать, знать, понимать, делать, слушать.',
        ejemplos: [
          { ru: 'Я читаю книгу.', tr: 'Ya chitáiu knígu.', es: 'Leo un libro.' },
          { ru: 'Ты понимаешь?', tr: '¿Ty panimáiesh?', es: '¿Entiendes?' },
        ],
      },
      {
        titulo: 'Segunda conjugación (-ить): говорить',
        texto: 'я говорю, ты говоришь, он говорит, мы говорим, вы говорите, они говорят. Igual: любить (con truco: я люблю), смотреть, помнить.',
        ejemplos: [
          { ru: 'Я говорю по-русски.', tr: 'Ya gavariú pa-rúski.', es: 'Hablo ruso.' },
          { ru: 'Вы говорите по-испански?', tr: '¿Vy gavarítie pa-ispánski?', es: '¿Habla usted español?' },
        ],
      },
      {
        titulo: 'No hay "estoy leyendo"',
        texto: 'Un solo presente cubre "leo" y "estoy leyendo". Я читаю = leo / estoy leyendo. Una preocupación menos.',
        ejemplos: [
          { ru: 'Что ты делаешь?', tr: '¿Shto ty diélaiesh?', es: '¿Qué haces / estás haciendo?' },
        ],
      },
    ],
    vocab: [
      { ru: 'читать', tr: 'chitát', es: 'leer', cat: 'verbo' },
      { ru: 'работать', tr: 'rabótat', es: 'trabajar', cat: 'verbo' },
      { ru: 'знать', tr: 'znat', es: 'saber, conocer', cat: 'verbo' },
      { ru: 'понимать', tr: 'panimát', es: 'entender', cat: 'verbo' },
      { ru: 'делать', tr: 'diélat', es: 'hacer', cat: 'verbo' },
      { ru: 'говорить', tr: 'gavarít', es: 'hablar, decir', cat: 'verbo' },
      { ru: 'любить', tr: 'liubít', es: 'amar, gustar mucho', cat: 'verbo' },
      { ru: 'жить', tr: 'zhyt', es: 'vivir', cat: 'verbo', nota: 'Irregular: я живу, ты живёшь.' },
      { ru: 'хотеть', tr: 'jatiét', es: 'querer', cat: 'verbo', nota: 'Irregular: я хочу, ты хочешь, они хотят.' },
      { ru: 'идти', tr: 'ittí', es: 'ir (a pie)', cat: 'verbo', nota: 'я иду, ты идёшь.' },
      { ru: 'смотреть', tr: 'smatriét', es: 'mirar, ver', cat: 'verbo' },
      { ru: 'слушать', tr: 'slúshat', es: 'escuchar', cat: 'verbo' },
      { ru: 'по-русски', tr: 'pa-rúski', es: 'en ruso', cat: 'adverbio' },
      { ru: 'немного', tr: 'nimnóga', es: 'un poco', cat: 'adverbio' },
    ],
    frases: [
      { ru: 'Я немного говорю по-русски.', tr: 'Ya nimnóga gavariú pa-rúski.', es: 'Hablo un poco de ruso.' },
      { ru: 'Я не понимаю.', tr: 'Ya nie panimáiu.', es: 'No entiendo.' },
      { ru: 'Повторите, пожалуйста.', tr: 'Paftarítie, pazhálusta.', es: 'Repita, por favor.' },
      { ru: 'Где ты работаешь?', tr: '¿Gdie ty rabótaiesh?', es: '¿Dónde trabajas?' },
      { ru: 'Я живу в Мадриде.', tr: 'Ya zhyvú v Madrídie.', es: 'Vivo en Madrid.' },
    ],
  },

  {
    id: 'u9',
    emoji: '🍽️',
    nivel: 'A1',
    titulo: 'Comida y bebida',
    descripcion: 'Pedir en un café y tu primer caso: el acusativo.',
    gramatica: [
      {
        titulo: 'El acusativo (el objeto directo)',
        texto: 'Cuando la palabra recibe la acción, cambia. Femenino -а → -у (вода → воду, книга → книгу). Masculino de cosa y neutro: NO cambian (чай → чай, молоко → молоко). Con esto ya puedes pedir cualquier cosa.',
        ejemplos: [
          { ru: 'Я хочу воду.', tr: 'Ya jachú vódu.', es: 'Quiero agua.' },
          { ru: 'Я хочу чай.', tr: 'Ya jachú chai.', es: 'Quiero té.' },
          { ru: 'Я читаю книгу.', tr: 'Ya chitáiu knígu.', es: 'Leo un libro.' },
        ],
      },
      {
        titulo: 'Pedir con cortesía',
        texto: 'La fórmula del camarero: [cosa], пожалуйста. O más completa: Можно [cosa], пожалуйста? ("¿se puede…?"). Para pagar: Счёт, пожалуйста.',
        ejemplos: [
          { ru: 'Кофе, пожалуйста.', tr: 'Kófie, pazhálusta.', es: 'Un café, por favor.' },
          { ru: 'Счёт, пожалуйста.', tr: 'Shchot, pazhálusta.', es: 'La cuenta, por favor.' },
        ],
      },
    ],
    vocab: [
      { ru: 'вода', tr: 'vadá', es: 'agua', cat: 'comida' },
      { ru: 'чай', tr: 'chai', es: 'té', cat: 'comida' },
      { ru: 'кофе', tr: 'kófie', es: 'café', cat: 'comida' },
      { ru: 'пиво', tr: 'píva', es: 'cerveza', cat: 'comida' },
      { ru: 'вино', tr: 'vinó', es: 'vino', cat: 'comida' },
      { ru: 'суп', tr: 'sup', es: 'sopa', cat: 'comida' },
      { ru: 'мясо', tr: 'miása', es: 'carne', cat: 'comida' },
      { ru: 'рыба', tr: 'rýba', es: 'pescado', cat: 'comida' },
      { ru: 'сыр', tr: 'syr', es: 'queso', cat: 'comida' },
      { ru: 'яблоко', tr: 'iáblaka', es: 'manzana', cat: 'comida' },
      { ru: 'ресторан', tr: 'ristarán', es: 'restaurante', cat: 'lugar' },
      { ru: 'меню', tr: 'miniú', es: 'menú, carta', cat: 'sustantivo' },
      { ru: 'счёт', tr: 'shchot', es: 'la cuenta', cat: 'sustantivo' },
      { ru: 'вкусно', tr: 'fkúsna', es: 'está rico', cat: 'adjetivo' },
      { ru: 'есть', tr: 'iest', es: 'comer', cat: 'verbo', nota: 'я ем, ты ешь, они едят.' },
      { ru: 'пить', tr: 'pit', es: 'beber', cat: 'verbo', nota: 'я пью, ты пьёшь.' },
    ],
    frases: [
      { ru: 'Я хочу кофе, пожалуйста.', tr: 'Ya jachú kófie, pazhálusta.', es: 'Quiero un café, por favor.' },
      { ru: 'Меню, пожалуйста.', tr: 'Miniú, pazhálusta.', es: 'La carta, por favor.' },
      { ru: 'Это очень вкусно!', tr: '¡Éta óchen fkúsna!', es: '¡Está muy rico!' },
      { ru: 'Счёт, пожалуйста.', tr: 'Shchot, pazhálusta.', es: 'La cuenta, por favor.' },
    ],
  },

  {
    id: 'u10',
    emoji: '🏙️',
    nivel: 'A1',
    titulo: 'En la ciudad',
    descripcion: 'Decir dónde estás y dónde vas: el caso preposicional.',
    gramatica: [
      {
        titulo: 'в / на + preposicional = "dónde estás"',
        texto: 'Para decir el lugar donde algo está, la palabra suele terminar en -е: Москва → в Москве, театр → в театре, работа → на работе. в = dentro de un espacio; на = encima o en eventos y sitios abiertos (на работе, на почте, на улице).',
        ejemplos: [
          { ru: 'Я в Москве.', tr: 'Ya v Maskvié.', es: 'Estoy en Moscú.' },
          { ru: 'Она на работе.', tr: 'Aná na rabótie.', es: 'Ella está en el trabajo.' },
          { ru: 'Книга в сумке.', tr: 'Kníga f súmkie.', es: 'El libro está en el bolso.' },
        ],
      },
      {
        titulo: 'Orientarse',
        texto: 'справа (a la derecha), слева (a la izquierda), прямо (recto), рядом (al lado), далеко (lejos), близко (cerca).',
        ejemplos: [
          { ru: 'Идите прямо.', tr: 'Idítie priáma.', es: 'Vaya recto.' },
          { ru: 'Это далеко?', tr: '¿Éta dalikó?', es: '¿Está lejos?' },
        ],
      },
    ],
    vocab: [
      { ru: 'магазин', tr: 'magazín', es: 'tienda', cat: 'lugar' },
      { ru: 'аптека', tr: 'aptiéka', es: 'farmacia', cat: 'lugar' },
      { ru: 'банк', tr: 'bank', es: 'banco', cat: 'lugar' },
      { ru: 'гостиница', tr: 'gastínitsa', es: 'hotel', cat: 'lugar' },
      { ru: 'аэропорт', tr: 'aerapórt', es: 'aeropuerto', cat: 'lugar' },
      { ru: 'парк', tr: 'park', es: 'parque', cat: 'lugar' },
      { ru: 'театр', tr: 'tiátr', es: 'teatro', cat: 'lugar' },
      { ru: 'площадь', tr: 'plóshchat', es: 'plaza', cat: 'lugar' },
      { ru: 'справа', tr: 'správa', es: 'a la derecha', cat: 'adverbio' },
      { ru: 'слева', tr: 'sliéva', es: 'a la izquierda', cat: 'adverbio' },
      { ru: 'прямо', tr: 'priáma', es: 'recto', cat: 'adverbio' },
      { ru: 'далеко', tr: 'dalikó', es: 'lejos', cat: 'adverbio' },
      { ru: 'близко', tr: 'blíska', es: 'cerca', cat: 'adverbio' },
      { ru: 'автобус', tr: 'aftóbus', es: 'autobús', cat: 'transporte' },
      { ru: 'такси', tr: 'taksí', es: 'taxi', cat: 'transporte' },
      { ru: 'билет', tr: 'biliét', es: 'billete', cat: 'sustantivo' },
    ],
    frases: [
      { ru: 'Где здесь аптека?', tr: '¿Gdie zdies aptiéka?', es: '¿Dónde hay una farmacia por aquí?' },
      { ru: 'Аптека справа.', tr: 'Aptiéka správa.', es: 'La farmacia está a la derecha.' },
      { ru: 'Я в гостинице.', tr: 'Ya v gastínitsie.', es: 'Estoy en el hotel.' },
      { ru: 'Сколько стоит билет?', tr: '¿Skólka stóit biliét?', es: '¿Cuánto cuesta el billete?' },
    ],
  },

  {
    id: 'u11',
    emoji: '🕐',
    nivel: 'A1',
    titulo: 'Tiempo y rutina',
    descripcion: 'Días de la semana, momentos del día y cuándo pasan las cosas.',
    gramatica: [
      {
        titulo: 'Los días de la semana',
        texto: 'понедельник, вторник, среда, четверг, пятница, суббота, воскресенье. Para decir "el lunes": в понедельник, во вторник, в среду… (con в + acusativo). Se escriben en minúscula.',
        ejemplos: [
          { ru: 'В понедельник я работаю.', tr: 'F panidiélnik ya rabótaiu.', es: 'El lunes trabajo.' },
          { ru: 'Сегодня среда.', tr: 'Sivódnia sridá.', es: 'Hoy es miércoles.' },
        ],
      },
      {
        titulo: 'Momentos del día',
        texto: 'утром (por la mañana), днём (por la tarde temprano), вечером (por la noche), ночью (de madrugada). Fíjate: son la misma palabra que утро, день, вечер, ночь con otra terminación.',
        ejemplos: [
          { ru: 'Утром я пью кофе.', tr: 'Útram ya piu kófie.', es: 'Por la mañana bebo café.' },
          { ru: 'Вечером я дома.', tr: 'Viécheram ya dóma.', es: 'Por la noche estoy en casa.' },
        ],
      },
    ],
    vocab: [
      { ru: 'сегодня', tr: 'sivódnia', es: 'hoy', cat: 'tiempo', nota: 'La г se pronuncia "v".' },
      { ru: 'завтра', tr: 'záftra', es: 'mañana (día)', cat: 'tiempo' },
      { ru: 'вчера', tr: 'fchirá', es: 'ayer', cat: 'tiempo' },
      { ru: 'утро', tr: 'útra', es: 'mañana (parte del día)', cat: 'tiempo' },
      { ru: 'вечер', tr: 'viécher', es: 'tarde-noche', cat: 'tiempo' },
      { ru: 'ночь', tr: 'noch', es: 'noche', cat: 'tiempo' },
      { ru: 'неделя', tr: 'nidiélia', es: 'semana', cat: 'tiempo' },
      { ru: 'месяц', tr: 'miésiats', es: 'mes', cat: 'tiempo' },
      { ru: 'год', tr: 'got', es: 'año', cat: 'tiempo' },
      { ru: 'понедельник', tr: 'panidiélnik', es: 'lunes', cat: 'día' },
      { ru: 'вторник', tr: 'ftórnik', es: 'martes', cat: 'día' },
      { ru: 'среда', tr: 'sridá', es: 'miércoles', cat: 'día' },
      { ru: 'четверг', tr: 'chitviérk', es: 'jueves', cat: 'día' },
      { ru: 'пятница', tr: 'piátnitsa', es: 'viernes', cat: 'día' },
      { ru: 'суббота', tr: 'subóta', es: 'sábado', cat: 'día' },
      { ru: 'воскресенье', tr: 'vaskrisiénie', es: 'domingo', cat: 'día' },
    ],
    frases: [
      { ru: 'Какой сегодня день?', tr: '¿Kakói sivódnia dien?', es: '¿Qué día es hoy?' },
      { ru: 'Сегодня пятница.', tr: 'Sivódnia piátnitsa.', es: 'Hoy es viernes.' },
      { ru: 'Завтра я не работаю.', tr: 'Záftra ya nie rabótaiu.', es: 'Mañana no trabajo.' },
      { ru: 'Утром я пью кофе.', tr: 'Útram ya piu kófie.', es: 'Por la mañana tomo café.' },
    ],
  },

  {
    id: 'u12',
    emoji: '🧳',
    nivel: 'A1',
    titulo: 'Frases de supervivencia',
    descripcion: 'Lo que necesitas si mañana aterrizas en Moscú.',
    gramatica: [
      {
        titulo: 'Negar es muy fácil',
        texto: 'Pon не delante del verbo: Я не понимаю, Я не знаю, Я не говорю по-русски. Y ojo: la doble negación es obligatoria — Я ничего не понимаю ("no entiendo nada").',
        ejemplos: [
          { ru: 'Я не знаю.', tr: 'Ya nie znáiu.', es: 'No sé.' },
          { ru: 'Я ничего не понимаю.', tr: 'Ya nichivó nie panimáiu.', es: 'No entiendo nada.' },
        ],
      },
      {
        titulo: 'Pedir ayuda',
        texto: 'Помогите! (¡ayuda!), Помедленнее, пожалуйста (más despacio, por favor), Вы говорите по-английски? (¿habla inglés?).',
        ejemplos: [
          { ru: 'Помогите, пожалуйста!', tr: '¡Pamagítie, pazhálusta!', es: '¡Ayúdeme, por favor!' },
        ],
      },
    ],
    vocab: [
      { ru: 'помогите', tr: 'pamagítie', es: 'ayúdeme', cat: 'frase' },
      { ru: 'я не знаю', tr: 'ya nie znáiu', es: 'no sé', cat: 'frase' },
      { ru: 'я не понимаю', tr: 'ya nie panimáiu', es: 'no entiendo', cat: 'frase' },
      { ru: 'повторите', tr: 'paftarítie', es: 'repita', cat: 'frase' },
      { ru: 'помедленнее', tr: 'pamiédlienieie', es: 'más despacio', cat: 'frase' },
      { ru: 'можно', tr: 'mózhna', es: 'se puede / ¿puedo?', cat: 'frase' },
      { ru: 'нельзя', tr: 'nilziá', es: 'no se puede', cat: 'frase' },
      { ru: 'хорошо', tr: 'jarashó', es: 'bien, vale', cat: 'adverbio' },
      { ru: 'плохо', tr: 'plója', es: 'mal', cat: 'adverbio' },
      { ru: 'конечно', tr: 'kaniéshna', es: 'claro, por supuesto', cat: 'adverbio', nota: 'чн se pronuncia "shn".' },
      { ru: 'паспорт', tr: 'pásport', es: 'pasaporte', cat: 'sustantivo' },
      { ru: 'деньги', tr: 'diéngui', es: 'dinero', cat: 'sustantivo' },
      { ru: 'врач', tr: 'vrach', es: 'médico', cat: 'sustantivo' },
      { ru: 'полиция', tr: 'palítsyia', es: 'policía', cat: 'sustantivo' },
    ],
    frases: [
      { ru: 'Извините, вы говорите по-английски?', tr: 'Izvinítie, ¿vy gavarítie pa-anglíski?', es: 'Perdone, ¿habla usted inglés?' },
      { ru: 'Помедленнее, пожалуйста.', tr: 'Pamiédlienieie, pazhálusta.', es: 'Más despacio, por favor.' },
      { ru: 'Мне нужен врач.', tr: 'Mnie núzhen vrach.', es: 'Necesito un médico.' },
      { ru: 'Я не говорю по-русски.', tr: 'Ya nie gavariú pa-rúski.', es: 'No hablo ruso.' },
    ],
  },
];

// Índice plano de todo el vocabulario, con id estable para el sistema de repaso.
export const TODO_VOCAB = UNIDADES.flatMap((u) =>
  u.vocab.map((v) => ({ ...v, id: `${u.id}:${v.ru}`, unidad: u.id, unidadTitulo: u.titulo }))
);

export const TODAS_FRASES = UNIDADES.flatMap((u) =>
  u.frases.map((f) => ({ ...f, id: `${u.id}:frase:${f.ru}`, unidad: u.id }))
);

export function unidadPorId(id) {
  return UNIDADES.find((u) => u.id === id);
}
