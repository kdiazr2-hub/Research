# Русский — app para aprender ruso desde cero

Una aplicación tipo Duolingo/Busuu para **hispanohablantes**, con el curso completo
**del alfabeto (A0) al nivel avanzado (C1)**: 46 unidades, 752 palabras y 182 frases.
Incluye **repetición espaciada**, **16 diálogos que puedes actuar en voz alta**,
**práctica de pronunciación con tu voz** y **conversación libre con una IA que corre en
tu propio dispositivo** (Ollama en el ordenador, apps tipo LM Pocket en el iPhone).

- Funciona **sin internet** y **sin cuenta**: tu progreso se guarda solo en tu navegador.
- Se instala como app en el iPhone y en el PC (es una PWA).
- La IA es **opcional**: el curso entero funciona sin ella.

---

## 1. Ponerla en marcha (2 minutos)

Necesitas Python 3 **o** Node.js. Ya tienes uno de los dos casi seguro.

```bash
git clone <la-url-de-este-repositorio>
cd <la-carpeta>

python3 server.py          # opción A
node server.js             # opción B
```

Verás algo así:

```
  Русский — app para aprender ruso
  ────────────────────────────────────────────
  En este equipo:   http://localhost:8000
  Desde el móvil:   http://192.168.1.42:8000
  Puente hacia IA:  http://localhost:11434/v1  (preset «Proxy de esta app»)
```

Abre `http://localhost:8000` en el navegador y ya estás dentro.

> **¿Por qué un servidor y no abrir el archivo directamente?**
> Al abrir `index.html` con doble clic el navegador bloquea partes de la app (los módulos de
> JavaScript y el modo sin conexión). Con el servidor incluido funciona todo.

### Instalarla como app

- **iPhone/iPad:** abre la dirección en **Safari** → botón compartir → *Añadir a pantalla de inicio*.
- **Android:** Chrome → menú → *Instalar aplicación*.
- **PC/Mac:** Chrome o Edge → icono de instalar en la barra de direcciones.

Una vez instalada funciona aunque apagues el servidor o te quedes sin cobertura.

**Actualizarla:** haz `git pull` y abre la app; con el servidor en marcha se actualiza sola al
entrar. Puedes confirmar qué versión tienes en Ajustes → Versión y contenido, donde también
está el botón de forzar la actualización si algo se queda pegado.

---

## 2. Cómo se usa (el plan de estudio)

1. **Empieza por el alfabeto.** Son 33 letras y en un par de sesiones lees cirílico.
   Fíjate en las letras naranjas: son las trampas (В suena "v", Н suena "n", Р suena "r"…).
2. **Haz una unidad.** Cada una tiene gramática explicada en español, vocabulario con audio
   y una tanda de ejercicios.
3. **Haz el repaso diario.** Es lo más importante: 5 minutos al día valen más que 2 horas
   el domingo. La app calcula qué palabras estás a punto de olvidar y te las pregunta justo
   ese día (algoritmo de repetición espaciada, el mismo principio que Anki).
4. **Habla en voz alta.** Todo lo que te hace producir está en la pestaña **Hablar**:
   - **Diálogos:** escucha la conversación entera, luego elige un papel y dilo tú. La app lee
     las líneas del otro personaje y te puntúa las tuyas.
   - **Conversación con IA:** eliges una situación y el modelo local conversa contigo solo en
     ruso, por texto o por micrófono. Al terminar te corrige en español todo lo que dijiste.
   - **Pronunciación:** frases sueltas de tu nivel para leer en voz alta.
   Es lo que más acelera el paso de entender a hablar, y casi nadie lo entrena.
5. **Consulta, no memorices.** Los casos y las conjugaciones están en «Gramática» y «Verbos» para
   mirarlos mil veces; se acaban aprendiendo solos.
6. **Habla con el tutor** cuando tengas dudas o quieras practicar frases libres (necesita IA).

> **Ajusta tu nivel** en Ajustes → Tu nivel. No bloquea nada del curso: sirve para que el tutor
> te hable a tu altura y para que la práctica rápida y la de pronunciación no te suelten
> vocabulario de C1 en tu tercer día.

### El curso, nivel a nivel

| Nivel | Unidades | Qué aprendes |
|---|---|---|
| **A0** Primeros pasos | 1–4 | Alfabeto, primeras palabras, saludos, pronombres (y por qué "ser" no existe), preguntar |
| **A1** Principiante | 5–12 | Números, género, familia y «tener», presente de los dos grupos, comida y acusativo, la ciudad y el preposicional, tiempo, supervivencia |
| **A2** Básico | 13–22 | Pasado, futuro, **el aspecto verbal**, genitivo, dativo, instrumental, verbos de movimiento, imperativo, comparativos, reflexivos |
| **B1** Intermedio | 23–32 | Aspecto en profundidad, prefijos de movimiento, condicional con бы, subordinadas, fechas y horas, régimen verbal, trabajo, salud, viajes, trámites |
| **B2** Intermedio alto | 33–40 | Participios activos y pasivos, gerundios, pasiva e impersonales, partículas modales, discusión, formación de palabras, registros |
| **C1** Avanzado | 41–46 | Matices del aspecto, colocaciones, fraseología y refranes, prensa, ciencia y tecnología, lengua literaria |

