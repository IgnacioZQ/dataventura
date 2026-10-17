// Textos de la landing de Delhos: los aprobados en la versión anterior, con la voz del sistema de diseño
// (tuteo, títulos que afirman con punto final, botones de verbo + objeto). Datos de las plataformas:
// documentación oficial de Dataventura y sitio de Delhos Academy.
import type { NombreIcono } from '@/iconos-datos';

export const PALABRAS_PORTADA = ['programar.', 'pensar con datos.', 'analizar.', 'crear con IA.'];

export const TEMAS = ['Programación', 'Python', 'Pensamiento con datos', 'Estadística', 'Machine Learning', 'Visualización de datos', 'IA aplicada', 'Analítica', 'Decisión con datos', 'SQL'];

export const PILARES: { nombre: string; icono: NombreIcono; texto: string }[] = [
  { nombre: 'Educación', icono: 'educacion', texto: 'Enseñamos a programar y a pensar con datos con metodologías activas.' },
  { nombre: 'Tecnología', icono: 'tecnologia', texto: 'Diseñamos y desarrollamos nuestras propias plataformas y aplicaciones.' },
  { nombre: 'Innovación', icono: 'innovacion', texto: 'Exploramos nuevas formas de aprender: en vivo, jugando y con IA.' }
];

export const DATAVENTURA = {
  tag: 'Piensa con datos: lee, interpreta y cuestiona datos como un analista.',
  descripcion: 'Aprende a pensar con datos en 5 minutos al día, sin escribir una línea de código: preguntas interactivas con gráficos, explicación inmediata y progreso visible. Navegas el Archipiélago de los Datos en tu galeón, junto al Capitán NEXUS, resolviendo retos y repasando conceptos antes de olvidarlos.',
  chips: ['Lectura de datos y gráficos', 'Números y porcentajes', 'Razonamiento estadístico', 'Pensamiento crítico con datos', 'Decisión con datos'],
  rasgos: [
    { titulo: 'Diagnóstico gratis', texto: 'Descubre tu punto de partida en unos 3 minutos y sin crear cuenta. La versión completa entrega un informe por dimensión.' },
    { titulo: 'Una ruta en 5 etapas', texto: 'De Aprendiz a Senior: 20 mapas de islas, cada una un reto de 5 preguntas de 3 a 5 minutos.' },
    { titulo: 'Un hábito, no una tarea', texto: 'Reto del día, rachas, meta diaria de 3, 5 o 10 minutos y recordatorios.' },
    { titulo: 'Certificados de Delhos Academy', texto: 'Con Premium, un certificado por etapa completada, con código verificable.' }
  ]
};

export const ACADEMY = {
  tag: 'Aprende ciencia de datos con criterio y foco en resultados.',
  descripcion: 'Academia online de ciencia de datos, inteligencia artificial y analítica. Formación práctica y rigurosa, con clases en vivo 100% online, proyectos con datos reales del sector público y de empresas, y el acompañamiento cercano de instructores activos en la industria.',
  chips: ['Python', 'Estadística', 'Machine Learning', 'Visualización de datos', 'IA aplicada'],
  rasgos: [
    { titulo: 'Formación estructurada', texto: 'Rutas claras desde nivel inicial a avanzado, para que avances sin perderte.' },
    { titulo: 'Clases en vivo', texto: 'Sesiones sincrónicas, preguntas en tiempo real y feedback sobre tus proyectos. Todas quedan grabadas.' },
    { titulo: 'Casos reales', texto: 'Contenidos basados en datos reales del sector público y de empresas, aplicables al día siguiente.' },
    { titulo: 'Certificación profesional', texto: 'Certificado digital con las horas de formación y las competencias adquiridas.' }
  ]
};

