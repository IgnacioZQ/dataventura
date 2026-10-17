import type { Route } from "../types";

export const rutaEvidencia: Route = {
  slug: "ruta-de-la-evidencia",
  name: "Travesía de la evidencia",
  subtitle: "Aprende a leer las primeras pistas",
  level: "Nivel 1 · Inicial",
  difficulty: "BASIC",
  islands: [
    {
      slug: "quality",
      name: "Isla del Dato Perdido",
      topic: "Valores faltantes",
      skill: "calidad",
      story: {
        opening:
          "Al amanecer llega una alerta al Puerto de los Datos: el equipo comercial no logra explicar por qué el total de ventas cambia cada vez que actualiza su informe. En el manifiesto hay casillas vacías.",
        closing:
          "El manifiesto ya no asusta a nadie: ahora la tripulación sabe cuánto falta, por qué falta y qué hacer con cada vacío."
      },
      challenges: [
        {
          id: "ev-quality-1",
          type: "choice",
          concept: "Faltante no es cero",
          prompt: "¿Qué conviene hacer antes de calcular el total de ventas?",
          context: "Algunos vacíos son de clientes nuevos; otros, de ventas que aún no se sincronizan.",
          evidence: {
            kind: "table",
            title: "Manifiesto de ventas",
            columns: ["Registros", "Cantidad"],
            rows: [
              { id: "total", cells: ["Revisados", "100"] },
              { id: "con", cells: ["Con monto", "82"] },
              { id: "sin", cells: ["Sin monto", "18"], tone: "warn" }
            ]
          },
          options: [
            { id: "a", text: "Borrar las 18 filas vacías y sumar las demás.", why: "Borrar sin mirar puede eliminar ventas reales que solo no se sincronizaron: el total quedaría corto." },
            { id: "b", text: "Rellenar los vacíos con $0 y sumar todo.", why: "Un vacío no es una venta de $0. Tratarlo como cero inventa un dato que nadie registró." },
            { id: "c", text: "Averiguar por qué faltan y decidir según la causa." },
            { id: "d", text: "Sumar igual: 18 de 100 no mueve la tendencia.", why: "18% es mucho. Si esos registros son distintos del resto, el total y la tendencia cambian." }
          ],
          correct: "c",
          hint: "Un espacio vacío puede significar cosas distintas. ¿Qué necesitas saber antes de tocarlo?",
          explanation:
            "Los vacíos tienen causas distintas: una venta sin sincronizar existe aunque no se vea; un cliente nuevo quizá aún no compra. La causa define si esperas, imputas o excluyes.",
          takeaway: "Antes de tratar un dato faltante, averigua por qué falta."
        },
        {
          id: "ev-quality-2",
          type: "pick",
          concept: "Vacío vs. valor registrado",
          prompt: "Solo una fila tiene un dato realmente faltante. Tócala.",
          evidence: {
            kind: "table",
            title: "Ventas del día",
            columns: ["Cliente", "Monto", "Estado"],
            rows: [
              { id: "r1", cells: ["Almacén Faro", "$42.000", "Sincronizado"] },
              { id: "r2", cells: ["Botica Ancla", "—", "Pendiente"] },
              { id: "r3", cells: ["Café Marea", "$0", "Cortesía"] },
              { id: "r4", cells: ["Taller Proa", "$18.500", "Sincronizado"] }
            ]
          },
          correct: "r2",
          why: {
            r3: "$0 es un valor registrado: la cortesía se anotó a propósito. Faltante es cuando no hay dato.",
            r1: "Esta fila tiene monto y está sincronizada. Busca dónde no hay ningún valor.",
            r4: "Esta fila tiene monto y está sincronizada. Busca dónde no hay ningún valor."
          },
          hint: "Cero es una cantidad. ¿En qué fila no hay cantidad alguna?",
          explanation:
            "Botica Ancla no tiene monto porque su venta sigue pendiente: el dato existe en el mundo, pero no llegó a la tabla. Café Marea sí tiene dato: $0, anotado como cortesía.",
          takeaway: "Cero es un dato; vacío es ausencia de dato. No son intercambiables."
        },
        {
          id: "ev-quality-3",
          type: "numeric",
          concept: "Medir cuánto falta",
          prompt: "¿Qué porcentaje de los registros no tiene monto?",
          evidence: {
            kind: "stats",
            title: "Informe de la bodega",
            items: [
              { id: "total", label: "Registros", value: "200" },
              { id: "sin", label: "Sin monto", value: "30", tone: "warn" }
            ]
          },
          answer: 15,
          tolerance: 0,
          unit: "%",
          hint: "Divide los registros sin monto por el total y multiplica por 100.",
          explanation: "30 ÷ 200 = 0,15, es decir, 15%. Con ese tamaño, lo que decidas hacer con los vacíos cambia el resultado.",
          takeaway: "Mide cuánto falta: un 2% y un 15% de vacíos no se tratan igual."
        }
      ]
    },
    {
      slug: "integrity",
      name: "Isla del Eco",
      topic: "Duplicados",
      skill: "calidad",
      story: {
        opening:
          "En la Isla del Eco, cada grito vuelve repetido. En el registro del puerto pasa lo mismo: dos barcos aparecen con el mismo nombre, código y fecha. La capitana quiere saber si son gemelos o un eco del sistema.",
        closing: "Los ecos quedaron identificados. En el registro, cada cliente cuenta una sola vez."
      },
      challenges: [
        {
          id: "ev-integrity-1",
          type: "choice",
          concept: "Copia exacta",
          prompt: "Los dos registros coinciden en todo. ¿Qué haces?",
          evidence: {
            kind: "compare",
            title: "Dos registros bajo la lupa",
            records: [
              { id: "a", label: "Registro 01", fields: [{ key: "Clave", value: "C-1042" }, { key: "Alta", value: "12 mar" }, { key: "Plan", value: "Básico" }] },
              { id: "b", label: "Registro 02", fields: [{ key: "Clave", value: "C-1042" }, { key: "Alta", value: "12 mar" }, { key: "Plan", value: "Básico" }] }
            ]
          },
          options: [
            { id: "a", text: "Dejo ambos: más filas es más evidencia.", why: "Si son la misma persona, contarla dos veces infla clientes y ventas." },
            { id: "b", text: "Confirmo que son el mismo cliente y dejo uno." },
            { id: "c", text: "Borro los dos para no arriesgarme.", why: "Perderías un cliente real. El problema es la copia, no el registro." },
            { id: "d", text: "Los promedio en una fila nueva.", why: "Promediar fabrica un registro que nunca existió. Basta con conservar uno." }
          ],
          correct: "b",
          hint: "La clave del cliente es la misma en ambos. ¿Cuántos clientes hay en realidad?",
          explanation:
            "Misma clave, misma fecha y mismo plan: es un cliente anotado dos veces. Se confirma la identidad y se conserva una sola fila.",
          takeaway: "Un duplicado se confirma por su identidad, no porque dos filas se parezcan."
        },
        {
          id: "ev-integrity-2",
          type: "pick",
          concept: "Homónimo no es duplicado",
          prompt: "Hay tres «Ana Rojas». Toca la que NO es un duplicado, sino otra persona.",
          evidence: {
            kind: "table",
            title: "Registro de clientes",
            columns: ["ID", "Nombre", "Correo"],
            rows: [
              { id: "r1", cells: ["C-2001", "Ana Rojas", "ana@faro.cl"] },
              { id: "r2", cells: ["C-2002", "Ana Rojas", "ana@faro.cl"] },
              { id: "r3", cells: ["C-2003", "Ana Rojas", "arojas@puerto.cl"] },
              { id: "r4", cells: ["C-2004", "Luis Vera", "lvera@muelle.cl"] }
            ]
          },
          correct: "r3",
          why: {
            r1: "Comparte correo con otra fila: todo indica que es la misma persona anotada dos veces.",
            r2: "Comparte correo con otra fila: todo indica que es la misma persona anotada dos veces.",
            r4: "Luis no se repite. Busca entre las Ana Rojas."
          },
          hint: "El nombre se repite, pero ¿qué dato identifica mejor a una persona?",
          explanation:
            "C-2001 y C-2002 comparten correo: son la misma Ana. C-2003 tiene otro correo: es una homónima. Si unieras por nombre, borrarías a una clienta real.",
          takeaway: "El nombre no identifica: compara datos únicos como correo o documento."
        },
        {
          id: "ev-integrity-3",
          type: "multi",
          concept: "Señales de identidad",
          prompt: "¿Qué coincidencias sirven para confirmar que dos filas son la misma persona?",
          context: "Selecciona todas las que correspondan.",
          options: [
            { id: "a", text: "El mismo correo verificado" },
            { id: "b", text: "El mismo número de documento" },
            { id: "c", text: "El mismo nombre de pila" },
            { id: "d", text: "La misma comuna" }
          ],
          correct: ["a", "b"],
          hint: "Piensa en datos que casi nunca comparten dos personas distintas.",
          explanation:
            "Un correo verificado o un documento pertenecen a una sola persona. En cambio, miles comparten nombre de pila o comuna.",
          takeaway: "Para unir registros usa identificadores únicos, no rasgos comunes."
        }
      ]
    },
    {
      slug: "distribution",
      name: "Isla del Valor Extremo",
      topic: "Outliers",
      skill: "distribucion",
      story: {
        opening:
          "La isla de las tiendas celebra una semana récord. En el gráfico, una sola compra sobresale como un faro enorme. ¿Error de tipeo, cliente extraordinario o ambas cosas?",
        closing: "El faro resultó ser una compra real y excepcional. La tripulación ya no deja que un solo dato hable por todos."
      },
      challenges: [
        {
          id: "ev-distribution-1",
          type: "pick",
          concept: "Detectar el extremo",
          prompt: "Toca el valor que se escapa del patrón.",
          evidence: {
            kind: "bars",
            title: "Gasto semanal por cliente",
            unit: "$",
            bars: [
              { id: "c1", label: "Inés", value: 18 },
              { id: "c2", label: "Tomás", value: 42 },
              { id: "c3", label: "Rayén", value: 310 },
              { id: "c4", label: "Olga", value: 25 },
              { id: "c5", label: "Beto", value: 31 }
            ]
          },
          correct: "c3",
          hint: "Compara cada barra con sus vecinas. ¿Cuál vive en otra escala?",
          explanation: "Cuatro clientes gastan entre $18 y $42. Rayén gastó $310: más de siete veces el siguiente valor.",
          takeaway: "Un outlier es un valor muy alejado del resto. Verlo es el primer paso."
        },
        {
          id: "ev-distribution-2",
          type: "numeric",
          concept: "Mediana vs. promedio",
          prompt: "El promedio de estos cinco gastos es $200. ¿Cuál es la mediana?",
          context: "La mediana es el valor del centro cuando ordenas los datos.",
          evidence: {
            kind: "bars",
            title: "Cinco gastos ordenados",
            unit: "$",
            bars: [
              { id: "g1", label: "1º", value: 10 },
              { id: "g2", label: "2º", value: 20 },
              { id: "g3", label: "3º", value: 30 },
              { id: "g4", label: "4º", value: 40 },
              { id: "g5", label: "5º", value: 900 }
            ]
          },
          answer: 30,
          tolerance: 0,
          unit: "$",
          hint: "Con cinco datos ordenados, el del centro es el tercero.",
          explanation:
            "La mediana es $30. El promedio ($200) no se parece a ningún cliente: lo arrastra el gasto de $900. La mediana describe mejor al cliente típico.",
          takeaway: "Con valores extremos, la mediana resume mejor que el promedio."
        },
        {
          id: "ev-distribution-3",
          type: "choice",
          concept: "Qué hacer con un outlier",
          prompt: "Aparece una compra de $9.500 en una semana donde casi todos gastan menos de $50. ¿Qué haces?",
          options: [
            { id: "a", text: "La borro: un valor extremo siempre es ruido.", why: "Puede ser una compra real. Borrarla sin revisar esconde justo lo más interesante." },
            { id: "b", text: "Reviso si es un error o una compra real." },
            { id: "c", text: "La reemplazo por el promedio y sigo.", why: "El promedio ya está contaminado por ese valor, y además borrarías una posible historia real." },
            { id: "d", text: "La uso como el gasto típico del cliente.", why: "Un caso excepcional no describe a los demás: casi todos gastan menos de $50." }
          ],
          correct: "b",
          hint: "¿Qué necesitas saber de esa compra antes de decidir su destino?",
          explanation:
            "Un extremo puede ser un error de tipeo o un cliente extraordinario. Solo al verificarlo sabes si corregirlo, apartarlo o contarlo como hallazgo.",
          takeaway: "Un outlier se investiga antes de borrarlo o creerle."
        }
      ]
    },
    {
      slug: "visualization",
      name: "Isla del Espejo",
      topic: "Escalas engañosas",
      skill: "visualizacion",
      story: {
        opening:
          "En el Observatorio de la Isla del Espejo, un cartel anuncia un salto espectacular en las visitas. Nexus se acerca, mira el eje vertical y sonríe: «Este espejo agranda las cosas».",
        closing: "El espejo ya no engaña a la tripulación: ahora leen los números del eje antes de creerle al dibujo."
      },
      challenges: [
        {
          id: "ev-visualization-1",
          type: "choice",
          concept: "Eje truncado",
          prompt: "Los dos gráficos usan los mismos datos. ¿Por qué el primero parece un salto enorme?",
          evidence: {
            kind: "bars",
            title: "Visitas al observatorio",
            bars: [
              { id: "lun", label: "Lun", value: 96 },
              { id: "mar", label: "Mar", value: 98 },
              { id: "mie", label: "Mié", value: 101 },
              { id: "jue", label: "Jue", value: 104 }
            ],
            baseline: 94,
            compareBaseline: 0
          },
          options: [
            { id: "a", text: "Porque su eje parte en 94 y exagera la diferencia." },
            { id: "b", text: "Porque muestra datos más recientes que el otro.", why: "Ambos gráficos tienen exactamente los mismos cuatro valores." },
            { id: "c", text: "Porque sus barras son más anchas.", why: "El ancho es igual. Lo que cambia es desde dónde nace cada barra." },
            { id: "d", text: "Porque el segundo esconde valores.", why: "El segundo muestra todo desde cero: no esconde nada, pone la diferencia en proporción." }
          ],
          correct: "a",
          hint: "Mira el número donde nacen las barras en cada gráfico.",
          explanation:
            "De 96 a 104 hay un 8% de aumento. Al partir el eje en 94, la última barra se ve cinco veces más alta que la primera. Los datos son los mismos; cambia la historia que parece contar.",
          takeaway: "Un eje que no parte en cero exagera las diferencias entre barras."
        },
        {
          id: "ev-visualization-2",
          type: "numeric",
          concept: "Leer el eje, no la altura",
          prompt: "La barra se ve el triple de alta. ¿De cuánto es el aumento real, en porcentaje?",
          evidence: {
            kind: "bars",
            title: "Ventas antes y después de la campaña",
            bars: [
              { id: "antes", label: "Antes", value: 100 },
              { id: "despues", label: "Después", value: 104 }
            ],
            baseline: 98
          },
          answer: 4,
          tolerance: 0,
          unit: "%",
          hint: "Olvida el dibujo: ¿cuánto subió el número y sobre qué base?",
          explanation: "De 100 a 104 es un aumento de 4%. El gráfico lo hace parecer un 200% porque el eje parte en 98.",
          takeaway: "Lee los números del eje: la altura de la barra puede mentir."
        },
        {
          id: "ev-visualization-3",
          type: "multi",
          concept: "Lista de chequeo visual",
          prompt: "¿Qué revisas para que un gráfico no te engañe?",
          context: "Selecciona todas las que correspondan.",
          options: [
            { id: "a", text: "Dónde parte cada eje" },
            { id: "b", text: "Las unidades que usa" },
            { id: "c", text: "Qué tan vivos son los colores" },
            { id: "d", text: "El periodo que muestra" }
          ],
          correct: ["a", "b", "d"],
          hint: "Tres de estas cosas cambian lo que el gráfico significa. Una solo cambia cómo luce.",
          explanation:
            "Inicio del eje, unidades y periodo determinan qué se compara y cuánto. El color llama la atención, pero no cambia los datos.",
          takeaway: "Antes de creerle a un gráfico: eje, unidades y periodo."
        }
      ]
    },
    {
      slug: "causality",
      name: "Isla de las Corrientes",
      topic: "Correlación y causalidad",
      skill: "causalidad",
      story: {
        opening:
          "En la Isla de las Corrientes, las ventas de helado y los accidentes en el agua suben al mismo tiempo. Un titular ya culpa al helado. Nexus pide mirar el termómetro.",
        closing:
          "El helado quedó absuelto. La tripulación aprendió a buscar la corriente oculta que mueve dos velas a la vez. ¡Primera travesía completada!"
      },
      challenges: [
        {
          id: "ev-causality-1",
          type: "choice",
          concept: "Causa común",
          prompt: "Helados y accidentes en el agua suben juntos. ¿Cuál es la explicación más razonable?",
          evidence: {
            kind: "lines",
            title: "Dos curvas, una estación",
            xLabels: ["Jul", "Sep", "Nov", "Ene", "Mar", "May"],
            series: [
              { id: "helados", label: "Ventas de helado", values: [20, 35, 60, 95, 55, 25] },
              { id: "accidentes", label: "Accidentes en el agua", values: [2, 4, 8, 12, 6, 3] }
            ],
            normalize: true,
            note: "Cada curva está en su propia escala."
          },
          options: [
            { id: "a", text: "El helado provoca accidentes en el agua.", why: "Que suban juntos no dice que uno empuje al otro. ¿Qué más pasa en enero?" },
            { id: "b", text: "El calor del verano empuja ambas curvas." },
            { id: "c", text: "Los accidentes dan ganas de comer helado.", why: "Invertir la flecha no ayuda: sigue faltando algo que explique por qué ambos suben en verano." },
            { id: "d", text: "Es casualidad: no hay nada que explicar.", why: "El patrón se repite cada verano. Hay algo sistemático detrás: una causa compartida." }
          ],
          correct: "b",
          hint: "¿Qué tienen en común los meses donde ambas curvas tocan su punto más alto?",
          explanation:
            "Con calor, más gente compra helado y más gente se mete al agua. La temperatura es una tercera variable que mueve a las dos: se correlacionan sin que una cause la otra.",
          takeaway: "Si dos cosas suben juntas, busca una tercera que mueva a ambas."
        },
        {
          id: "ev-causality-2",
          type: "order",
          concept: "Fuerza de la evidencia",
          prompt: "Ordena la evidencia de la más débil a la más fuerte para afirmar que A causa B.",
          items: [
            { id: "anecdota", text: "La anécdota de un conocido" },
            { id: "curvas", text: "Dos curvas que suben juntas" },
            { id: "grupos", text: "Comparar grupos muy parecidos" },
            { id: "experimento", text: "Un experimento con asignación al azar" }
          ],
          hint: "Mientras más explicaciones alternativas descarta, más fuerte es la evidencia.",
          explanation:
            "Una anécdota es un solo caso. Una correlación suma casos, pero no descarta causas ocultas. Comparar grupos parecidos descarta algunas. El azar las reparte por igual entre los grupos.",
          takeaway: "No toda evidencia pesa igual: el experimento al azar es la más fuerte."
        },
        {
          id: "ev-causality-3",
          type: "choice",
          concept: "Variable de confusión",
          prompt: "Titular: «Las ciudades con más bomberos tienen más incendios». ¿Qué conclusión es sensata?",
          evidence: {
            kind: "table",
            title: "Tres ciudades del archipiélago",
            columns: ["Ciudad", "Habitantes", "Bomberos", "Incendios"],
            rows: [
              { id: "c1", cells: ["Caleta Chica", "5 mil", "12", "30"] },
              { id: "c2", cells: ["Puerto Medio", "25 mil", "60", "150"] },
              { id: "c3", cells: ["Gran Bahía", "125 mil", "300", "760"] }
            ]
          },
          options: [
            { id: "a", text: "Los bomberos provocan incendios.", why: "Mira la columna de habitantes: hay algo que crece junto con ambas cifras." },
            { id: "b", text: "Conviene reducir la dotación de bomberos.", why: "Esa decisión asume que los bomberos causan incendios, y la tabla sugiere otra explicación." },
            { id: "c", text: "Las ciudades grandes tienen más de ambos." },
            { id: "d", text: "La tabla está mal medida y no sirve.", why: "Nada indica un error de medición. Los datos son coherentes: falta leer la columna que los explica." }
          ],
          correct: "c",
          hint: "Hay una columna que el titular no menciona.",
          explanation:
            "A más habitantes, más incendios y también más bomberos. El tamaño de la ciudad mueve ambas cifras: es la variable de confusión que el titular omitió.",
          takeaway: "Antes de aceptar «A causa B», pregunta qué otra cosa crece con ambas."
        }
      ]
    }
  ]
};
