import type { Route } from "../types";

export const rutaDecision: Route = {
  slug: "frontera-de-la-decision",
  name: "Frontera de la decisión",
  subtitle: "Diseña pruebas y decide con rigor",
  level: "Nivel 3 · Avanzado",
  difficulty: "ADVANCED",
  islands: [
    {
      slug: "randomized-test",
      name: "Estrecho Experimental",
      topic: "Experimentos justos",
      skill: "causalidad",
      story: {
        opening:
          "La Frontera de la Decisión asoma entre la niebla. En el Estrecho Experimental, la tienda del puerto estrenó una pantalla de compra y vendió más que con la habitual. Capitán Nexus nota un detalle: cada pantalla navegó en una semana distinta.",
        closing: "La tripulación ya sabe armar una prueba justa: un sorteo, un mismo periodo y un solo cambio a la vez."
      },
      challenges: [
        {
          id: "de-randomized-test-1",
          type: "choice",
          concept: "Comparación justa",
          prompt: "La pantalla nueva vendió más, pero se probó en otra semana. ¿Qué diseño permite atribuir la diferencia a la pantalla?",
          evidence: {
            kind: "bars",
            title: "Visitantes que compraron",
            unit: "%",
            bars: [
              { id: "a", label: "A · semana 1", value: 10 },
              { id: "b", label: "B · semana 2", value: 13, tone: "accent" }
            ],
            note: "A es la pantalla habitual; B, la nueva."
          },
          options: [
            { id: "a", text: "Quedarse con B: 13% es más que 10%.", why: "La semana también cambió. No sabes si el 13% se debe a la pantalla o a esos días." },
            { id: "b", text: "Probar B una semana más y promediar.", why: "Seguirías comparando semanas distintas: lo que cambie entre ellas se mezcla con la pantalla." },
            { id: "c", text: "Mostrar B solo a los clientes frecuentes.", why: "Los clientes frecuentes compran más con cualquier pantalla. El grupo, y no la pantalla, explicaría la diferencia." },
            { id: "d", text: "Sortear quién ve A o B, en la misma semana." }
          ],
          correct: "d",
          hint: "Entre los dos grupos cambió más de una cosa. ¿Cómo logras que la pantalla sea la única diferencia?",
          explanation:
            "Entre 10% y 13% hay dos diferencias: la pantalla y la semana. Si un sorteo reparte a los visitantes en los mismos días, los grupos se parecen en todo lo demás y solo cambia la pantalla.",
          takeaway: "Una prueba justa cambia una sola cosa: sorteo y mismo periodo para ambos grupos."
        },
        {
          id: "de-randomized-test-2",
          type: "order",
          concept: "Diseñar una prueba A/B",
          prompt: "Ordena los pasos para probar la pantalla nueva de forma justa.",
          context: "Una prueba A/B compara dos versiones al mismo tiempo.",
          items: [
            { id: "plan", text: "Fijar qué se medirá y cuánto durará la prueba" },
            { id: "sorteo", text: "Sortear qué visitantes verán A y cuáles B" },
            { id: "correr", text: "Mostrar ambas pantallas durante el mismo periodo" },
            { id: "comparar", text: "Comparar el % de compra al cumplirse el plazo" }
          ],
          hint: "Las reglas se fijan antes de mirar resultados. ¿Qué debe estar decidido antes de mostrar una sola pantalla?",
          explanation:
            "Primero defines la medida y el plazo, para no acomodarlos después a lo que convenga. Luego el sorteo arma grupos parecidos, ambos navegan los mismos días y solo al final se compara.",
          takeaway: "Decide qué medir y hasta cuándo antes de ver un solo resultado."
        },
        {
          id: "de-randomized-test-3",
          type: "multi",
          concept: "Qué contamina una prueba",
          prompt: "¿Cuáles de estas decisiones contaminarían la prueba entre A y B?",
          context: "Selecciona todas las que correspondan.",
          options: [
            { id: "a", text: "Bajar el precio solo para quienes ven B" },
            { id: "b", text: "Mostrar B solo a los clientes frecuentes" },
            { id: "c", text: "Repartir a los visitantes por sorteo" },
            { id: "d", text: "Probar A en una semana normal y B en una con feriado" },
            { id: "e", text: "Medir a los dos grupos con el mismo plazo" }
          ],
          correct: ["a", "b", "d"],
          hint: "Contamina todo lo que hace distintos a los grupos además de la pantalla.",
          explanation:
            "Precio, tipo de cliente y semana son diferencias extra: si B gana, no sabrías cuál de ellas fue. El sorteo y el plazo igual hacen lo contrario: emparejan a los grupos.",
          takeaway: "Si dos cosas cambian a la vez, no sabrás cuál produjo el resultado."
        }
      ]
    },
    {
      slug: "confounding",
      name: "Isla de las Corrientes Ocultas",
      topic: "Variables de confusión",
      skill: "causalidad",
      story: {
        opening:
          "En la Isla de las Corrientes Ocultas, la academia de navegantes celebra su programa de tutorías: quienes lo tomaron rinden mejor en el examen. Capitán Nexus revisa la lista de inscritos y nota que muchos ya habían navegado antes.",
        closing:
          "La corriente oculta quedó a la vista: la experiencia empujaba el puntaje y la tutoría se llevaba el crédito. La tripulación ya compara solo lo comparable."
      },
      challenges: [
        {
          id: "de-confounding-1",
          type: "pick",
          concept: "Grupos distintos de partida",
          prompt: "Con tutoría: 78 puntos de promedio. Sin tutoría: 64. Toca la fila que muestra que los grupos ya eran distintos antes de empezar.",
          evidence: {
            kind: "table",
            title: "Los dos grupos antes del curso",
            columns: ["Dato", "Con tutoría", "Sin tutoría"],
            rows: [
              { id: "personas", cells: ["Personas", "100", "100"] },
              { id: "edad", cells: ["Edad promedio", "29 años", "30 años"] },
              { id: "exp", cells: ["Ya habían navegado", "80", "20"] },
              { id: "horas", cells: ["Horas de clase", "40", "40"] }
            ]
          },
          correct: "exp",
          why: {
            personas: "Ambos grupos tienen 100 personas: el tamaño no los distingue.",
            edad: "Un año de diferencia en la edad promedio es mínimo. Busca una diferencia grande.",
            horas: "Las horas de clase son las mismas. Busca en qué se diferencian los grupos."
          },
          hint: "¿Qué ventaja podría traer alguien desde antes, con o sin tutoría?",
          explanation:
            "80 de los 100 con tutoría ya habían navegado, contra solo 20 de los 100 sin tutoría. La experiencia sube el puntaje por sí sola, así que los 14 puntos pueden venir de ahí y no de la tutoría.",
          takeaway: "Antes de comparar resultados, revisa si los grupos partieron iguales."
        },
        {
          id: "de-confounding-2",
          type: "numeric",
          concept: "Comparar dentro de cada grupo",
          prompt: "En el total, la tutoría aventaja por 14 puntos. Si comparas solo a personas con la misma experiencia, ¿de cuántos puntos es la ventaja?",
          evidence: {
            kind: "table",
            title: "Puntaje promedio en el examen",
            columns: ["Experiencia", "Con tutoría", "Sin tutoría"],
            rows: [
              { id: "con", cells: ["Ya navegaba", "82 (80 pers.)", "80 (20 pers.)"] },
              { id: "sin", cells: ["Nunca navegó", "62 (20 pers.)", "60 (80 pers.)"] },
              { id: "todos", cells: ["Todos", "78 (100 pers.)", "64 (100 pers.)"] }
            ],
            note: "Entre paréntesis, cuántas personas hay en cada casilla."
          },
          answer: 2,
          tolerance: 0,
          unit: "puntos",
          hint: "Mira una fila a la vez: misma experiencia, con y sin tutoría.",
          explanation:
            "Entre quienes ya navegaban: 82 contra 80. Entre quienes nunca navegaron: 62 contra 60. La ventaja real es de 2 puntos; los otros 12 aparecen porque el grupo con tutoría tenía más gente con experiencia.",
          takeaway: "Compara dentro de grupos parecidos: ahí se ve cuánto aporta de verdad cada cosa."
        },
        {
          id: "de-confounding-3",
          type: "choice",
          concept: "Causalidad inversa",
          prompt: "En otra academia, la tutoría se ofrece a quienes reprueban el primer examen. Allí, quienes la toman promedian menos. ¿Qué lo explica mejor?",
          evidence: {
            kind: "stats",
            title: "Academia del Faro: examen final",
            items: [
              { id: "con", label: "Con tutoría", value: "52 puntos", detail: "Reprobaron el primer examen" },
              { id: "sin", label: "Sin tutoría", value: "70 puntos", detail: "Aprobaron el primer examen" }
            ]
          },
          options: [
            { id: "a", text: "La tutoría confunde y hace bajar el puntaje.", why: "Estas personas ya rendían menos antes de su primera clase de tutoría. Revisa qué ocurrió primero." },
            { id: "b", text: "El puntaje bajo llevó a la tutoría, no al revés." },
            { id: "c", text: "Los tutores de esa academia enseñan mal.", why: "Puede ser, pero el dato no lo muestra: el grupo ya rendía menos antes de conocer a sus tutores." },
            { id: "d", text: "Es azar: con más alumnos se emparejaría.", why: "No es azar: la regla de la academia decide quién va a tutoría. La diferencia está armada desde el inicio." }
          ],
          correct: "b",
          hint: "Fíjate en el orden: ¿qué pasó primero, el puntaje bajo o la tutoría?",
          explanation:
            "Aquí la flecha va al revés: reprobar es lo que manda a alguien a tutoría. Por eso ese grupo promedia 52 y el otro 70, aunque la tutoría les esté ayudando.",
          takeaway: "Antes de decir «A causa B», revisa si no será B lo que lleva a A."
        }
      ]
    },
    {
      slug: "base-rates",
      name: "Isla de la Alarma",
      topic: "Tasas base",
      skill: "incertidumbre",
      story: {
        opening:
          "En la Isla de la Alarma, un detector nuevo revisa los cascos en busca de grietas. Acierta casi siempre y, aun así, los astilleros se llenan de barcos sanos. Capitán Nexus pregunta lo que nadie preguntó: ¿qué tan seguido hay una grieta de verdad?",
        closing:
          "La tripulación ya no salta con cada sirena: primero pregunta qué tan raro es el problema y después cuánto creerle a la alarma."
      },
      challenges: [
        {
          id: "de-base-rates-1",
          type: "numeric",
          concept: "Contar alarmas reales",
          prompt: "De todas las alarmas que suenan, ¿qué porcentaje corresponde a una grieta real? Redondea al entero más cercano.",
          evidence: {
            kind: "table",
            title: "1.000 barcos revisados",
            columns: ["Barcos", "Cantidad", "Con alarma"],
            rows: [
              { id: "grieta", cells: ["Con grieta", "10", "9"] },
              { id: "sanos", cells: ["Sin grieta", "990", "99"] }
            ]
          },
          answer: 8,
          tolerance: 0.4,
          unit: "%",
          hint: "Primero suma todas las alarmas, las reales y las falsas. Después mira qué parte es real.",
          explanation:
            "Suenan 9 + 99 = 108 alarmas y solo 9 son grietas reales: 9 ÷ 108 ≈ 8%. Los barcos sanos son tantos que sus falsas alarmas superan por mucho a las verdaderas.",
          takeaway: "Si el problema es raro, la mayoría de las alarmas serán falsas, aunque el detector sea bueno."
        },
        {
          id: "de-base-rates-2",
          type: "choice",
          concept: "La tasa base cambia todo",
          prompt: "Mismo detector, otro puerto: aquí 20 de cada 100 barcos tienen grieta. Si suena la alarma, ¿qué tan probable es que la grieta sea real?",
          context: "La tasa base es qué tan frecuente es el problema antes de medir nada.",
          evidence: {
            kind: "grid",
            title: "100 barcos del Puerto Viejo",
            unitLabel: "barcos",
            groups: [
              { id: "real", label: "Con grieta y con alarma", count: 18, tone: "accent" },
              { id: "omitida", label: "Con grieta y sin alarma", count: 2, tone: "warn" },
              { id: "falsa", label: "Sanos con alarma", count: 8, tone: "warn" },
              { id: "sanos", label: "Sanos sin alarma", count: 72, tone: "neutral" }
            ]
          },
          options: [
            { id: "a", text: "Cerca de 8%, igual que en el otro puerto.", why: "Ese 8% valía cuando había 1 grieta cada 100 barcos. Aquí el problema es mucho más frecuente." },
            { id: "b", text: "Un 90%, porque así acierta el detector.", why: "90% es cuántas grietas detecta. La pregunta es otra: de las alarmas que suenan, cuántas son reales." },
            { id: "c", text: "Cerca de 69%: 18 de las 26 alarmas." },
            { id: "d", text: "Un 20%, lo mismo que la tasa base.", why: "20% era la probabilidad antes de la alarma. La alarma agrega información y esa cifra debe moverse." }
          ],
          correct: "c",
          hint: "Cuenta solo los barcos donde sonó la alarma. ¿Cuántos son y cuántos tienen grieta?",
          explanation:
            "Suenan 18 + 8 = 26 alarmas y 18 son reales: 69%. El detector es el mismo que antes daba 8%; lo que cambió es la tasa base, de 1 a 20 grietas por cada 100 barcos.",
          takeaway: "La misma alarma vale distinto según qué tan frecuente sea lo que busca."
        },
        {
          id: "de-base-rates-3",
          type: "choice",
          concept: "Qué hacer con una alarma",
          prompt: "En el primer puerto, la alarma sube la probabilidad de grieta de 1% a 8%. Suena en tu barco. ¿Qué decisión es más sensata?",
          evidence: {
            kind: "stats",
            title: "Probabilidad de grieta",
            items: [
              { id: "antes", label: "Antes de la alarma", value: "1%", detail: "10 de 1.000 barcos" },
              { id: "despues", label: "Después de la alarma", value: "8%", detail: "9 de 108 alarmas", tone: "warn" }
            ]
          },
          options: [
            { id: "a", text: "Hacer una segunda revisión antes de decidir." },
            { id: "b", text: "Desarmar el casco ya: el detector acierta 90%.", why: "Ese 90% es cuántas grietas detecta, no cuántas alarmas son reales. De 108 alarmas, 99 son de barcos sanos." },
            { id: "c", text: "Ignorarla: casi todas las alarmas son falsas.", why: "8% es ocho veces el riesgo inicial, y una grieta en altamar sale cara. La alarma sí dice algo." },
            { id: "d", text: "Retirar el detector: se equivoca demasiado.", why: "El detector encuentra 9 de cada 10 grietas. Sirve para saber dónde mirar con más cuidado." }
          ],
          correct: "a",
          hint: "8% no es certeza, pero tampoco es el 1% de antes. ¿Qué opción toma en serio ambas cosas?",
          explanation:
            "La alarma multiplica el riesgo por ocho, pero cerca de 92 de cada 100 alarmas siguen siendo falsas. Una segunda revisión cuesta poco y separa las grietas reales de los sustos.",
          takeaway: "Una alarma no es un veredicto: es una razón para mirar mejor."
        }
      ]
    },
    {
      slug: "uncertainty",
      name: "Estrecho de la Incertidumbre",
      topic: "Rangos e intervalos",
      skill: "incertidumbre",
      story: {
        opening:
          "En el Estrecho de la Incertidumbre la niebla no deja ver la costa completa. El taller de velas promete viajes más cortos, pero cada medición llega con un margen de duda. Capitán Nexus pide ver el rango entero, no solo el punto del centro.",
        closing:
          "La niebla sigue ahí, pero ya no paraliza: la tripulación lee el rango completo y pesa cuánto cuesta equivocarse antes de decidir."
      },
      challenges: [
        {
          id: "de-uncertainty-1",
          type: "choice",
          concept: "Leer el rango completo",
          prompt: "Tres velas nuevas prometen acortar el viaje. ¿De cuál puedes decir con más confianza que mejora?",
          context: "El punto es la mejor estimación. La barra es el rango plausible: los valores que los datos no descartan.",
          evidence: {
            kind: "interval",
            title: "Minutos ahorrados por viaje",
            unit: "min",
            reference: { value: 0, label: "Sin cambio" },
            items: [
              { id: "a", label: "Vela A", low: -1, point: 2, high: 5 },
              { id: "b", label: "Vela B", low: 1, point: 3, high: 5 },
              { id: "c", label: "Vela C", low: -4, point: 4, high: 12 }
            ],
            note: "Bajo cero, el viaje se alarga."
          },
          options: [
            { id: "a", text: "Vela C: tiene la estimación más alta.", why: "Su rango va de −4 a +12: puede ser la mejor o alargar el viaje. El punto más alto no basta." },
            { id: "b", text: "Vela B: todo su rango supera el cero." },
            { id: "c", text: "Vela A: su estimación es positiva.", why: "El punto está en +2, pero el rango baja hasta −1: no se descarta que el viaje se alargue." },
            { id: "d", text: "Ninguna: todas tienen incertidumbre.", why: "Siempre hay incertidumbre. Lo que importa es dónde cae el rango respecto del cero." }
          ],
          correct: "b",
          hint: "No mires solo el punto. ¿Qué barra queda entera a un lado de la línea de cero?",
          explanation:
            "La vela B ahorra entre 1 y 5 minutos: hasta su peor caso plausible es una mejora. Los rangos de A y C cruzan el cero (llegan a −1 y −4), así que podrían alargar el viaje.",
          takeaway: "Si el rango plausible cruza el cero, todavía no sabes si hay mejora."
        },
        {
          id: "de-uncertainty-2",
          type: "multi",
          concept: "Más datos, rango más angosto",
          prompt: "La vela C se volvió a medir con más viajes. ¿Qué afirmaciones son correctas?",
          context: "Selecciona todas las que correspondan.",
          evidence: {
            kind: "interval",
            title: "Vela C: minutos ahorrados por viaje",
            unit: "min",
            reference: { value: 0, label: "Sin cambio" },
            items: [
              { id: "n50", label: "50 viajes", low: -4, point: 4, high: 12 },
              { id: "n200", label: "200 viajes", low: 0, point: 4, high: 8 },
              { id: "n800", label: "800 viajes", low: 2, point: 4, high: 6 }
            ]
          },
          options: [
            { id: "a", text: "La estimación es la misma en las tres mediciones" },
            { id: "b", text: "Con más viajes, el rango plausible se angosta" },
            { id: "c", text: "Con 50 viajes, la vela ahorra menos que con 800" },
            { id: "d", text: "Con 50 viajes no se descarta que el viaje se alargue" },
            { id: "e", text: "Cuadruplicar los viajes deja el rango en la cuarta parte" }
          ],
          correct: ["a", "b", "d"],
          hint: "Compara por separado el punto y el ancho de cada barra.",
          explanation:
            "El punto sigue en +4, pero el ancho del rango baja de 16 a 8 y luego a 4 minutos. Con cuatro veces más viajes el rango se reduce a la mitad, no a la cuarta parte: la precisión se gana lento.",
          takeaway: "Con pocos datos el rango es ancho: sumar datos lo angosta, pero cada vez cuesta más."
        },
        {
          id: "de-uncertainty-3",
          type: "choice",
          concept: "Decidir o esperar",
          prompt: "Cambiar las velas de toda la flota es caro y no tiene vuelta atrás. Con estos datos de la vela A, ¿qué conviene hacer?",
          evidence: {
            kind: "stats",
            title: "Vela A: lo que se sabe",
            items: [
              { id: "est", label: "Estimación", value: "+2 min", detail: "Ahorro por viaje" },
              { id: "rango", label: "Rango plausible", value: "−1 a +5 min", detail: "Incluye alargar el viaje" },
              { id: "flota", label: "Cambiar la flota", value: "Caro", detail: "No se puede deshacer" },
              { id: "prueba", label: "Dos semanas más de prueba", value: "Barato", detail: "Angosta el rango" }
            ]
          },
          options: [
            { id: "a", text: "Cambiar la flota ya: +2 es una mejora.", why: "+2 es solo el centro. El rango llega a −1 y, si resulta así, el gasto no se recupera." },
            { id: "b", text: "Descartar la vela: el rango incluye pérdidas.", why: "El rango también llega a +5. Descartarla hoy es tan apresurado como comprarla hoy." },
            { id: "c", text: "Probar más viajes antes de cambiar la flota." },
            { id: "d", text: "Cambiar media flota y dejar de medir.", why: "Media flota sigue siendo un gasto sin vuelta atrás y, sin medir, nunca sabrías si resultó." }
          ],
          correct: "c",
          hint: "Compara dos costos: equivocarte con toda la flota o esperar dos semanas más.",
          explanation:
            "El rango de −1 a +5 aún no dice si la vela ayuda. Como el error es caro e irreversible y probar más es barato, conviene angostar el rango primero. Si el cambio fuera barato y reversible, decidir ya sería razonable.",
          takeaway: "Cuanto más caro e irreversible es el error, más vale esperar mejores datos."
        }
      ]
    },
    {
      slug: "deployment-monitor",
      name: "Frontera de los Modelos",
      topic: "Promedios que esconden grupos",
      skill: "muestreo",
      story: {
        opening:
          "En la Frontera de los Modelos, un modelo pronostica tormentas para todo el archipiélago y su tablero luce un número orgulloso. Hace poco se sumó una región, Costa Nueva, y sus pescadores dicen que allí el pronóstico falla seguido. Capitán Nexus pide abrir el promedio.",
        closing:
          "El promedio ya no esconde a nadie: la tripulación abre cada número por grupo antes de confiar en él. Aquí termina la gran travesía del archipiélago: ya sabes dudar, medir y decidir con datos. ¡Buen viento!"
      },
      challenges: [
        {
          id: "de-deployment-monitor-1",
          type: "pick",
          concept: "Lo que el promedio esconde",
          prompt: "El tablero resume todo en un solo número y se ve bien. Toca la región donde el modelo acierta en menor proporción.",
          evidence: {
            kind: "table",
            title: "Pronósticos de tormenta por región",
            columns: ["Región", "Pronósticos", "Aciertos"],
            rows: [
              { id: "norte", cells: ["Norte", "400", "376"] },
              { id: "centro", cells: ["Centro", "400", "372"] },
              { id: "sur", cells: ["Sur", "200", "182"] },
              { id: "nueva", cells: ["Costa Nueva", "200", "126"] }
            ]
          },
          correct: "nueva",
          why: {
            norte: "376 de 400 es 94%: la mejor proporción de la tabla.",
            centro: "372 de 400 es 93%. Compara aciertos con pronósticos en cada fila.",
            sur: "182 de 200 es 91%. Hay otra región con los mismos pronósticos y menos aciertos."
          },
          hint: "No compares aciertos a secas: divídelos por los pronósticos de cada región.",
          explanation:
            "Costa Nueva acierta 126 de 200: 63%. Las otras tres regiones están entre 91% y 94%. Como Costa Nueva aporta pocos casos, casi no mueve el número general.",
          takeaway: "Un buen promedio puede esconder a un grupo al que le va mal."
        },
        {
          id: "de-deployment-monitor-2",
          type: "numeric",
          concept: "Promedio ponderado",
          prompt: "El modelo acierta 93% en las regiones antiguas y 63% en Costa Nueva. ¿Cuál es su porcentaje de aciertos general?",
          evidence: {
            kind: "table",
            title: "Regiones antiguas y región nueva",
            columns: ["Zona", "Pronósticos", "Aciertos"],
            rows: [
              { id: "antiguas", cells: ["Norte, Centro y Sur", "1.000", "93%"] },
              { id: "nueva", cells: ["Costa Nueva", "200", "63%"] }
            ]
          },
          answer: 88,
          tolerance: 0,
          unit: "%",
          hint: "No promedies 93 y 63 directamente: cada zona pesa según cuántos pronósticos tiene.",
          explanation:
            "Son 930 aciertos en las antiguas y 126 en Costa Nueva: 1.056 de 1.200, es decir, 88%. No es 78% (el punto medio) porque las regiones antiguas pesan cinco veces más.",
          takeaway: "El promedio general se parece al grupo más grande y tapa al más chico."
        },
        {
          id: "de-deployment-monitor-3",
          type: "choice",
          concept: "Vigilar por grupo",
          prompt: "El número general sigue en 88%, pero en Costa Nueva el modelo acierta 63%. ¿Qué haces antes de seguir usándolo allí?",
          evidence: {
            kind: "bars",
            title: "Aciertos del modelo",
            unit: "%",
            bars: [
              { id: "antiguas", label: "Antiguas", value: 93 },
              { id: "general", label: "General", value: 88 },
              { id: "nueva", label: "Costa Nueva", value: 63, tone: "warn" }
            ]
          },
          options: [
            { id: "a", text: "Seguir igual: 88% general es un buen número.", why: "Ese 88% casi no refleja a Costa Nueva. Para quienes navegan allí, el modelo falla más de 1 de cada 3 veces." },
            { id: "b", text: "Apagar el modelo en todo el archipiélago.", why: "En las regiones antiguas acierta 93%. El problema está localizado: no hace falta perder lo que funciona." },
            { id: "c", text: "Sacar a Costa Nueva del tablero general.", why: "Eso mejora el número, no el pronóstico. Los pescadores de Costa Nueva seguirían recibiendo avisos poco fiables." },
            { id: "d", text: "Revisar y ajustar el modelo con datos de allí." }
          ],
          correct: "d",
          hint: "¿Con datos de qué regiones aprendió el modelo? ¿Y dónde se está usando ahora?",
          explanation:
            "El modelo aprendió con las regiones antiguas, donde acierta 93%. En Costa Nueva baja a 63%: antes de confiar en él allí hay que revisarlo y ajustarlo con datos de esa región, y vigilar cada región por separado.",
          takeaway: "Un modelo se vigila grupo por grupo, sobre todo donde nunca se había usado."
        }
      ]
    }
  ]
};
