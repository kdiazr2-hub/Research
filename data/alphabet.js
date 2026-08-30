// Alfabeto cirílico ruso: 33 letras.
// tipo: "facil"  = se parece a la latina y suena parecido
//       "trampa" = se parece a la latina pero suena distinto (¡falsos amigos!)
//       "nueva"  = no se parece a ninguna letra latina
export const ALFABETO = [
  { mayus: 'А', minus: 'а', nombre: 'а',            sonido: 'a como en "casa"',                    lat: 'a',    tipo: 'facil',  ejemplo: 'мама',      ejemploEs: 'mamá' },
  { mayus: 'Б', minus: 'б', nombre: 'бэ',           sonido: 'b como en "bota"',                    lat: 'b',    tipo: 'nueva',  ejemplo: 'банк',      ejemploEs: 'banco' },
  { mayus: 'В', minus: 'в', nombre: 'вэ',           sonido: 'v labiodental (como la "v" inglesa)', lat: 'v',    tipo: 'trampa', ejemplo: 'вода',      ejemploEs: 'agua' },
  { mayus: 'Г', minus: 'г', nombre: 'гэ',           sonido: 'g como en "gato" (nunca como "gi")',  lat: 'g',    tipo: 'nueva',  ejemplo: 'город',     ejemploEs: 'ciudad' },
  { mayus: 'Д', minus: 'д', nombre: 'дэ',           sonido: 'd como en "dedo"',                    lat: 'd',    tipo: 'nueva',  ejemplo: 'дом',       ejemploEs: 'casa' },
  { mayus: 'Е', minus: 'е', nombre: 'е',            sonido: '"ye" como en "hielo"',                lat: 'ye',   tipo: 'trampa', ejemplo: 'нет',       ejemploEs: 'no' },
  { mayus: 'Ё', minus: 'ё', nombre: 'ё',            sonido: '"yo"; siempre lleva el acento',       lat: 'yo',   tipo: 'nueva',  ejemplo: 'ёлка',      ejemploEs: 'abeto' },
  { mayus: 'Ж', minus: 'ж', nombre: 'жэ',           sonido: 'como la "j" francesa de "jour"',      lat: 'zh',   tipo: 'nueva',  ejemplo: 'жить',      ejemploEs: 'vivir' },
  { mayus: 'З', minus: 'з', nombre: 'зэ',           sonido: 's sonora, como zumbido de abeja',     lat: 'z',    tipo: 'nueva',  ejemplo: 'зима',      ejemploEs: 'invierno' },
  { mayus: 'И', minus: 'и', nombre: 'и',            sonido: 'i como en "isla"',                    lat: 'i',    tipo: 'nueva',  ejemplo: 'имя',       ejemploEs: 'nombre' },
  { mayus: 'Й', minus: 'й', nombre: 'и краткое',    sonido: 'i corta, como la "y" de "hay"',       lat: 'y',    tipo: 'nueva',  ejemplo: 'чай',       ejemploEs: 'té' },
  { mayus: 'К', minus: 'к', nombre: 'ка',           sonido: 'k como en "kilo"',                    lat: 'k',    tipo: 'facil',  ejemplo: 'кот',       ejemploEs: 'gato' },
  { mayus: 'Л', minus: 'л', nombre: 'эль',          sonido: 'l, algo más "gruesa" que la española',lat: 'l',    tipo: 'nueva',  ejemplo: 'лампа',     ejemploEs: 'lámpara' },
  { mayus: 'М', minus: 'м', nombre: 'эм',           sonido: 'm como en "mano"',                    lat: 'm',    tipo: 'facil',  ejemplo: 'море',      ejemploEs: 'mar' },
  { mayus: 'Н', minus: 'н', nombre: 'эн',           sonido: 'n como en "nada"',                    lat: 'n',    tipo: 'trampa', ejemplo: 'нос',       ejemploEs: 'nariz' },
  { mayus: 'О', minus: 'о', nombre: 'о',            sonido: 'o; sin acento suena casi "a"',        lat: 'o',    tipo: 'facil',  ejemplo: 'окно',      ejemploEs: 'ventana' },
  { mayus: 'П', minus: 'п', nombre: 'пэ',           sonido: 'p como en "pan"',                     lat: 'p',    tipo: 'nueva',  ejemplo: 'папа',      ejemploEs: 'papá' },
  { mayus: 'Р', minus: 'р', nombre: 'эр',           sonido: 'r vibrante, como "pero"',             lat: 'r',    tipo: 'trampa', ejemplo: 'рука',      ejemploEs: 'mano' },
  { mayus: 'С', minus: 'с', nombre: 'эс',           sonido: 's como en "sol"',                     lat: 's',    tipo: 'trampa', ejemplo: 'сыр',       ejemploEs: 'queso' },
  { mayus: 'Т', minus: 'т', nombre: 'тэ',           sonido: 't como en "taza"',                    lat: 't',    tipo: 'facil',  ejemplo: 'там',       ejemploEs: 'allí' },
  { mayus: 'У', minus: 'у', nombre: 'у',            sonido: 'u como en "luna"',                    lat: 'u',    tipo: 'trampa', ejemplo: 'утро',      ejemploEs: 'mañana' },
  { mayus: 'Ф', minus: 'ф', nombre: 'эф',           sonido: 'f como en "foto"',                    lat: 'f',    tipo: 'nueva',  ejemplo: 'фильм',     ejemploEs: 'película' },
  { mayus: 'Х', minus: 'х', nombre: 'ха',           sonido: 'j española de "jamón"',               lat: 'j',    tipo: 'trampa', ejemplo: 'хлеб',      ejemploEs: 'pan' },
  { mayus: 'Ц', minus: 'ц', nombre: 'цэ',           sonido: '"ts", como "pizza" en italiano',      lat: 'ts',   tipo: 'nueva',  ejemplo: 'центр',     ejemploEs: 'centro' },
  { mayus: 'Ч', minus: 'ч', nombre: 'че',           sonido: 'ch como en "chico"',                  lat: 'ch',   tipo: 'nueva',  ejemplo: 'человек',   ejemploEs: 'persona' },
  { mayus: 'Ш', minus: 'ш', nombre: 'ша',           sonido: 'sh dura, como "shhh"',                lat: 'sh',   tipo: 'nueva',  ejemplo: 'школа',     ejemploEs: 'escuela' },
  { mayus: 'Щ', minus: 'щ', nombre: 'ща',           sonido: 'sh larga y suave',                    lat: 'shch', tipo: 'nueva',  ejemplo: 'борщ',      ejemploEs: 'borsch' },
  { mayus: 'Ъ', minus: 'ъ', nombre: 'твёрдый знак', sonido: 'signo duro: no suena, separa sílabas',lat: '"',    tipo: 'nueva',  ejemplo: 'подъезд',   ejemploEs: 'portal' },
  { mayus: 'Ы', minus: 'ы', nombre: 'ы',            sonido: 'i gutural, entre "i" y "u"',          lat: 'y',    tipo: 'nueva',  ejemplo: 'мы',        ejemploEs: 'nosotros' },
  { mayus: 'Ь', minus: 'ь', nombre: 'мягкий знак',  sonido: 'signo blando: ablanda la letra previa',lat: "'",   tipo: 'nueva',  ejemplo: 'мать',      ejemploEs: 'madre' },
  { mayus: 'Э', minus: 'э', nombre: 'э оборотное',  sonido: 'e abierta como en "café"',            lat: 'e',    tipo: 'nueva',  ejemplo: 'это',       ejemploEs: 'esto' },
  { mayus: 'Ю', minus: 'ю', nombre: 'ю',            sonido: '"yu" como en "yunque"',               lat: 'yu',   tipo: 'nueva',  ejemplo: 'юг',        ejemploEs: 'sur' },
  { mayus: 'Я', minus: 'я', nombre: 'я',            sonido: '"ya" como en "ya"',                   lat: 'ya',   tipo: 'nueva',  ejemplo: 'я',         ejemploEs: 'yo' },
];

// Notas de pronunciación que se muestran en la sección de alfabeto.
export const NOTAS_PRONUNCIACION = [
  {
    titulo: 'La "о" átona suena "a"',
    texto: 'En ruso solo hay UNA sílaba acentuada por palabra y las demás se reducen. La "о" sin acento se pronuncia casi como una "a": молоко se lee "malakó", хорошо se lee "jarashó".'
  },
  {
    titulo: 'Consonantes duras y blandas',
    texto: 'Cada consonante tiene versión dura y blanda. Las vocales е, ё, и, ю, я y el signo ь ablandan la consonante anterior (suena como si añadieras una "i" muy corta): нет ≈ "niet", мать ≈ "mat\'".'
  },
  {
    titulo: 'Ensordecimiento final',
    texto: 'Las consonantes sonoras al final de palabra se ensordecen: хлеб se lee "jlep", город se lee "górat", муж se lee "mush".'
  },
  {
    titulo: 'Falsos amigos visuales',
    texto: 'Cuidado con В (=v), Н (=n), Р (=r), С (=s), У (=u), Х (=j). Se parecen a letras latinas pero suenan diferente. Son el error nº1 de los principiantes.'
  },
];