export const DESAFIOS = [
  {
    id: 'educacion', nombre: 'Educación', icono: 'educacion' as NombreIcono, resumen: 'Mucha teoría, poca práctica',
    estados: ['Solo teoría', 'Teoría puesta en práctica'],
    titulo: 'Se enseña a repetir, no a resolver.',
    texto: 'Gran parte de la formación sigue centrada en memorizar conceptos. Pero programar y pensar con datos se aprende haciendo: probando, equivocándose y volviendo a intentar.',
    respuesta: 'Aprender haciendo: talleres en vivo con datos reales del sector público y de empresas, y retos diarios para practicar lo aprendido.'
  },
  {
    id: 'tecnologia', nombre: 'Tecnología', icono: 'tecnologia' as NombreIcono, resumen: 'Avanza más rápido que las aulas',
    estados: ['Herramientas dispersas', 'Herramientas conectadas'],
    titulo: 'La tecnología avanza más rápido que las aulas.',
    texto: 'La inteligencia artificial y las herramientas de datos cambian todo el tiempo. Sin una guía llegan tarde, dispersas, o se usan sin entender qué hay detrás.',
    respuesta: 'IA y herramientas tecnológicas como compañeras de aprendizaje, integradas en una misma experiencia.'
  },
  {
    id: 'innovacion', nombre: 'Innovación', icono: 'innovacion' as NombreIcono, resumen: 'Los mismos formatos de siempre',
    estados: ['Aprendizaje pasivo', 'Aprendizaje activo'],
    titulo: 'Se sigue aprendiendo como hace décadas.',
    texto: 'Clases donde se escucha mucho y se participa poco. Las formas nuevas de aprender, como jugar, resolver retos o interactuar en vivo, todavía son la excepción.',
    respuesta: 'Formatos distintos: clases en vivo en Delhos Academy y retos de 5 minutos en Dataventura, avanzando isla a isla.'
  }
];

export const PREGUNTAS = [
  { p: '¿Qué es Delhos?', r: 'Delhos es un ecosistema que une educación, tecnología e innovación. Creamos formas innovadoras de aprender ciencia de datos, inteligencia artificial y más, a través de Delhos Academy, nuestro servicio de cursos en vivo, y de Dataventura, nuestra app para pensar con datos.' },
  { p: '¿Qué voy a aprender con Delhos?', r: 'A programar y, además, a desarrollar pensamiento cognitivo de datos y analítica: leer, cuestionar e interpretar datos para tomar mejores decisiones. Todo con el acompañamiento de la inteligencia artificial y de herramientas tecnológicas.' },
  { p: '¿Qué es Delhos Academy?', r: 'Una academia online especializada en ciencia de datos, inteligencia artificial y analítica. Ofrece cursos, webinars y workshops en vivo, para profesionales que buscan reconvertirse, analistas que quieren escalar sus habilidades y estudiantes que desean diferenciarse.', enlace: { texto: 'Conocer Delhos Academy', destino: 'academyNosotros' as const, wipe: 'ac' as const } },
  { p: '¿Las clases son en vivo o grabadas?', r: 'Los cursos de Delhos Academy son 100% en vivo: las clases son sincrónicas e interactúas en tiempo real con el instructor y tus compañeros. Además, todas las sesiones quedan grabadas para que las revises cuando lo necesites.' },
  { p: '¿Necesito conocimientos previos?', r: 'En Delhos Academy depende del curso: hay programas desde nivel cero y otros avanzados, y cada uno indica sus requisitos y su temario. Dataventura no exige saber programar: su diagnóstico gratuito te recomienda por qué etapa empezar.' },
  { p: '¿Entregan certificado?', r: 'Sí. Al completar un curso de Delhos Academy recibes un certificado digital con las horas de formación y las competencias adquiridas. En Dataventura, con Premium, cada etapa completada entrega un certificado de Delhos Academy con un código verificable.' },
  { p: '¿Qué horarios tienen las clases?', r: 'Se programan para facilitar la participación de estudiantes de distintos países de habla hispana; por lo general hay opciones de tarde y de noche. Cada curso publica su calendario con los horarios específicos.' },
  { p: '¿Qué es Dataventura?', r: 'Es nuestra app para aprender a pensar con datos en 5 minutos al día, sin escribir código. Funciona en el navegador, se instala en el teléfono sin pasar por tiendas y parte con un diagnóstico gratuito.', enlace: { texto: 'Conocer Dataventura', destino: 'dataventura' as const, wipe: 'dv' as const } }
];

export const PAISES = ['Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba', 'Ecuador', 'El Salvador', 'España', 'Guatemala', 'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'República Dominicana', 'Uruguay', 'Venezuela', 'Otro'];
export const PERFILES = ['Estudiante', 'Profesional', 'Profesor/a', 'Institución educativa', 'Empresa', 'Otro'];
export const INTERESES = ['Delhos Academy', 'Dataventura', 'Otro tema'];
