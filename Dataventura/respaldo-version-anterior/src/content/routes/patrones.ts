import type { Route } from "../types";

export const rutaPatrones: Route = {
  slug: "mar-de-los-patrones",
  name: "Mar de los patrones",
  subtitle: "Compara señales y descubre estructuras",
  level: "Nivel 2 · Intermedio",
  difficulty: "INTERMEDIATE",
  islands: [
    {
      slug: "sampling-bias",
      name: "Isla de las Voces",
      topic: "Sesgo de muestreo",
      skill: "muestreo",
      story: {
        opening:
          "Al entrar al Mar de los Patrones, la tripulación lanza una encuesta desde el faro de la app. Llegan muchas voces de los navegantes de todos los días y casi ninguna de las islas lejanas. Nexus pregunta: «¿Quién no está hablando?».",
        closing:
          "La tripulación ya no cuenta solo las voces que llegan: ahora pregunta quién quedó en silencio y sale a buscarlo."
      },
      challenges: [
        {
          id: "pa-sampling-bias-1",
          type: "numeric",
          concept: "Quién responde y quién no",
          prompt:
            "Hay 1.000 personas registradas. Responde el 62% de quienes abren la app a diario y el 4% del resto. ¿Cuántas respuestas llegan del grupo que casi nunca la abre?",
          evidence: {
            kind: "grid",
            title: "Personas registradas en la app",
            unitLabel: "Cada punto = 10 personas",
            groups: [
              { id: "diario", label: "La abren a diario", count: 20, tone: "accent" },
              { id: "poco", label: "Casi nunca la abren", count: 80, tone: "neutral" }
            ],
            note: "Tasa de respuesta: 62% entre los diarios, 4% entre el resto."
          },
          answer: 32,
          tolerance: 0,
          unit: "respuestas",
          hint: "Primero cuenta cuántas personas hay en ese grupo. Después aplica su tasa de respuesta.",
          explanation:
            "El 4% de 800 es 32. De los 200 diarios responde el 62%: 124. El grupo que es el 80% de la app aporta solo 32 de las 156 respuestas.",
          takeaway: "Una muestra puede ser grande y aun así dejar casi sin voz a la mayoría."
        },
        {
          id: "pa-sampling-bias-2",
          type: "choice",
          concept: "Sesgo de supervivencia",
          prompt: "La naviera encuestó solo a quienes compraron un segundo pasaje. ¿Qué falta para creer que «9 de cada 10 quedan conformes»?",
          evidence: {
            kind: "stats",
            title: "Encuesta de la naviera",
            items: [
              { id: "primer", label: "Hicieron un primer viaje", value: "500" },
              { id: "volvieron", label: "Volvieron a viajar", value: "150" },
              { id: "encuestados", label: "Encuestados", value: "150", detail: "Solo quienes volvieron" },
              { id: "conformes", label: "Conformes", value: "135", detail: "90% de los encuestados" }
            ]
          },
          options: [
            { id: "a", text: "Nada: 135 de 150 es una mayoría contundente.", why: "La mayoría es real, pero dentro de un grupo filtrado. Mira cuántos pasajeros nunca recibieron la encuesta." },
            { id: "b", text: "Más respuestas de quienes volvieron a viajar.", why: "Sumar más personas del mismo grupo repite el mismo filtro: el resultado se afina, pero sigue torcido." },
            { id: "c", text: "La opinión de los 350 que no volvieron a viajar." },
            { id: "d", text: "Repetir la misma encuesta el próximo mes.", why: "Si se invita con el mismo criterio, el segundo resultado hereda el mismo problema que el primero." }
          ],
          correct: "c",
          hint: "Compara cuántos viajaron una vez con cuántos fueron encuestados. ¿Dónde es más probable que esté el descontento?",
          explanation:
            "De 500 pasajeros solo se encuestó a los 150 que volvieron: justo los que tenían menos motivos de queja. Los 350 que no regresaron pueden pensar muy distinto y no aparecen en el 90%.",
          takeaway: "Si solo miras a quienes se quedaron, no sabrás por qué se fueron los demás."
        },
        {
          id: "pa-sampling-bias-3",
          type: "multi",
          concept: "Muestra representativa",
          prompt: "El equipo repetirá la encuesta de la app. ¿Qué acciones acercan la muestra a todas las personas registradas?",
          context: "Selecciona todas las que correspondan.",
          options: [
            { id: "a", text: "Sortear a quién invitar entre todas las personas registradas" },
            { id: "b", text: "Dejarla abierta hasta juntar el doble de respuestas" },
            { id: "c", text: "Insistir por otro canal con quienes no respondieron" },
            { id: "d", text: "Comparar el perfil de quienes responden con el del total" },
            { id: "e", text: "Mostrarla dentro de la app a quien entre ese día" }
          ],
          correct: ["a", "c", "d"],
          hint: "Pregúntate en cada caso: ¿esto cambia quién responde o solo cuántos responden?",
          explanation:
            "El sorteo da a todos la misma opción de ser invitados, insistir recupera a quienes suelen callar y comparar perfiles muestra quién sigue faltando. Más respuestas o un aviso dentro de la app traen más de los mismos usuarios frecuentes.",
          takeaway: "Representativa no es grande: es que todos tengan la misma opción de aparecer."
        }
      ]
    },
    {
      slug: "group-comparisons",
      name: "Puerto Gemelo",
      topic: "Tasas y denominadores",
      skill: "comparacion",
      story: {
        opening:
          "Dos puertos vecinos discuten cuál es más seguro. El Puerto A anota más incidentes en su bitácora, pero también recibe muchísimos más barcos. El Capitán Nexus pide una balanza que no dependa del tamaño.",
        closing: "La discusión terminó cuando ambos puertos se midieron por viaje. La tripulación ya no compara totales sin mirar el denominador."
      },
      challenges: [
        {
          id: "pa-group-comparisons-1",
          type: "numeric",
          concept: "Calcular una tasa",
          prompt: "¿Cuántos incidentes hubo en el Puerto A por cada 100 viajes?",
          evidence: {
            kind: "stats",
            title: "Bitácora del Puerto A",
            items: [
              { id: "incidentes", label: "Incidentes", value: "240" },
              { id: "viajes", label: "Viajes", value: "12.000" }
            ]
          },
          answer: 2,
          tolerance: 0,
          unit: "por cada 100 viajes",
          hint: "Divide los incidentes por los viajes y lleva el resultado a 100 viajes.",
          explanation:
            "240 ÷ 12.000 = 0,02. Multiplicado por 100 da 2 incidentes por cada 100 viajes. Esa cifra ya no depende de cuántos barcos recibe el puerto.",
          takeaway: "Una tasa divide los casos por las oportunidades: así se comparan tamaños distintos."
        },
        {
          id: "pa-group-comparisons-2",
          type: "pick",
          concept: "Riesgo por viaje",
          prompt: "Vas a zarpar una sola vez. Toca el puerto donde un viaje tiene más riesgo de incidente.",
          evidence: {
            kind: "table",
            title: "Cuatro puertos del archipiélago",
            columns: ["Puerto", "Incidentes", "Viajes"],
            rows: [
              { id: "pa", cells: ["Puerto A", "240", "12.000"] },
              { id: "pb", cells: ["Puerto B", "80", "2.000"] },
              { id: "pc", cells: ["Puerto C", "150", "5.000"] },
              { id: "pd", cells: ["Puerto D", "30", "1.500"] }
            ]
          },
          correct: "pb",
          why: {
            pa: "Tiene el mayor total, pero repartido en 12.000 viajes. Calcula cuántos incidentes hay por cada 100.",
            pc: "Su tasa no es la más alta de la tabla. Divide incidentes por viajes en cada fila y compara.",
            pd: "Tiene pocos incidentes y también una tasa baja. Divide incidentes por viajes en cada fila y compara."
          },
          hint: "A ti te importa un viaje, no el total del puerto. ¿Qué número responde eso en cada fila?",
          explanation:
            "Por cada 100 viajes: A tiene 2 incidentes, B tiene 4, C tiene 3 y D tiene 2. El Puerto B, con solo 80 incidentes, es el más riesgoso por viaje.",
          takeaway: "El total más alto no señala el mayor riesgo: compara siempre la tasa."
        },
        {
          id: "pa-group-comparisons-3",
          type: "choice",
          concept: "Absoluto vs. relativo",
          prompt: "Titular del diario local: «El Puerto A triplica los incidentes del Puerto B». ¿Qué lectura es justa?",
          evidence: {
            kind: "compare",
            title: "Los puertos gemelos",
            records: [
              { id: "pa", label: "Puerto A", fields: [{ key: "Incidentes", value: "240" }, { key: "Viajes", value: "12.000" }, { key: "Por cada 100 viajes", value: "2" }] },
              { id: "pb", label: "Puerto B", fields: [{ key: "Incidentes", value: "80" }, { key: "Viajes", value: "2.000" }, { key: "Por cada 100 viajes", value: "4" }] }
            ]
          },
          options: [
            { id: "a", text: "Es correcto: con el triple de incidentes, A es el más riesgoso.", why: "El triple es cierto en total, pero A hace seis veces más viajes. El total no dice qué le espera a cada barco." },
            { id: "b", text: "No hay comparación posible entre puertos de distinto tamaño.", why: "Sí se pueden comparar: para eso existen las tasas, que ponen a ambos sobre la misma base." },
            { id: "c", text: "Empatan: A tiene más viajes y eso compensa sus incidentes.", why: "Que el tamaño influya no significa que empaten. Mira la última fila: las tasas no son iguales." },
            { id: "d", text: "Es cierto en total, pero por viaje B tiene el doble de riesgo." }
          ],
          correct: "d",
          hint: "El titular usa una fila de la ficha. ¿Qué dice la fila que ya considera el tamaño?",
          explanation:
            "240 es el triple de 80, así que el titular no miente. Pero A hace 12.000 viajes y B solo 2.000: por cada 100 viajes, B tiene 4 incidentes y A tiene 2.",
          takeaway: "Un titular puede ser cierto en totales y engañar sobre el riesgo."
        }
      ]
    },
    {
      slug: "metric-drift",
      name: "Isla de la Métrica",
      topic: "Definiciones que cambian",
      skill: "comparacion",
      story: {
        opening:
          "En la Isla de la Métrica hay fiesta: la retención subió de un mes a otro. Nexus revisa la letra chica de la bitácora y descubre que este mes alguien cambió qué significa «usuario activo».",
        closing: "La fiesta se pospuso hasta medir los dos meses con la misma regla. La tripulación ya lee la definición antes de celebrar la cifra."
      },
      challenges: [
        {
          id: "pa-metric-drift-1",
          type: "choice",
          concept: "Misma palabra, otra medida",
          prompt: "La retención subió justo el mes en que cambió la definición de usuario activo. ¿Qué conclusión es sensata?",
          evidence: {
            kind: "compare",
            title: "Informe de retención",
            records: [
              { id: "antes", label: "Mes pasado", fields: [{ key: "Cuenta como activo", value: "Inició sesión" }, { key: "Retención", value: "20%" }] },
              { id: "ahora", label: "Este mes", fields: [{ key: "Cuenta como activo", value: "Inició sesión o abrió una notificación" }, { key: "Retención", value: "23%" }] }
            ]
          },
          options: [
            { id: "a", text: "El producto mejoró: tres puntos más es un buen avance.", why: "Para hablar de mejora, ambos meses deben medirse igual. Aquí cambió qué se cuenta como activo." },
            { id: "b", text: "Las notificaciones funcionan: retienen a más personas.", why: "Abrir una notificación ahora cuenta como actividad por definición. Eso suma gente sin probar que se quede más." },
            { id: "c", text: "El dato de este mes es un error y hay que descartarlo.", why: "No es un error: mide bien lo que ahora define. El problema es compararlo con una cifra que medía otra cosa." },
            { id: "d", text: "Aún no se sabe: las dos cifras miden cosas distintas." }
          ],
          correct: "d",
          hint: "Piensa en alguien que solo abrió una notificación. ¿En cuál de los dos meses cuenta como activo?",
          explanation:
            "La definición nueva es más amplia: incluye a quienes solo abrieron una notificación. Parte del salto de 20% a 23%, o todo, puede venir de contar a más gente y no de un cambio real.",
          takeaway: "Si cambia la definición, cambia la métrica: no compares cifras con reglas distintas."
        },
        {
          id: "pa-metric-drift-2",
          type: "numeric",
          concept: "Puntos vs. porcentaje",
          prompt: "La retención pasó de 20% a 23%: son 3 puntos porcentuales. ¿De cuánto es el aumento relativo, en porcentaje?",
          evidence: {
            kind: "bars",
            title: "Retención mensual",
            unit: "%",
            bars: [
              { id: "antes", label: "Mes pasado", value: 20 },
              { id: "ahora", label: "Este mes", value: 23 }
            ]
          },
          answer: 15,
          tolerance: 0,
          unit: "%",
          hint: "Compara el aumento con el valor de partida, no con 100.",
          explanation:
            "3 ÷ 20 = 0,15, es decir, 15%. «Subió 3 puntos» y «subió 15%» describen el mismo cambio, pero la segunda frase suena mucho más grande.",
          takeaway: "Entre dos porcentajes, aclara si hablas de puntos o de cambio relativo."
        },
        {
          id: "pa-metric-drift-3",
          type: "order",
          concept: "Manejar un cambio de definición",
          prompt: "Cambió la definición de usuario activo. Ordena los pasos para comparar la retención de forma justa.",
          items: [
            { id: "anotar", text: "Anotar qué cambió en la definición y desde cuándo" },
            { id: "recalcular", text: "Recalcular el mes pasado con la definición nueva" },
            { id: "comparar", text: "Comparar ambos meses medidos con la misma regla" },
            { id: "publicar", text: "Publicar el resultado con una nota sobre el cambio" }
          ],
          hint: "No puedes recalcular sin saber qué cambió, ni comparar antes de tener ambas cifras con la misma regla.",
          explanation:
            "Primero se documenta el cambio. Luego se rehace la cifra anterior con la regla nueva para comparar dos números equivalentes. Al publicar, la nota evita que alguien mezcle series antiguas y nuevas.",
          takeaway: "Ante un cambio de definición: documenta, recalcula, compara y avisa."
        }
      ]
    },
    {
      slug: "forecasting",
      name: "Faro del Mañana",
      topic: "Tendencias y pronósticos",
      skill: "distribucion",
      story: {
        opening:
          "Desde el Faro del Mañana se ve una ola enorme en las ventas: un día de promoción las disparó a 260, cuando lo habitual es rondar las 100. La promo ya terminó y la capitana necesita saber cuánta mercadería cargar.",
        closing: "La bodega se cargó para un mar normal, no para la ola. La tripulación aprendió a separar lo habitual de lo excepcional antes de pronosticar."
      },
      challenges: [
        {
          id: "pa-forecasting-1",
          type: "pick",
          concept: "Elegir la base",
          prompt: "Vas a calcular la venta habitual para pronosticar la próxima semana. Toca el día que debes dejar fuera de esa base.",
          context: "La promoción duró un solo día y no se repetirá.",
          evidence: {
            kind: "bars",
            title: "Ventas diarias de la semana",
            unit: "ventas",
            bars: [
              { id: "lun", label: "Lun", value: 98 },
              { id: "mar", label: "Mar", value: 102 },
              { id: "mie", label: "Mié", value: 260 },
              { id: "jue", label: "Jue", value: 99 },
              { id: "vie", label: "Vie", value: 101 }
            ]
          },
          correct: "mie",
          why: {
            lun: "98 está dentro de lo habitual. Las pequeñas diferencias entre días normales sí pertenecen a la base.",
            mar: "102 está dentro de lo habitual. Las pequeñas diferencias entre días normales sí pertenecen a la base.",
            jue: "99 está dentro de lo habitual. Las pequeñas diferencias entre días normales sí pertenecen a la base.",
            vie: "101 está dentro de lo habitual. Las pequeñas diferencias entre días normales sí pertenecen a la base."
          },
          hint: "La base debe parecerse a los días que vienen. ¿Qué día ocurrió en condiciones que no volverán?",
          explanation:
            "El miércoles vendió 260 por una promoción que no se repetirá. Los otros cuatro días, entre 98 y 102, muestran cómo es una jornada normal: esa es la base del pronóstico.",
          takeaway: "Para pronosticar, usa como base los días que se parecen a los que vienen."
        },
        {
          id: "pa-forecasting-2",
          type: "numeric",
          concept: "Pronóstico sin el pico",
          prompt: "El promedio de los cinco días da 132, pero la promo del miércoles no se repetirá. ¿Qué venta diaria pronosticas si promedias solo los días normales?",
          evidence: {
            kind: "lines",
            title: "Ventas diarias de la semana",
            xLabels: ["Lun", "Mar", "Mié", "Jue", "Vie"],
            series: [{ id: "ventas", label: "Ventas", values: [98, 102, 260, 99, 101] }],
            unit: "ventas",
            note: "Miércoles: día de promoción."
          },
          answer: 100,
          tolerance: 0,
          unit: "ventas por día",
          hint: "Suma los cuatro días sin promoción y divide por cuatro.",
          explanation:
            "98 + 102 + 99 + 101 = 400, y 400 ÷ 4 = 100. El promedio de 132 incluye un día que no volverá: usarlo llevaría a cargar un tercio más de mercadería cada día.",
          takeaway: "Un pico irrepetible infla el promedio: sácalo antes de proyectar."
        },
        {
          id: "pa-forecasting-3",
          type: "choice",
          concept: "Estacionalidad",
          prompt: "Informe interno: «Diciembre creció 50%». ¿Qué lectura de la tabla es más justa?",
          evidence: {
            kind: "table",
            title: "Ventas mensuales",
            columns: ["Mes", "Año pasado", "Este año"],
            rows: [
              { id: "nov", cells: ["Noviembre", "2.800", "3.000"] },
              { id: "dic", cells: ["Diciembre", "5.000", "4.500"] }
            ]
          },
          options: [
            { id: "a", text: "Fue un diciembre flojo: cayó 10% frente al del año pasado." },
            { id: "b", text: "Fue un gran mes: vendió 1.500 más que en noviembre.", why: "Diciembre supera a noviembre todos los años. Ese salto describe la temporada, no el desempeño de este año." },
            { id: "c", text: "El negocio va al alza: noviembre superó al del año pasado.", why: "Noviembre sí creció, pero la pregunta es por diciembre. Compáralo con su propio mes equivalente." },
            { id: "d", text: "No se puede evaluar hasta tener las ventas de enero.", why: "Enero no aclara cómo estuvo diciembre. El dato comparable ya está en la tabla." }
          ],
          correct: "a",
          hint: "El año pasado, ¿diciembre también vendió mucho más que noviembre?",
          explanation:
            "De 3.000 a 4.500 hay un 50% más, pero el año pasado diciembre también saltó. Frente a su mes equivalente, pasó de 5.000 a 4.500: una caída de 10%.",
          takeaway: "Con estacionalidad, compara con el mismo mes del año anterior."
        }
      ]
    },
    {
      slug: "segment-mix",
      name: "Isla de las Mezclas",
      topic: "Mezcla de grupos",
      skill: "comparacion",
      story: {
        opening:
          "En la Isla de las Mezclas llega un parte inquietante: la satisfacción general cayó. Pero los vigías del Norte y del Sur juran que en sus costas mejoró. El Capitán Nexus sospecha que ambos dicen la verdad.",
        closing:
          "El misterio era la mezcla: cambió quién respondía, no qué tan bien se atendía. Con esta lección, la tripulación completa el Mar de los Patrones. ¡Segunda travesía terminada!"
      },
      challenges: [
        {
          id: "pa-segment-mix-1",
          type: "choice",
          concept: "Qué revisar primero",
          prompt: "La satisfacción subió en las dos regiones, pero la general cayó de 84% a 71%. ¿Qué revisas primero?",
          evidence: {
            kind: "table",
            title: "Clientes satisfechos",
            columns: ["Región", "Antes", "Ahora"],
            rows: [
              { id: "norte", cells: ["Norte", "90%", "95%"] },
              { id: "sur", cells: ["Sur", "60%", "65%"] },
              { id: "general", cells: ["General", "84%", "71%"], tone: "warn" }
            ]
          },
          options: [
            { id: "a", text: "La fórmula del informe: un resultado así es imposible.", why: "No es imposible. La cifra general no depende solo de cada región, sino también de cuánto pesa cada una." },
            { id: "b", text: "Cuántas respuestas aportó cada región en cada periodo." },
            { id: "c", text: "Cuál de las regiones empeoró, porque alguna tuvo que caer.", why: "La tabla ya muestra que ninguna cayó: Norte subió de 90% a 95% y Sur de 60% a 65%." },
            { id: "d", text: "El promedio simple de las dos regiones, que sí subió.", why: "Ese promedio sube de 75% a 80%, pero supone que ambas regiones pesan lo mismo. La caída general sigue sin explicación." }
          ],
          correct: "b",
          hint: "El 84% de antes está mucho más cerca del Norte que del Sur. ¿Qué te dice eso sobre quién respondía?",
          explanation:
            "La cifra general es un promedio ponderado: se acerca a la región que aporta más respuestas. Si ahora responde mucha más gente del Sur, la general baja aunque ambas regiones mejoren.",
          takeaway: "Si el total contradice a sus partes, revisa cuánto pesa cada parte."
        },
        {
          id: "pa-segment-mix-2",
          type: "numeric",
          concept: "Promedio ponderado",
          prompt: "Calcula la satisfacción general de este periodo, en porcentaje. Cada región pesa según sus respuestas.",
          evidence: {
            kind: "table",
            title: "Encuesta de este periodo",
            columns: ["Región", "Satisfechos", "Respuestas"],
            rows: [
              { id: "norte", cells: ["Norte", "95%", "200"] },
              { id: "sur", cells: ["Sur", "65%", "800"] }
            ]
          },
          answer: 71,
          tolerance: 0,
          unit: "%",
          hint: "Calcula cuántas personas satisfechas hay en cada región, súmalas y divide por el total de respuestas.",
          explanation:
            "95% de 200 son 190 personas; 65% de 800 son 520. En total, 710 de 1.000: 71%. El promedio simple daría 80%, pero el Sur pesa cuatro veces más.",
          takeaway: "El promedio de un total pondera cada grupo por su tamaño."
        },
        {
          id: "pa-segment-mix-3",
          type: "multi",
          concept: "Leer un cambio de mezcla",
          prompt: "La satisfacción general cayó de 84% a 71%. ¿Qué afirmaciones respaldan estos datos?",
          context: "Selecciona todas las que correspondan.",
          evidence: {
            kind: "table",
            title: "Satisfacción y respuestas",
            columns: ["Región", "Satisfechos", "Resp. antes", "Resp. ahora"],
            rows: [
              { id: "norte", cells: ["Norte", "90% → 95%", "800", "200"] },
              { id: "sur", cells: ["Sur", "60% → 65%", "200", "800"] }
            ]
          },
          options: [
            { id: "a", text: "El Sur pasó de aportar el 20% de las respuestas al 80%" },
            { id: "b", text: "La atención empeoró en al menos una de las regiones" },
            { id: "c", text: "Cada región está más satisfecha que en el periodo anterior" },
            { id: "d", text: "El Norte bajó su satisfacción al recibir menos respuestas" },
            { id: "e", text: "La caída general viene de quiénes responden, no de un peor servicio" }
          ],
          correct: ["a", "c", "e"],
          hint: "Lee por separado cada columna: una habla de qué tan satisfechos están; las otras, de cuántos responden.",
          explanation:
            "Antes: 720 + 120 satisfechos de 1.000, un 84%. Ahora: 190 + 520, un 71%. Ambas regiones subieron 5 puntos; lo que cambió es que el Sur, menos satisfecho, pasó de 200 a 800 respuestas.",
          takeaway: "Un total puede caer aunque cada grupo mejore, si cambia la mezcla de grupos."
        }
      ]
    }
  ]
};
