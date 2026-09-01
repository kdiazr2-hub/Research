// Diálogos graduados. La pieza que faltaba: frases sueltas no enseñan a
// conversar; escuchar y actuar un diálogo entero, sí.
// Cada línea lleva quién habla, el ruso, la pronunciación y la traducción.

export const DIALOGOS = [
  {
    id: 'd1', nivel: 'A0', emoji: '🤝', titulo: 'Conocer a alguien',
    situacion: 'Te presentan a una compañera de clase.',
    personajes: ['Анна', 'Ты'],
    lineas: [
      { quien: 0, ru: 'Привет! Меня зовут Анна.', tr: '¡Privét! Miniá zavút Ánna.', es: '¡Hola! Me llamo Anna.' },
      { quien: 1, ru: 'Привет, Анна! Меня зовут Хуан.', tr: '¡Privét, Ánna! Miniá zavút Juán.', es: '¡Hola, Anna! Me llamo Juan.' },
      { quien: 0, ru: 'Очень приятно! Ты испанец?', tr: '¡Óchen priátna! ¿Ty ispániets?', es: '¡Mucho gusto! ¿Eres español?' },
      { quien: 1, ru: 'Да, я из Мадрида. А ты?', tr: 'Da, ya is Madrída. ¿A ty?', es: 'Sí, soy de Madrid. ¿Y tú?' },
      { quien: 0, ru: 'Я из Москвы. Как дела?', tr: 'Ya is Maskvý. ¿Kak dielá?', es: 'Soy de Moscú. ¿Qué tal?' },
      { quien: 1, ru: 'Хорошо, спасибо!', tr: '¡Jarashó, spasíba!', es: '¡Bien, gracias!' },
    ],
    notas: ['Очень приятно es la respuesta automática al presentarse. Apréndela en bloque.',
            'Fíjate en из Мадрида, из Москвы: из + genitivo para decir de dónde eres.'],
  },

  {
    id: 'd2', nivel: 'A0', emoji: '☕', titulo: 'En la cafetería',
    situacion: 'Pides algo para desayunar.',
    personajes: ['Официант', 'Ты'],
    lineas: [
      { quien: 0, ru: 'Здравствуйте! Что будете?', tr: '¡Zdrástvuitie! ¿Shto búditie?', es: '¡Buenos días! ¿Qué va a tomar?' },
      { quien: 1, ru: 'Кофе, пожалуйста.', tr: 'Kófie, pazhálusta.', es: 'Un café, por favor.' },
      { quien: 0, ru: 'Большой или маленький?', tr: '¿Balshói íli málinki?', es: '¿Grande o pequeño?' },
      { quien: 1, ru: 'Большой. И воду, пожалуйста.', tr: 'Balshói. I vódu, pazhálusta.', es: 'Grande. Y agua, por favor.' },
      { quien: 0, ru: 'Хорошо. Двести рублей.', tr: 'Jarashó. Dviésti rubliéi.', es: 'Bien. Doscientos rublos.' },
      { quien: 1, ru: 'Вот, пожалуйста. Спасибо!', tr: '¡Vot, pazhálusta. Spasíba!', es: 'Aquí tiene. ¡Gracias!' },
    ],
    notas: ['Что будете? es la fórmula del camarero, más corta que Что вы будете заказывать?',
            'воду es вода en acusativo: femenino -а → -у.'],
  },

  {
    id: 'd3', nivel: 'A1', emoji: '🧭', titulo: 'Preguntar el camino',
    situacion: 'Estás perdido y buscas el metro.',
    personajes: ['Прохожий', 'Ты'],
    lineas: [
      { quien: 1, ru: 'Извините, где здесь метро?', tr: 'Izvinítie, ¿gdie zdies mitró?', es: 'Perdone, ¿dónde hay metro por aquí?' },
      { quien: 0, ru: 'Метро? Идите прямо, потом направо.', tr: '¿Mitró? Idítie priáma, patóm napráva.', es: '¿El metro? Vaya recto y luego a la derecha.' },
      { quien: 1, ru: 'Это далеко?', tr: '¿Éta dalikó?', es: '¿Está lejos?' },
      { quien: 0, ru: 'Нет, пять минут пешком.', tr: 'Niet, piat minút pishkóm.', es: 'No, cinco minutos andando.' },
      { quien: 1, ru: 'Спасибо большое!', tr: '¡Spasíba balshóie!', es: '¡Muchas gracias!' },
      { quien: 0, ru: 'Не за что!', tr: '¡Nie za shto!', es: '¡De nada!' },
    ],
    notas: ['Не за что es el "de nada" natural entre rusos, más que Пожалуйста.',
            'пять минут: después de 5 el sustantivo va en genitivo plural.'],
  },

  {
    id: 'd4', nivel: 'A1', emoji: '🛒', titulo: 'En la tienda',
    situacion: 'Compras fruta y preguntas el precio.',
    personajes: ['Продавец', 'Ты'],
    lineas: [
      { quien: 1, ru: 'Здравствуйте! Сколько стоят яблоки?', tr: '¡Zdrástvuitie! ¿Skólka stóiat iáblaki?', es: '¡Buenos días! ¿Cuánto cuestan las manzanas?' },
      { quien: 0, ru: 'Сто пятьдесят рублей килограмм.', tr: 'Sto pitdisiát rubliéi kilagrám.', es: 'Ciento cincuenta rublos el kilo.' },
      { quien: 1, ru: 'Дайте два килограмма, пожалуйста.', tr: 'Daítie dva kilagráma, pazhálusta.', es: 'Deme dos kilos, por favor.' },
      { quien: 0, ru: 'Что-нибудь ещё?', tr: '¿Shtó-nibut ischió?', es: '¿Algo más?' },
      { quien: 1, ru: 'Нет, спасибо. Это всё.', tr: 'Niet, spasíba. Éta fsio.', es: 'No, gracias. Eso es todo.' },
      { quien: 0, ru: 'С вас триста рублей.', tr: 'S vas trísta rubliéi.', es: 'Son trescientos rublos.' },
    ],
    notas: ['С вас… es la fórmula del vendedor para decir el total.',
            'два килограмма: con 2, 3 y 4 el sustantivo va en genitivo singular.'],
  },

  {
    id: 'd5', nivel: 'A1', emoji: '👨‍👩‍👧', titulo: 'Hablar de la familia',
    situacion: 'Una compañera te pregunta por los tuyos.',
    personajes: ['Ольга', 'Ты'],
    lineas: [
      { quien: 0, ru: 'У тебя есть братья или сёстры?', tr: '¿U tibiá iest brátia íli sióstry?', es: '¿Tienes hermanos o hermanas?' },
      { quien: 1, ru: 'Да, у меня есть брат и сестра.', tr: 'Da, u miniá iest brat i sistrá.', es: 'Sí, tengo un hermano y una hermana.' },
      { quien: 0, ru: 'А чем они занимаются?', tr: '¿A chem aní zanimáiutsa?', es: '¿Y a qué se dedican?' },
      { quien: 1, ru: 'Брат — врач, а сестра ещё учится.', tr: 'Brat — vrach, a sistrá ischió úchitsa.', es: 'Mi hermano es médico y mi hermana todavía estudia.' },
      { quien: 0, ru: 'Понятно. А родители где живут?', tr: 'Paniátna. ¿A radítieli gdie zhyvút?', es: 'Entiendo. ¿Y tus padres dónde viven?' },
      { quien: 1, ru: 'Они живут в Валенсии.', tr: 'Aní zhyvút v Valiénsii.', es: 'Viven en Valencia.' },
    ],
    notas: ['а no es "y" neutro: contrapone dos cosas (mi hermano esto, mi hermana lo otro).',
            'Понятно = "entendido, vale". Muy usado para confirmar que sigues la conversación.'],
  },

  {
    id: 'd6', nivel: 'A2', emoji: '🚕', titulo: 'En el taxi',
    situacion: 'Vas del aeropuerto al hotel.',
    personajes: ['Водитель', 'Ты'],
    lineas: [
      { quien: 0, ru: 'Добрый вечер! Куда едем?', tr: '¡Dóbry viécher! ¿Kudá iédiem?', es: '¡Buenas noches! ¿A dónde vamos?' },
      { quien: 1, ru: 'В гостиницу «Космос», пожалуйста.', tr: 'V gastínitsu «Kósmas», pazhálusta.', es: 'Al hotel Kosmos, por favor.' },
      { quien: 0, ru: 'Хорошо. Это минут сорок.', tr: 'Jarashó. Éta minút sórak.', es: 'Bien. Son unos cuarenta minutos.' },
      { quien: 1, ru: 'А сколько это будет стоить?', tr: '¿A skólka éta búdiet stóit?', es: '¿Y cuánto va a costar?' },
      { quien: 0, ru: 'Около тысячи рублей.', tr: 'Ókala týsiachi rubliéi.', es: 'Unos mil rublos.' },
      { quien: 1, ru: 'Можно оплатить картой?', tr: '¿Mózhna aplatít kártai?', es: '¿Se puede pagar con tarjeta?' },
      { quien: 0, ru: 'Конечно, без проблем.', tr: 'Kaniéshna, biez prabliém.', es: 'Claro, sin problema.' },
    ],
    notas: ['минут сорок con el número DETRÁS significa "unos cuarenta minutos". Un truco muy ruso.',
            'картой va en instrumental: el medio con el que pagas.'],
  },

  {
    id: 'd7', nivel: 'A2', emoji: '🎉', titulo: 'Qué tal el fin de semana',
    situacion: 'Lunes por la mañana en la oficina.',
    personajes: ['Дмитрий', 'Ты'],
    lineas: [
      { quien: 0, ru: 'Привет! Как прошли выходные?', tr: '¡Privét! ¿Kak prashlí vyjadnýie?', es: '¡Hola! ¿Qué tal el fin de semana?' },
      { quien: 1, ru: 'Отлично! В субботу я ходил в театр.', tr: '¡Atlíchna! F subótu ya jadíl f tiátr.', es: '¡Genial! El sábado fui al teatro.' },
      { quien: 0, ru: 'Правда? И что смотрел?', tr: '¿Právda? ¿I shto smatriél?', es: '¿En serio? ¿Y qué viste?' },
      { quien: 1, ru: '«Чайку» Чехова. Было очень интересно.', tr: '«Cháiku» Chéjava. Býla óchen intiriésna.', es: '"La gaviota" de Chéjov. Fue muy interesante.' },
      { quien: 0, ru: 'Здорово! А в воскресенье?', tr: '¡Zdaróva! ¿A v vaskrisiénie?', es: '¡Qué bien! ¿Y el domingo?' },
      { quien: 1, ru: 'Ничего не делал, отдыхал дома.', tr: 'Nichivó nie diélal, atdyjál dóma.', es: 'No hice nada, descansé en casa.' },
    ],
    notas: ['ходил (multidireccional) porque fue y volvió. Con шёл sonaría a que sigue de camino.',
            'Ничего не делал: doble negación obligatoria.'],
  },

  {
    id: 'd8', nivel: 'A2', emoji: '🏖️', titulo: 'Planes de verano',
    situacion: 'Hablas de lo que harás en vacaciones.',
    personajes: ['Катя', 'Ты'],
    lineas: [
      { quien: 0, ru: 'Что ты будешь делать летом?', tr: '¿Shto ty búdiesh diélat liétam?', es: '¿Qué vas a hacer en verano?' },
      { quien: 1, ru: 'Я поеду в Испанию на две недели.', tr: 'Ya paiédu v Ispániiu na dvie nidiéli.', es: 'Iré a España dos semanas.' },
      { quien: 0, ru: 'Здорово! А потом?', tr: '¡Zdaróva! ¿A patóm?', es: '¡Qué bien! ¿Y después?' },
      { quien: 1, ru: 'Потом буду работать. У меня новый проект.', tr: 'Patóm búdu rabótat. U miniá nóvy praiékt.', es: 'Después trabajaré. Tengo un proyecto nuevo.' },
      { quien: 0, ru: 'А я, наверное, останусь в городе.', tr: 'A ya, naviérnaie, astánus v górodie.', es: 'Yo seguramente me quedaré en la ciudad.' },
      { quien: 1, ru: 'Приезжай ко мне в гости!', tr: '¡Priiezzhái ka mnie v gósti!', es: '¡Vente a visitarme!' },
    ],
    notas: ['поеду (perfectivo) = futuro simple; буду работать (imperfectivo) = acción continuada.',
            'в гости = "de visita". Idти в гости es ir a casa de alguien.'],
  },

  {
    id: 'd9', nivel: 'B1', emoji: '🏨', titulo: 'Check-in con imprevisto',
    situacion: 'Llegas al hotel y algo no cuadra con la reserva.',
    personajes: ['Администратор', 'Ты'],
    lineas: [
      { quien: 1, ru: 'Добрый день, у меня забронирован номер на фамилию Гарсия.', tr: 'Dóbry dien, u miniá zabranírovan nómier na família Garsía.', es: 'Buenas tardes, tengo una habitación reservada a nombre de García.' },
      { quien: 0, ru: 'Секунду… К сожалению, ваш номер ещё не готов.', tr: 'Sikúndu… K sazhaliéniiu, vash nómier ischió nie gatóf.', es: 'Un segundo… Lamentablemente su habitación aún no está lista.' },
      { quien: 1, ru: 'А когда он будет готов?', tr: '¿A kagdá on búdiet gatóf?', es: '¿Y cuándo estará lista?' },
      { quien: 0, ru: 'Примерно через час. Можете оставить багаж у нас.', tr: 'Primiérna chériez chas. Mózhetie astávit bagásh u nas.', es: 'Dentro de una hora aproximadamente. Puede dejarnos el equipaje.' },
      { quien: 1, ru: 'Хорошо. А завтрак во сколько?', tr: 'Jarashó. ¿A záftrak va skólka?', es: 'De acuerdo. ¿Y el desayuno a qué hora es?' },
      { quien: 0, ru: 'С семи до десяти, на первом этаже.', tr: 'S simí da disití, na piérvam etazhé.', es: 'De siete a diez, en la primera planta.' },
      { quien: 1, ru: 'Отлично, спасибо за помощь.', tr: 'Atlíchna, spasíba za pómasch.', es: 'Perfecto, gracias por la ayuda.' },
    ],
    notas: ['забронирован es participio pasivo corto: "está reservado".',
            'К сожалению (por desgracia) es la forma educada de dar una mala noticia.'],
  },

  {
    id: 'd10', nivel: 'B1', emoji: '🩺', titulo: 'En la consulta del médico',
    situacion: 'Llevas dos días con fiebre.',
    personajes: ['Врач', 'Ты'],
    lineas: [
      { quien: 0, ru: 'Здравствуйте, на что жалуетесь?', tr: 'Zdrástvuitie, ¿na shto zháluities?', es: 'Buenos días, ¿qué le ocurre?' },
      { quien: 1, ru: 'У меня болит горло и высокая температура.', tr: 'U miniá balít górla i vysókaia timpiratúra.', es: 'Me duele la garganta y tengo mucha fiebre.' },
      { quien: 0, ru: 'Давно это началось?', tr: '¿Davnó éta nachalós?', es: '¿Hace mucho que empezó?' },
      { quien: 1, ru: 'Два дня назад. И я плохо сплю.', tr: 'Dva dnia nazát. I ya plója spliu.', es: 'Hace dos días. Y duermo mal.' },
      { quien: 0, ru: 'Понятно. Откройте рот, посмотрим.', tr: 'Paniátna. Atkróitie rot, pasmótrim.', es: 'Entiendo. Abra la boca, vamos a ver.' },
      { quien: 0, ru: 'Ничего страшного. Выпишу вам лекарство.', tr: 'Nichivó stráshnava. Výpishu vam likárstva.', es: 'No es nada grave. Le receto un medicamento.' },
      { quien: 1, ru: 'Сколько раз в день его принимать?', tr: '¿Skólka ras v dien ievó prinimát?', es: '¿Cuántas veces al día hay que tomarlo?' },
      { quien: 0, ru: 'Три раза после еды. Через неделю будете здоровы.', tr: 'Tri ráza póslie iedý. Chériez nidiéliu búditie zdaróvy.', es: 'Tres veces después de comer. En una semana estará bien.' },
    ],
    notas: ['На что жалуетесь? es LA pregunta con la que empieza toda consulta médica rusa.',
            'Ничего страшного = "no pasa nada, no es grave". Se usa también fuera del médico.'],
  },

  {
    id: 'd11', nivel: 'B1', emoji: '📞', titulo: 'Quedar por teléfono',
    situacion: 'Llamas a un amigo para verte con él.',
    personajes: ['Сергей', 'Ты'],
    lineas: [
      { quien: 0, ru: 'Алло, слушаю!', tr: '¡Alió, slúshaiu!', es: '¿Diga?' },
      { quien: 1, ru: 'Привет, Серёж, это я. Ты сейчас свободен?', tr: 'Privét, Siriózh, éta ya. ¿Ty sichás svabódien?', es: 'Hola, Seriozha, soy yo. ¿Estás libre ahora?' },
      { quien: 0, ru: 'Не совсем, я на работе. А что случилось?', tr: 'Nie safsiém, ya na rabótie. ¿A shto sluchílas?', es: 'No del todo, estoy trabajando. ¿Qué pasa?' },
      { quien: 1, ru: 'Хотел предложить встретиться вечером.', tr: 'Jatiél pridlazhýt fstriétitsa viécheram.', es: 'Quería proponerte quedar esta tarde.' },
      { quien: 0, ru: 'Давай! Во сколько тебе удобно?', tr: '¡Davái! ¿Va skólka tibié udóbna?', es: '¡Venga! ¿A qué hora te viene bien?' },
      { quien: 1, ru: 'Часов в семь, у метро. Подойдёт?', tr: 'Chasóf f siem, u mitró. ¿Padaidiót?', es: 'Sobre las siete, junto al metro. ¿Te va bien?' },
      { quien: 0, ru: 'Отлично, договорились. До вечера!', tr: '¡Atlíchna, dagavaríli. Da viéchira!', es: '¡Perfecto, hecho. Hasta la tarde!' },
    ],
    notas: ['Серёж es el vocativo coloquial de Серёжа, que a su vez es el diminutivo de Сергей.',
            'Договорились = "trato hecho". Cierra cualquier acuerdo informal.'],
  },

  {
    id: 'd12', nivel: 'B1', emoji: '💼', titulo: 'Entrevista de trabajo',
    situacion: 'Te entrevistan para un puesto.',
    personajes: ['HR', 'Ты'],
    lineas: [
      { quien: 0, ru: 'Расскажите немного о себе.', tr: 'Raskazhýtie nimnóga a sibié.', es: 'Cuéntenos un poco sobre usted.' },
      { quien: 1, ru: 'Я программист, работаю в этой сфере пять лет.', tr: 'Ya pragramíst, rabótaiu v étai sfiérie piat liet.', es: 'Soy programador, llevo cinco años en este sector.' },
      { quien: 0, ru: 'А почему вы хотите работать у нас?', tr: '¿A pachimú vy jatítie rabótat u nas?', es: '¿Y por qué quiere trabajar con nosotros?' },
      { quien: 1, ru: 'Меня привлекают ваши проекты и возможность роста.', tr: 'Miniá privlikáiut váshy praiékty i vazmózhnast rósta.', es: 'Me atraen sus proyectos y la posibilidad de crecer.' },
      { quien: 0, ru: 'Какие у вас сильные стороны?', tr: '¿Kakíe u vas sílnyie stórany?', es: '¿Cuáles son sus puntos fuertes?' },
      { quien: 1, ru: 'Я быстро учусь и умею работать в команде.', tr: 'Ya býstra uchús i umiéiu rabótat f kamándie.', es: 'Aprendo rápido y sé trabajar en equipo.' },
      { quien: 0, ru: 'Хорошо. Мы свяжемся с вами на следующей неделе.', tr: 'Jarashó. My sviázhemsia s vámi na sliéduischei nidiélie.', es: 'Bien. Nos pondremos en contacto la semana que viene.' },
    ],
    notas: ['Расскажите о себе es la primera pregunta de toda entrevista: ten preparadas tres frases.',
            'сильные стороны (puntos fuertes) / слабые стороны (puntos débiles).'],
  },

  {
    id: 'd13', nivel: 'B2', emoji: '📰', titulo: 'Comentar una noticia',
    situacion: 'Dos compañeros discuten un tema de actualidad.',
    personajes: ['Ирина', 'Ты'],
    lineas: [
      { quien: 0, ru: 'Ты читал о новой реформе образования?', tr: '¿Ty chitál a nóvai rifórmie abrazavánia?', es: '¿Has leído sobre la nueva reforma educativa?' },
      { quien: 1, ru: 'Читал, но, честно говоря, не всё понял.', tr: 'Chitál, no, chésna gavariá, nie fsio pónial.', es: 'La he leído, pero sinceramente no lo entendí todo.' },
      { quien: 0, ru: 'Говорят, что изменения коснутся всех школ.', tr: 'Gavariát, shto izminiénia kasnútsa fsiej shkol.', es: 'Dicen que los cambios afectarán a todos los colegios.' },
      { quien: 1, ru: 'С одной стороны это неплохо, но с другой — слишком быстро.', tr: 'S adnói staraný éta niplója, no s drugói — slíshkam býstra.', es: 'Por un lado no está mal, pero por otro es demasiado rápido.' },
      { quien: 0, ru: 'Вот именно. По-моему, надо было обсудить это с учителями.', tr: 'Vot ímina. Pa-móiemu, náda býla apsudít éta s uchitieliámi.', es: 'Exacto. En mi opinión, había que haberlo hablado con los profesores.' },
      { quien: 1, ru: 'Согласен. Посмотрим, что будет дальше.', tr: 'Saglásien. Pasmótrim, shto búdiet dálshe.', es: 'De acuerdo. Veremos qué pasa.' },
    ],
    notas: ['Говорят, что… es la pasiva impersonal típica: "se dice que".',
            'Вот именно = "exacto, eso mismo". Muy útil para mostrar acuerdo enfático.'],
  },

  {
    id: 'd14', nivel: 'B2', emoji: '📅', titulo: 'Pedir más plazo en el trabajo',
    situacion: 'Necesitas retrasar una entrega y negociarlo con tu jefa.',
    personajes: ['Начальница', 'Ты'],
    lineas: [
      { quien: 1, ru: 'Марина Петровна, можно с вами поговорить?', tr: 'Marína Pitróvna, ¿mózhna s vámi pagavarít?', es: 'Marina Petrovna, ¿puedo hablar con usted?' },
      { quien: 0, ru: 'Конечно, проходите. Что-то случилось?', tr: 'Kaniéshna, prajadítie. ¿Shtó-ta sluchílas?', es: 'Claro, pase. ¿Ha pasado algo?' },
      { quien: 1, ru: 'Боюсь, я не успею закончить отчёт к пятнице.', tr: 'Baiús, ya nie uspiéiu zakónchit atchiót k piátnitse.', es: 'Me temo que no me dará tiempo a terminar el informe para el viernes.' },
      { quien: 0, ru: 'А в чём проблема?', tr: '¿A f chom prabliéma?', es: '¿Y cuál es el problema?' },
      { quien: 1, ru: 'Данные пришли позже, чем планировалось.', tr: 'Dányie prishlí pózzhe, chem planíravalas.', es: 'Los datos llegaron más tarde de lo previsto.' },
      { quien: 0, ru: 'Понимаю. Сколько времени вам нужно?', tr: 'Panimáiu. ¿Skólka vriémieni vam núzhna?', es: 'Entiendo. ¿Cuánto tiempo necesita?' },
      { quien: 1, ru: 'Ещё два дня, и всё будет готово.', tr: 'Ischió dva dnia, i fsio búdiet gatóva.', es: 'Dos días más y todo estará listo.' },
      { quien: 0, ru: 'Хорошо, но во вторник жду отчёт на столе.', tr: 'Jarashó, no va ftórnik zhdu atchiót na stalié.', es: 'De acuerdo, pero el martes espero el informe sobre la mesa.' },
    ],
    notas: ['Nombre + patronímico (Марина Петровна) es lo correcto con un superior.',
            'Боюсь, (что)… suaviza cualquier mala noticia en registro formal.'],
  },

  {
    id: 'd15', nivel: 'B2', emoji: '🔑', titulo: 'Alquilar un piso',
    situacion: 'Visitas un piso y negocias las condiciones.',
    personajes: ['Хозяйка', 'Ты'],
    lineas: [
      { quien: 0, ru: 'Проходите, осматривайтесь. Квартира сдаётся с мебелью.', tr: 'Prajadítie, asmátrivaities. Kvartíra sdaiótsa s miébieliu.', es: 'Pase, mire tranquilo. El piso se alquila amueblado.' },
      { quien: 1, ru: 'А коммунальные услуги входят в стоимость?', tr: '¿A kamunálnyie uslúgui vjódiat f stóimast?', es: '¿Los gastos de comunidad están incluidos en el precio?' },
      { quien: 0, ru: 'Нет, свет и воду оплачиваете отдельно.', tr: 'Niet, sviet i vódu apláchivaietie atdiélna.', es: 'No, la luz y el agua se pagan aparte.' },
      { quien: 1, ru: 'Понятно. А на какой срок заключается договор?', tr: 'Paniátna. ¿A na kakói srok zakliucháietsa dagavór?', es: 'Entiendo. ¿Y por cuánto tiempo se firma el contrato?' },
      { quien: 0, ru: 'Минимум на год, с депозитом за месяц.', tr: 'Mínimum na got, s dipazítam za miésiats.', es: 'Mínimo un año, con un mes de fianza.' },
      { quien: 1, ru: 'А можно немного снизить цену, если заплачу сразу за полгода?', tr: '¿A mózhna nimnóga snízit tsénu, iésli zaplachú srázu za polgóda?', es: '¿Se podría bajar algo el precio si pago seis meses por adelantado?' },
      { quien: 0, ru: 'Давайте обсудим. Думаю, договоримся.', tr: 'Davaítie apsúdim. Dúmaiu, dagavarímsia.', es: 'Hablémoslo. Creo que nos pondremos de acuerdo.' },
    ],
    notas: ['сдаётся y заключается son pasivas con -ся: el ruso escrito las prefiere a "ellos alquilan".',
            'коммунальные услуги (o «коммуналка» en coloquial) son los suministros del piso.'],
  },

  {
    id: 'd16', nivel: 'C1', emoji: '🤖', titulo: 'Debate sobre tecnología',
    situacion: 'Discusión de sobremesa sobre inteligencia artificial.',
    personajes: ['Павел', 'Ты'],
    lineas: [
      { quien: 0, ru: 'Как ты относишься к тому, что ИИ заменяет людей на работе?', tr: '¿Kak ty atnóshysia k tamú, shto i-í zaminiáiet liudiéi na rabótie?', es: '¿Qué opinas de que la IA sustituya a personas en el trabajo?' },
      { quien: 1, ru: 'Мне кажется, это преувеличение, хотя доля правды тут есть.', tr: 'Mnie kázhetsa, éta priuvilichénie, jatiá dólia právdy tut iest.', es: 'Me parece una exageración, aunque algo de verdad hay.' },
      { quien: 0, ru: 'Но ведь целые профессии уже исчезают.', tr: 'No viet tsélyie prafiésii uzhé ischezáiut.', es: 'Pero si es que ya están desapareciendo profesiones enteras.' },
      { quien: 1, ru: 'Исчезают, но появляются новые. Так было и с промышленной революцией.', tr: 'Ischezáiut, no apavliáiutsa nóvyie. Tak býla i s pramýshlienai rivaliútsyiei.', es: 'Desaparecen, pero surgen otras nuevas. Igual pasó con la revolución industrial.' },
      { quien: 0, ru: 'Согласен отчасти. Вопрос в том, успеют ли люди переучиться.', tr: 'Saglásien atchásti. Vaprós f tom, uspiéiut li liúdi piriuchítsa.', es: 'Estoy en parte de acuerdo. La cuestión es si la gente llegará a reciclarse.' },
      { quien: 1, ru: 'Вот это, по-моему, и есть главная проблема.', tr: 'Vot éta, pa-móiemu, i iest glávnaia prabliéma.', es: 'Eso es, en mi opinión, el verdadero problema.' },
    ],
    notas: ['Как ты относишься к…? es LA manera de pedir la opinión de alguien en ruso.',
            'Вопрос в том, … + ли: estructura de debate para plantear la duda central.'],
  },
];

export function dialogoPorId(id) {
  return DIALOGOS.find((d) => d.id === id);
}

export const LINEAS_DIALOGO = DIALOGOS.flatMap((d) =>
  d.lineas.map((l, i) => ({ ...l, id: `${d.id}:${i}`, dialogo: d.id, nivel: d.nivel }))
);