Y además:

| | |
|---|---|
| **752 palabras** | con pronunciación figurada para españoles y audio |
| **16 diálogos** | conversaciones enteras de A0 a C1: escúchalas seguidas y luego actúa uno de los dos papeles hablando tú |
| **10 situaciones de role-play** | la IA local hace de camarero, taxista, médico o entrevistador, habla solo en ruso y al terminar te corrige |
| **182 frases** | de uso real, listas para copiar |
| **Alfabeto completo** | las 33 letras con nombre, sonido, ejemplo y mini-juego |
| **Gramática de consulta** | los 6 casos, 8 tablas de declinación y conjugación, y los errores típicos de un hispanohablante |
| **Conjugador** | 51 verbos esenciales conjugados enteros (presente, pasado, futuro, imperativo) |
| **7 tipos de ejercicio** | ruso→español, español→ruso, escucha, escribir en cirílico (con teclado ЙЦУКЕН), ordenar frases, conjugar verbos y **traducción libre** |
| **Práctica de pronunciación** | el dispositivo te escucha y te puntúa de 0 a 100 |

---

## 3. Conectar la IA local (opcional pero divertido)

Con un modelo local desbloqueas: **tutor conversacional**, **explicaciones a medida**,
**ejercicios generados infinitos** y **diálogos** con el vocabulario que estás estudiando.

Todo ocurre en tu máquina: la app solo habla con la dirección que tú le indiques.

### En el ordenador con Ollama (lo más fácil)

```bash
# 1. Instala Ollama desde https://ollama.com
# 2. Descarga un modelo (elige según tu RAM)
ollama pull qwen2.5:7b-instruct      # ~5 GB, buen español y algo de ruso
ollama pull llama3.2:3b              # ~2 GB, para equipos justos
ollama pull qwen2.5:14b-instruct     # ~9 GB, notablemente mejor si tienes RAM

# 3. Arranca la app y Ollama, y listo
python3 server.py
```

En la app: **Ajustes → IA local → activar → «Buscar automáticamente»**. Debería encontrar
el preset **«Proxy de esta app»** (`/api/ia/v1`), que es el que menos problemas da.

> **Sobre CORS:** si prefieres que el navegador hable directamente con Ollama
> (preset «Ollama en este mismo PC»), tienes que arrancarlo permitiéndolo:
> `OLLAMA_ORIGINS="*" ollama serve` (Mac/Linux) o
> `$env:OLLAMA_ORIGINS="*"; ollama serve` (Windows PowerShell).
> Usando el proxy de la app no hace falta nada de esto.

### En el iPhone

Dos caminos:

- **A) Modelo dentro del iPhone.** Apps como *LM Pocket*, *PocketPal* o *Enclave* permiten
  descargar modelos pequeños y activar un **servidor local compatible con OpenAI**. Activa esa
  opción, mira qué puerto usa (suele ser `8080` o `1234`) y ponlo en Ajustes como
  `http://localhost:PUERTO/v1`. Funciona en avión, sin conexión.
  *Ojo:* no todas las apps del App Store exponen ese servidor, y el nombre de la opción cambia
  entre versiones. Si la tuya no lo tiene, usa la opción B.
- **B) Modelo en el PC, estudias en el móvil.** Deja `python3 server.py` corriendo en el
  ordenador y, desde el iPhone en la misma wifi, abre `http://IP-DE-TU-PC:8000`. La app y el
  modelo van por la misma dirección, sin configurar nada más. Es lo que mejor funciona.

### Cualquier otro servidor

Vale cualquier cosa que hable el formato de OpenAI (`POST /chat/completions`):
LM Studio (`http://localhost:1234/v1`), llama.cpp (`http://localhost:8080/v1`), etc.
Ajustes → «Otro servidor compatible con OpenAI» → pega la URL.

---

## 4. El audio

La pronunciación usa la voz del propio sistema (no descarga nada). Si no oyes nada o suena
con acento español, instala la voz rusa:

- **iPhone/iPad:** Ajustes → Accesibilidad → Contenido hablado → Voces → Ruso (Milena).
- **Windows:** Configuración → Hora e idioma → Idioma → añadir «Русский» con voz.
- **Mac:** Ajustes → Accesibilidad → Contenido hablado → Gestionar voces → Ruso.
- **Android:** Ajustes → Sistema → Idiomas → Salida de texto a voz → paquete de ruso.

