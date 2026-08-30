# Русский — app para aprender ruso desde cero

Una aplicación tipo Duolingo/Busuu para **hispanohablantes que empiezan el ruso desde cero**,
con **repetición espaciada** y un **tutor de IA que corre en tu propio dispositivo**
(Ollama en el ordenador, apps tipo LM Pocket en el iPhone).

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

---

## 2. Cómo se usa (el plan de estudio)

1. **Empieza por el alfabeto.** Son 33 letras y en un par de sesiones lees cirílico.
   Fíjate en las letras naranjas: son las trampas (В suena "v", Н suena "n", Р suena "r"…).
2. **Haz una unidad.** Cada una tiene gramática explicada en español, vocabulario con audio
   y una tanda de ejercicios.
3. **Haz el repaso diario.** Es lo más importante: 5 minutos al día valen más que 2 horas
   el domingo. La app calcula qué palabras estás a punto de olvidar y te las pregunta justo
   ese día (algoritmo de repetición espaciada, el mismo principio que Anki).
4. **Habla con el tutor** cuando tengas dudas o quieras practicar frases libres (necesita IA).

### Lo que hay dentro

| | |
|---|---|
| **12 unidades** | del A0 al A1: saludos, pronombres, preguntas, números, género, familia, verbos en presente, comida y acusativo, la ciudad y el preposicional, tiempo y rutina, frases de supervivencia |
| **178 palabras** | con pronunciación figurada para españoles y audio |
| **51 frases** | de uso real, listas para copiar |
| **Alfabeto completo** | las 33 letras con nombre, sonido, ejemplo y mini-juego |
| **5 tipos de ejercicio** | ruso→español, español→ruso, escucha, escribir en cirílico (con teclado ruso en pantalla) y ordenar frases |

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
  lessons.js            las 12 unidades: gramática, vocabulario y frases
js/
  app.js                arranque y navegación
  store.js              guardado del progreso (localStorage)
  srs.js                repetición espaciada
  exercises.js          generador de ejercicios
  player.js             el reproductor de ejercicios
  ai.js                 cliente de modelos locales
  tts.js                pronunciación
  ui.js                 utilidades (incluye el teclado cirílico)
  views/                una pantalla por archivo
```

No hay dependencias, ni `npm install`, ni compilación. Es JavaScript de navegador tal cual,
para que puedas abrir cualquier archivo y entender qué hace.

### Añadir tu propio vocabulario

Edita `data/lessons.js` y añade palabras al array `vocab` de una unidad:

```js
{ ru: 'солнце', tr: 'sóntse', es: 'sol', cat: 'sustantivo' },
```

Los ejercicios y el repaso se generan solos a partir de ahí. Para una unidad nueva, copia el
bloque de una existente y cámbiale el `id`.

---

## 6. Problemas frecuentes

| Síntoma | Solución |
|---|---|
| La página sale en blanco al abrir `index.html` con doble clic | Arranca `python3 server.py` y entra por `http://localhost:8000` |
| «No pude conectar con la IA» | ¿Está Ollama arrancado? Prueba `curl http://localhost:11434/v1/models`. Y usa el preset «Proxy de esta app» |
| No suena el audio | Instala la voz rusa (sección 4). En iPhone, el primer sonido requiere que toques la pantalla antes |
| Desde el móvil no carga | Los dos aparatos deben estar en la misma wifi; usa la IP que muestra el servidor, no `localhost`. Puede que el cortafuegos del PC pida permiso |
| Los ejercicios de IA fallan o salen raros | Los modelos pequeños se atragantan con el JSON. Prueba uno de 7B o más, o usa la práctica normal |
| Perdí el progreso | Se guarda en el navegador: borrar datos del navegador lo elimina. Haz copias en Ajustes → Exportar |

---

## 7. Aviso honesto sobre la IA local

Los modelos pequeños (3B–8B) saben bastante español, pero **cometen errores en ruso**:
acentos mal puestos, alguna declinación inventada. Están muy bien para practicar y resolver
dudas, pero **el contenido fiable es el del curso** (`data/lessons.js`), revisado a mano.
Si el tutor y la lección se contradicen, hazle caso a la lección.

Удачи! (udáchi — ¡suerte!) 🇷🇺