En Ajustes hay un botón para probarlo.

---

## 5. Estructura del proyecto

```
index.html              la página (una sola)
manifest.webmanifest    para poder instalarla como app
sw.js                   modo sin conexión
server.py / server.js   servidor + puente hacia la IA (elige el que quieras)
css/styles.css          todos los estilos
data/
  alphabet.js           las 33 letras
  lessons.js            índice del curso (une los niveles y calcula los índices)
  gramatica.js          los 6 casos y las tablas de declinación
  verbos.js             51 verbos conjugados
  dialogos.js           16 diálogos graduados
  curso/
    a0-a1.js            unidades 1–12
    a2.js               unidades 13–22
    b1.js               unidades 23–32
    b2.js               unidades 33–40
    c1.js               unidades 41–46
js/
  app.js                arranque y navegación
  store.js              guardado del progreso (localStorage)
  srs.js                repetición espaciada
  exercises.js          generador de ejercicios
  player.js             el reproductor de ejercicios
  ai.js                 cliente de modelos locales
  tts.js                pronunciación (el dispositivo habla)
  speech.js             reconocimiento de voz (el dispositivo te escucha)
  ui.js                 utilidades (incluye el teclado cirílico)
  views/                una pantalla por archivo
verificar.mjs           comprueba que el contenido esté completo y bien escrito
```

No hay dependencias, ni `npm install`, ni compilación. Es JavaScript de navegador tal cual,
para que puedas abrir cualquier archivo y entender qué hace.

### Añadir tu propio vocabulario

Edita el archivo del nivel que quieras dentro de `data/curso/` y añade palabras al array
`vocab` de una unidad:

```js
{ ru: 'солнце', tr: 'sóntse', es: 'sol', cat: 'sustantivo' },
```

Los ejercicios y el repaso se generan solos a partir de ahí. Para una unidad nueva, copia el
bloque de una existente y cámbiale el `id`. Los diálogos se añaden igual en `data/dialogos.js`.

Después de tocar cualquier archivo de `data/`, pasa el verificador:

```bash
node verificar.mjs
```

Comprueba que no falte ningún campo, que los ids no se repitan y que no se haya colado
ningún carácter de otro alfabeto al copiar y pegar (pasa más de lo que parece).

---

## 6. Problemas frecuentes

| Síntoma | Solución |
|---|---|
| La página sale en blanco al abrir `index.html` con doble clic | Arranca `python3 server.py` y entra por `http://localhost:8000` |
| «No pude conectar con la IA» | ¿Está Ollama arrancado? Prueba `curl http://localhost:11434/v1/models`. Y usa el preset «Proxy de esta app» |
| No suena el audio | Instala la voz rusa (sección 4). En iPhone, el primer sonido requiere que toques la pantalla antes |
| Desde el móvil no carga | Los dos aparatos deben estar en la misma wifi; usa la IP que muestra el servidor, no `localhost`. Puede que el cortafuegos del PC pida permiso |
| Los ejercicios de IA fallan o salen raros | Los modelos pequeños se atragantan con el JSON. Prueba uno de 7B o más, o usa la práctica normal |
| El micrófono no me escucha | El reconocimiento de voz solo va en Chrome, Edge y Safari, necesita permiso de micrófono y, en algunos navegadores, conexión a internet. Si no está disponible la app te deja autoevaluarte |
| En la conversación el modelo me contesta en español | Los modelos pequeños se saltan la instrucción de "solo ruso". Prueba con uno de 7B o más; con 3B pasa a menudo |
| Perdí el progreso | Se guarda en el navegador: borrar datos del navegador lo elimina. Haz copias en Ajustes → Exportar |
| Actualicé el código pero sigo viendo la versión antigua | Mira **Ajustes → Versión y contenido**: ahí ves qué versión tienes cargada. Si no coincide, pulsa **Forzar actualización** (borra la copia local del programa, no tu progreso). En el iPhone, cierra antes la app del todo deslizándola fuera del multitarea |

---

## 7. Aviso honesto sobre la IA local

Los modelos pequeños (3B–8B) saben bastante español, pero **cometen errores en ruso**:
acentos mal puestos, alguna declinación inventada. Están muy bien para practicar y resolver
dudas, pero **el contenido fiable es el del curso** (`data/curso/`), escrito y revisado a mano.
Si el tutor y la lección se contradicen, hazle caso a la lección.

Lo mismo vale para la corrección de traducciones libres: la IA acepta versiones alternativas
válidas, que es justo lo que quieres para aprender a construir frases, pero de vez en cuando
se equivocará en un matiz. La frase del curso siempre se te muestra al lado.

Удачи! (udáchi — ¡suerte!) 🇷🇺
