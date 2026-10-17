// Textos de la landing en español, inglés y portugués.
// - diseno.json: los del diseño «Dataventura Landing» de Claude Design (con datos corregidos según la app real).
// - MIOS: los de las secciones que se agregaron al traspasarlo (video, dimensiones, diagnóstico, certificados,
//   preguntas frecuentes) y los textos del video de Remotion. Todo dato sale de la documentación de la app.
import diseno from './diseno.json';

export type Idioma = 'es' | 'en' | 'pt';
export const IDIOMAS: { id: Idioma; nombre: string }[] = [
  { id: 'es', nombre: 'Español' },
  { id: 'en', nombre: 'English' },
  { id: 'pt', nombre: 'Português' }
];

const es = {
  saltar: 'Saltar al contenido',
  // Título de la pestaña y descripción de cada página en el idioma elegido (en español son los del HTML).
  seo: {
    titulo: 'Dataventura · Aprende a pensar con datos en 5 minutos al día',
    descripcion: 'Dataventura, la app de Delhos para aprender a pensar con datos en 5 minutos al día, sin escribir una línea de código. Diagnóstico gratis, 5 etapas, 20 mapas y el Capitán NEXUS como guía.',
    paginas: {
      quienes: 'Dataventura nace de una idea simple: cualquier persona puede aprender a pensar con datos, sin programar ni dominar fórmulas.',
      como: 'Retos de 8 tipos, un mapa de islas, repaso espaciado y el Capitán NEXUS: así se entrena una mente analítica con Dataventura.',
      contacto: 'Escríbenos para reportar un error, proponer retos o usar Dataventura en clases.'
    }
  },
  indice: ['Aprende jugando', 'Así se juega', 'Las 5 etapas', 'Las 5 dimensiones', 'Pruébalo', 'Diagnóstico gratis', 'Certificados', 'Llévala contigo', 'Preguntas frecuentes'],
  indiceCta: 'Probar', isla: { inicio: 'La travesía', indice: 'Índice de la página', avance: 'Travesía' },
  meta: { titulo: 'Tu meta diaria', min: 'min' },
  trailer: {
    pill: 'ASÍ SE JUEGA', h: 'una partida en 26 segundos',
    p: 'Zarpas, respondes una pregunta con un gráfico real, sumas a tu racha, avanzas por la ruta y ganas tu certificado.',
    capitulos: ['Zarpa', 'Una pregunta', 'Tu racha', 'La ruta', 'Certificado', 'A navegar'], grupo: 'Capítulos del video'
  },
  etapas: {
    temas: 'Algunos temas', mapas: 'Sus 4 mapas', nota: '100 preguntas por etapa · 4 mapas de 5 islas',
    temasPorEtapa: [
      ['Elegir gráfico', 'Lectura de torta', 'Promedio', 'Fuentes confiables'],
      ['Embudo de conversión', 'Variación porcentual', 'Tipos de variables', 'Calidad de datos'],
      ['Media vs. mediana', 'Eje truncado', 'Tasas vs. absolutos', 'Margen de error'],
      ['Sesgo de no respuesta', 'Definir una métrica', 'Qué dato pedir', 'Validar una mejora'],
      ['Paradoja de Simpson', 'Regresión a la media', 'Ley de Goodhart', 'Tasa base y precisión']
    ]
  },
  dims: {
    pill: '5 DIMENSIONES', h: 'lo que entrenas sin darte cuenta',
    p: 'El pensamiento analítico no es una sola cosa. Dataventura lo separa en cinco dimensiones, las mismas que mide el diagnóstico, para que sepas dónde estás fuerte y qué reforzar.',
    arrastra: 'Arrastra las tarjetas o usa las flechas', caso: 'UN CASO ASÍ', de: 'DIMENSIÓN {n} DE 5', anterior: 'Tarjeta anterior', siguiente: 'Tarjeta siguiente', carrusel: 'Las 5 dimensiones del pensamiento analítico',
    rol: 'carrusel', causa: '¿causa?',
    lista: [
      { nombre: 'Lectura de datos y gráficos', idea: 'Lee tablas y gráficos sin perderte: ejes, escalas, barras, líneas y puntos.', ejemplo: '¿Qué sabor de helado se vendió más?' },
      { nombre: 'Números y porcentajes', idea: 'Porcentajes, puntos porcentuales, promedios y proporciones, sin enredos.', ejemplo: 'Si algo sube de 2% a 3%, ¿subió 1% o 50%?' },
      { nombre: 'Razonamiento estadístico', idea: 'Muestras, mediana, rango y variabilidad: cuánto confiar en un número.', ejemplo: '¿Dice más un promedio de 4 reseñas o uno de 400?' },
      { nombre: 'Pensamiento crítico con datos', idea: 'Que dos cosas vayan juntas no prueba que una cause la otra.', ejemplo: '¿Una segunda pantalla mejora el desempeño, o rinden más quienes ya la tenían?' },
      { nombre: 'Decisión con datos', idea: 'Comparar opciones con evidencia: tasas, contexto y lo que falta saber.', ejemplo: '¿Qué sucursal tiene más problemas: la de más reclamos o la de mayor tasa?' }
    ]
  },
  diag: {
    pill: 'DIAGNÓSTICO GRATIS', h: 'empieza por tu punto de partida',
    p: 'Sin reloj y sin corrección hasta el final: NEXUS quiere ver cómo razonas, no cuánto sabes. Al terminar te dice por qué etapa empezar. Es orientativo y no necesitas cuenta para hacerlo.',
    expres: { t: 'Exprés', d: '5 preguntas · unos 3 minutos', p: 'Tu etapa provisional al instante, con lo que mostraron tus respuestas.', cta: 'Hacer el diagnóstico exprés' },
    completo: { t: 'Completo', d: '20 preguntas · unos 12 minutos', p: 'Con cuenta: tu nivel en las 5 dimensiones y un informe con tu siguiente paso.', cta: 'Hacer el diagnóstico completo' },
    informe: 'EJEMPLO DE INFORME', niveles: 'Cada dimensión queda por reforzar, en desarrollo o sólida, y tu etapa va de Aprendiz a Senior.',
    etapa: '¡Tu etapa!', alt: 'Resultado real del diagnóstico exprés en Dataventura: etapa Aprendiz', grafico: 'Ejemplo de informe: nivel en cada una de las 5 dimensiones'
  },
  cert: {
    pill: 'CERTIFICADOS', h1: 'cada etapa,', h2: 'un certificado',
    p: 'Al completar una etapa (sus 20 islas) recibes un certificado emitido por Delhos Academy, con tu nombre, la etapa, la fecha y un código único que cualquiera puede verificar en línea.',
    bullets: ['Verificable: un código único que cualquiera puede comprobar.', 'Listo para compartir en LinkedIn, Instagram o WhatsApp.', 'Descargable en PDF.'],
    premium: 'Los certificados son un beneficio de Premium.', academy: 'Conoce Delhos Academy',
    tarjeta: { marca: 'DELHOS ACADEMY · DATAVENTURA', titulo: 'Certificado de etapa', certifica: 'Se certifica que', nombre: 'Tu nombre', completo1: 'completó la etapa', etapa: 'Explorador', completo2: 'de la ruta de pensamiento analítico con datos.', codigo: 'CÓDIGO VERIFICABLE (EJEMPLO)' }
  },
  faq: {
    pill: 'PREGUNTAS', h: 'antes de zarpar',
    items: [
      { p: '¿Qué es Dataventura?', r: 'Es la app de Delhos para aprender a pensar con datos en 5 minutos al día. Resuelves casos cortos con datos y gráficos de la vida real, recibes una explicación inmediata de cada respuesta y avanzas por un mapa de islas junto al Capitán NEXUS.' },
      { p: '¿Necesito saber programar o mucha matemática?', r: 'No. No se escribe una línea de código ni se usan fórmulas: se entrena el razonamiento. Mirar un gráfico, hacer la pregunta correcta y llegar a una conclusión que se sostenga.' },
      { p: '¿Cuánto cuesta?', r: 'Empezar es gratis: el diagnóstico no pide cuenta ni pago, y con el plan gratuito juegas todos los días. Premium suma los certificados por etapa y más protecciones de racha.' },
      { p: '¿Cómo funciona el diagnóstico?', r: 'Tiene dos versiones: la exprés, de 5 preguntas y unos 3 minutos, y la completa, de 20 preguntas y unos 12 minutos. Te dice por qué etapa empezar y, con cuenta, tu nivel en cada una de las 5 dimensiones. Es orientativo y la versión completa se puede repetir cada 30 días.' },
      { p: '¿Tengo que descargar algo?', r: 'No. Dataventura funciona en el navegador: entras y juegas. Si quieres tenerla a mano, la instalas en la pantalla de inicio de tu teléfono desde el mismo navegador, sin pasar por ninguna tienda.' },
      { p: '¿Cómo son los certificados?', r: 'Recibes uno por cada etapa completada (sus 20 islas). Lo emite Delhos Academy con tu nombre, la etapa, la fecha y un código único, verificable en línea. Se descarga en PDF o como imagen para LinkedIn, Instagram o WhatsApp. Es un beneficio de Premium.' },
      { p: '¿Para quién es?', r: 'Para estudiantes que se preparan para su primer trabajo y profesionales que quieren decidir mejor, de cualquier área. Para crear una cuenta hay que tener 18 años o más.' },
      { p: '¿Quién está detrás?', r: 'Delhos, un ecosistema que une educación, tecnología e innovación. Los certificados de Dataventura los emite Delhos Academy, su academia de ciencia de datos e inteligencia artificial.' }
    ]
  },
  cierre: { cta: 'EMPIEZA AHORA, ES GRATIS', video: 'Dataventura en 45 segundos', videoAria: 'Video de lanzamiento de Dataventura: del problema a cada función de la app' },
  pie: { ecosistema: 'Ecosistema Delhos' },
  instalar: { qrLocal: 'En local, el código apunta a tu computador; publicado, a la app.', pasos: 'Cómo instalarla' },
  tutorial: { sinVideo: 'Tu navegador no puede reproducir este video.' },
  paginas: { ayuda: 'Centro de ayuda', ayudaP: 'Preguntas sobre tu cuenta, el diagnóstico o la app.', abrir: 'Abrir', idioma: 'Idioma' },
  partida: {
    marca: 'PIENSA CON DATOS · BY DELHOS', isla: 'ISLA DEL ORIGEN · 1 DE 5', pregunta: 'Según el gráfico, ¿qué sabor de helado se vendió más?',
    sabores: ['Chocolate', 'Vainilla', 'Frutilla', 'Menta'], excelente: '¡Excelente!', explica: 'Chocolate tiene la barra más alta: 50 helados.',
    racha: 'DÍAS DE RACHA', de5: 'DE 5 MIN', metaOk: 'Meta diaria cumplida', dias: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    ruta: '5 etapas · 20 mapas · 100 islas', etapa: 'Etapa', recorrido: 'DEL ARCHIPIÉLAGO DEL ORIGEN A LA BAHÍA DEL TESORO',
    certMarca: 'DELHOS ACADEMY · DATAVENTURA', certTitulo: 'Certificado de etapa', certTexto: ['Completaste la etapa ', ': sus 20 islas.'], codigo: 'CÓDIGO VERIFICABLE',
    cierre1: 'Aprende a pensar con datos', cierre2: 'en 5 minutos al día'
  }
};

type Mios = typeof es;

const en: Mios = {
  saltar: 'Skip to content',
  seo: {
    titulo: 'Dataventura · Learn to think with data in 5 minutes a day',
    descripcion: 'Dataventura, the Delhos app to learn to think with data in 5 minutes a day, without writing a line of code. Free assessment, 5 stages, 20 maps and Captain NEXUS as your guide.',
    paginas: {
      quienes: 'Dataventura was born from a simple idea: anyone can learn to think with data, without coding or mastering formulas.',
      como: 'Challenges of 8 types, an island map, spaced review and Captain NEXUS: this is how Dataventura trains an analytical mind.',
      contacto: 'Write to us to report a bug, suggest challenges or use Dataventura in class.'
    }
  },
  indice: ['Learn by playing', 'How it plays', 'The 5 stages', 'The 5 dimensions', 'Try it', 'Free assessment', 'Certificates', 'Take it with you', 'FAQ'],
  indiceCta: 'Try it', isla: { inicio: 'The voyage', indice: 'Page contents', avance: 'Voyage' },
  meta: { titulo: 'Your daily goal', min: 'min' },
  trailer: {
    pill: 'HOW IT PLAYS', h: 'a full round in 26 seconds',
    p: 'You set sail, answer a question with a real chart, add to your streak, move along the route and earn your certificate.',
    capitulos: ['Set sail', 'A question', 'Your streak', 'The route', 'Certificate', 'Let’s sail'], grupo: 'Video chapters'
  },
  etapas: {
    temas: 'Some topics', mapas: 'Its 4 maps', nota: '100 questions per stage · 4 maps of 5 islands',
    temasPorEtapa: [
      ['Choosing a chart', 'Reading pie charts', 'Average', 'Reliable sources'],
      ['Conversion funnel', 'Percentage change', 'Types of variables', 'Data quality'],
      ['Mean vs. median', 'Truncated axis', 'Rates vs. totals', 'Margin of error'],
      ['Non-response bias', 'Defining a metric', 'Which data to ask for', 'Validating an improvement'],
      ['Simpson’s paradox', 'Regression to the mean', 'Goodhart’s law', 'Base rate and precision']
    ]
  },
  dims: {
    pill: '5 DIMENSIONS', h: 'what you train without noticing',
    p: 'Analytical thinking isn’t one single thing. Dataventura splits it into five dimensions, the same ones the assessment measures, so you know where you’re strong and what to work on.',
    arrastra: 'Drag the cards or use the arrows', caso: 'A CASE LIKE THIS', de: 'DIMENSION {n} OF 5', anterior: 'Previous card', siguiente: 'Next card', carrusel: 'The 5 dimensions of analytical thinking',
    rol: 'carousel', causa: 'cause?',
    lista: [
      { nombre: 'Reading data and charts', idea: 'Read tables and charts without getting lost: axes, scales, bars, lines and points.', ejemplo: 'Which ice cream flavor sold the most?' },
      { nombre: 'Numbers and percentages', idea: 'Percentages, percentage points, averages and proportions, without the mess.', ejemplo: 'If something goes from 2% to 3%, did it rise 1% or 50%?' },
      { nombre: 'Statistical reasoning', idea: 'Samples, median, range and variability: how much to trust a number.', ejemplo: 'Does an average of 4 reviews say more than one of 400?' },
      { nombre: 'Critical thinking with data', idea: 'Two things moving together doesn’t prove one causes the other.', ejemplo: 'Does a second screen improve performance, or did top performers already have one?' },
      { nombre: 'Data-driven decisions', idea: 'Compare options with evidence: rates, context and what you still need to know.', ejemplo: 'Which branch has more problems: the one with more complaints or the one with the higher rate?' }
    ]
  },
  diag: {
    pill: 'FREE ASSESSMENT', h: 'start from where you are',
    p: 'No timer and no grading until the end: NEXUS wants to see how you reason, not how much you know. When you finish, it tells you which stage to start at. It’s a guide, and you don’t need an account.',
    expres: { t: 'Express', d: '5 questions · about 3 minutes', p: 'Your provisional stage right away, with what your answers showed.', cta: 'Take the express assessment' },
    completo: { t: 'Full', d: '20 questions · about 12 minutes', p: 'With an account: your level in the 5 dimensions and a report with your next step.', cta: 'Take the full assessment' },
    informe: 'SAMPLE REPORT', niveles: 'Each dimension is marked as to reinforce, developing or solid, and your stage goes from Apprentice to Senior.',
    etapa: 'Your stage!', alt: 'Real express assessment result in Dataventura: Apprentice stage', grafico: 'Sample report: level in each of the 5 dimensions'
  },
  cert: {
    pill: 'CERTIFICATES', h1: 'every stage,', h2: 'a certificate',
    p: 'When you complete a stage (its 20 islands) you get a certificate issued by Delhos Academy, with your name, the stage, the date and a unique code anyone can verify online.',
    bullets: ['Verifiable: a unique code anyone can check.', 'Ready to share on LinkedIn, Instagram or WhatsApp.', 'Downloadable as a PDF.'],
    premium: 'Certificates are a Premium benefit.', academy: 'Discover Delhos Academy',
    tarjeta: { marca: 'DELHOS ACADEMY · DATAVENTURA', titulo: 'Stage certificate', certifica: 'This certifies that', nombre: 'Your name', completo1: 'completed the', etapa: 'Explorer', completo2: 'stage of the thinking-with-data route.', codigo: 'VERIFICATION CODE (SAMPLE)' }
  },
  faq: {
    pill: 'QUESTIONS', h: 'before you set sail',
    items: [
      { p: 'What is Dataventura?', r: 'It’s Delhos’ app to learn to think with data in 5 minutes a day. You solve short cases with real-life data and charts, get an instant explanation for every answer and move across an island map with Captain NEXUS.' },
      { p: 'Do I need to code or know a lot of math?', r: 'No. You won’t write a line of code or use formulas: you train your reasoning. Looking at a chart, asking the right question and reaching a conclusion that holds up.' },
      { p: 'How much does it cost?', r: 'Getting started is free: the assessment needs no account or payment, and the free plan lets you play every day. Premium adds stage certificates and more streak protections.' },
      { p: 'How does the assessment work?', r: 'There are two versions: the express one, with 5 questions and about 3 minutes, and the full one, with 20 questions and about 12 minutes. It tells you which stage to start at and, with an account, your level in each of the 5 dimensions. It’s a guide, and the full version can be retaken every 30 days.' },
      { p: 'Do I have to download anything?', r: 'No. Dataventura works in your browser: open it and play. If you want it at hand, install it on your phone’s home screen from the same browser, without any app store.' },
      { p: 'What are the certificates like?', r: 'You get one for each completed stage (its 20 islands). Delhos Academy issues it with your name, the stage, the date and a unique code that can be verified online. Download it as a PDF or as an image for LinkedIn, Instagram or WhatsApp. It’s a Premium benefit.' },
      { p: 'Who is it for?', r: 'For students getting ready for their first job and professionals who want to make better decisions, in any field. You must be 18 or older to create an account.' },
      { p: 'Who is behind it?', r: 'Delhos, an ecosystem that brings together education, technology and innovation. Dataventura certificates are issued by Delhos Academy, its data science and AI academy.' }
    ]
  },
  cierre: { cta: 'START NOW, IT’S FREE', video: 'Dataventura in 45 seconds', videoAria: 'Dataventura launch video: from the problem to each feature of the app' },
  pie: { ecosistema: 'Delhos ecosystem' },
  instalar: { qrLocal: 'Locally, the code points to your computer; once published, to the app.', pasos: 'How to install it' },
  tutorial: { sinVideo: 'Your browser can’t play this video.' },
  paginas: { ayuda: 'Help center', ayudaP: 'Questions about your account, the assessment or the app.', abrir: 'Open', idioma: 'Language' },
  partida: {
    marca: 'THINK WITH DATA · BY DELHOS', isla: 'ISLE OF ORIGIN · 1 OF 5', pregunta: 'According to the chart, which ice cream flavor sold the most?',
    sabores: ['Chocolate', 'Vanilla', 'Strawberry', 'Mint'], excelente: 'Excellent!', explica: 'Chocolate has the tallest bar: 50 ice creams.',
    racha: 'DAY STREAK', de5: 'OF 5 MIN', metaOk: 'Daily goal reached', dias: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    ruta: '5 stages · 20 maps · 100 islands', etapa: 'Stage', recorrido: 'FROM THE ARCHIPELAGO OF ORIGIN TO TREASURE BAY',
    certMarca: 'DELHOS ACADEMY · DATAVENTURA', certTitulo: 'Stage certificate', certTexto: ['You completed the ', ' stage: all 20 islands.'], codigo: 'VERIFICATION CODE',
    cierre1: 'Learn to think with data', cierre2: 'in 5 minutes a day'
  }
};

const pt: Mios = {
  saltar: 'Pular para o conteúdo',
  seo: {
    titulo: 'Dataventura · Aprenda a pensar com dados em 5 minutos por dia',
    descripcion: 'Dataventura, o app da Delhos para aprender a pensar com dados em 5 minutos por dia, sem escrever uma linha de código. Diagnóstico grátis, 5 etapas, 20 mapas e o Capitão NEXUS como guia.',
    paginas: {
      quienes: 'O Dataventura nasceu de uma ideia simples: qualquer pessoa pode aprender a pensar com dados, sem programar nem dominar fórmulas.',
      como: 'Desafios de 8 tipos, um mapa de ilhas, revisão espaçada e o Capitão NEXUS: é assim que o Dataventura treina uma mente analítica.',
      contacto: 'Escreva para nós para relatar um erro, sugerir desafios ou usar o Dataventura em aula.'
    }
  },
  indice: ['Aprenda jogando', 'Como se joga', 'As 5 etapas', 'As 5 dimensões', 'Experimente', 'Diagnóstico grátis', 'Certificados', 'Leve com você', 'Perguntas frequentes'],
  indiceCta: 'Testar', isla: { inicio: 'A travessia', indice: 'Índice da página', avance: 'Travessia' },
  meta: { titulo: 'Sua meta diária', min: 'min' },
  trailer: {
    pill: 'COMO SE JOGA', h: 'uma partida em 26 segundos',
    p: 'Você zarpa, responde uma pergunta com um gráfico real, soma à sua ofensiva, avança pela rota e ganha seu certificado.',
    capitulos: ['Zarpar', 'Uma pergunta', 'Sua ofensiva', 'A rota', 'Certificado', 'Navegar'], grupo: 'Capítulos do vídeo'
  },
  etapas: {
    temas: 'Alguns temas', mapas: 'Seus 4 mapas', nota: '100 perguntas por etapa · 4 mapas de 5 ilhas',
    temasPorEtapa: [
      ['Escolher o gráfico', 'Leitura de pizza', 'Média', 'Fontes confiáveis'],
      ['Funil de conversão', 'Variação percentual', 'Tipos de variáveis', 'Qualidade dos dados'],
      ['Média vs. mediana', 'Eixo truncado', 'Taxas vs. absolutos', 'Margem de erro'],
      ['Viés de não resposta', 'Definir uma métrica', 'Que dado pedir', 'Validar uma melhoria'],
      ['Paradoxo de Simpson', 'Regressão à média', 'Lei de Goodhart', 'Taxa base e precisão']
    ]
  },
  dims: {
    pill: '5 DIMENSÕES', h: 'o que você treina sem perceber',
    p: 'O pensamento analítico não é uma coisa só. O Dataventura o divide em cinco dimensões, as mesmas que o diagnóstico mede, para você saber onde é forte e o que reforçar.',
    arrastra: 'Arraste os cartões ou use as setas', caso: 'UM CASO ASSIM', de: 'DIMENSÃO {n} DE 5', anterior: 'Cartão anterior', siguiente: 'Próximo cartão', carrusel: 'As 5 dimensões do pensamento analítico',
    rol: 'carrossel', causa: 'causa?',
    lista: [
      { nombre: 'Leitura de dados e gráficos', idea: 'Leia tabelas e gráficos sem se perder: eixos, escalas, barras, linhas e pontos.', ejemplo: 'Qual sabor de sorvete vendeu mais?' },
      { nombre: 'Números e porcentagens', idea: 'Porcentagens, pontos percentuais, médias e proporções, sem confusão.', ejemplo: 'Se algo sobe de 2% para 3%, subiu 1% ou 50%?' },
      { nombre: 'Raciocínio estatístico', idea: 'Amostras, mediana, amplitude e variabilidade: quanto confiar em um número.', ejemplo: 'Uma média de 4 avaliações diz mais que uma de 400?' },
      { nombre: 'Pensamento crítico com dados', idea: 'Duas coisas andarem juntas não prova que uma causa a outra.', ejemplo: 'Uma segunda tela melhora o desempenho, ou quem rende mais já a tinha?' },
      { nombre: 'Decisão com dados', idea: 'Comparar opções com evidência: taxas, contexto e o que falta saber.', ejemplo: 'Qual filial tem mais problemas: a com mais reclamações ou a com maior taxa?' }
    ]
  },
  diag: {
    pill: 'DIAGNÓSTICO GRÁTIS', h: 'comece pelo seu ponto de partida',
    p: 'Sem relógio e sem correção até o final: o NEXUS quer ver como você raciocina, não quanto sabe. Ao terminar, ele diz em qual etapa começar. É orientativo e você não precisa de conta.',
    expres: { t: 'Expresso', d: '5 perguntas · cerca de 3 minutos', p: 'Sua etapa provisória na hora, com o que suas respostas mostraram.', cta: 'Fazer o diagnóstico expresso' },
    completo: { t: 'Completo', d: '20 perguntas · cerca de 12 minutos', p: 'Com conta: seu nível nas 5 dimensões e um relatório com seu próximo passo.', cta: 'Fazer o diagnóstico completo' },
    informe: 'EXEMPLO DE RELATÓRIO', niveles: 'Cada dimensão fica a reforçar, em desenvolvimento ou sólida, e sua etapa vai de Aprendiz a Sênior.',
    etapa: 'Sua etapa!', alt: 'Resultado real do diagnóstico expresso no Dataventura: etapa Aprendiz', grafico: 'Exemplo de relatório: nível em cada uma das 5 dimensões'
  },
  cert: {
    pill: 'CERTIFICADOS', h1: 'cada etapa,', h2: 'um certificado',
    p: 'Ao completar uma etapa (suas 20 ilhas) você recebe um certificado emitido pela Delhos Academy, com seu nome, a etapa, a data e um código único que qualquer pessoa pode verificar on-line.',
    bullets: ['Verificável: um código único que qualquer pessoa pode conferir.', 'Pronto para compartilhar no LinkedIn, Instagram ou WhatsApp.', 'Disponível em PDF.'],
    premium: 'Os certificados são um benefício do Premium.', academy: 'Conheça a Delhos Academy',
    tarjeta: { marca: 'DELHOS ACADEMY · DATAVENTURA', titulo: 'Certificado de etapa', certifica: 'Certificamos que', nombre: 'Seu nome', completo1: 'concluiu a etapa', etapa: 'Explorador', completo2: 'da rota de pensamento analítico com dados.', codigo: 'CÓDIGO VERIFICÁVEL (EXEMPLO)' }
  },
  faq: {
    pill: 'PERGUNTAS', h: 'antes de zarpar',
    items: [
      { p: 'O que é o Dataventura?', r: 'É o app da Delhos para aprender a pensar com dados em 5 minutos por dia. Você resolve casos curtos com dados e gráficos da vida real, recebe uma explicação imediata de cada resposta e avança por um mapa de ilhas com o Capitão NEXUS.' },
      { p: 'Preciso saber programar ou muita matemática?', r: 'Não. Você não escreve uma linha de código nem usa fórmulas: treina o raciocínio. Olhar um gráfico, fazer a pergunta certa e chegar a uma conclusão que se sustenta.' },
      { p: 'Quanto custa?', r: 'Começar é grátis: o diagnóstico não pede conta nem pagamento, e com o plano gratuito você joga todos os dias. O Premium soma os certificados por etapa e mais proteções de ofensiva.' },
      { p: 'Como funciona o diagnóstico?', r: 'Há duas versões: a expressa, de 5 perguntas e cerca de 3 minutos, e a completa, de 20 perguntas e cerca de 12 minutos. Ela diz em qual etapa começar e, com conta, seu nível em cada uma das 5 dimensões. É orientativo e a versão completa pode ser refeita a cada 30 dias.' },
      { p: 'Preciso baixar algo?', r: 'Não. O Dataventura funciona no navegador: você entra e joga. Se quiser tê-lo à mão, instale-o na tela inicial do seu celular pelo próprio navegador, sem passar por nenhuma loja.' },
      { p: 'Como são os certificados?', r: 'Você recebe um para cada etapa concluída (suas 20 ilhas). A Delhos Academy o emite com seu nome, a etapa, a data e um código único, verificável on-line. Baixe em PDF ou como imagem para LinkedIn, Instagram ou WhatsApp. É um benefício do Premium.' },
      { p: 'Para quem é?', r: 'Para estudantes que se preparam para o primeiro emprego e profissionais que querem decidir melhor, de qualquer área. Para criar uma conta é preciso ter 18 anos ou mais.' },
      { p: 'Quem está por trás?', r: 'A Delhos, um ecossistema que une educação, tecnologia e inovação. Os certificados do Dataventura são emitidos pela Delhos Academy, sua academia de ciência de dados e inteligência artificial.' }
    ]
  },
  cierre: { cta: 'COMECE AGORA, É GRÁTIS', video: 'Dataventura em 45 segundos', videoAria: 'Vídeo de lançamento do Dataventura: do problema a cada função do app' },
  pie: { ecosistema: 'Ecossistema Delhos' },
  instalar: { qrLocal: 'Localmente, o código aponta para o seu computador; publicado, para o app.', pasos: 'Como instalar' },
  tutorial: { sinVideo: 'Seu navegador não consegue reproduzir este vídeo.' },
  paginas: { ayuda: 'Central de ajuda', ayudaP: 'Dúvidas sobre sua conta, o diagnóstico ou o app.', abrir: 'Abrir', idioma: 'Idioma' },
  partida: {
    marca: 'PENSE COM DADOS · BY DELHOS', isla: 'ILHA DA ORIGEM · 1 DE 5', pregunta: 'Segundo o gráfico, qual sabor de sorvete vendeu mais?',
    sabores: ['Chocolate', 'Baunilha', 'Morango', 'Menta'], excelente: 'Excelente!', explica: 'Chocolate tem a barra mais alta: 50 sorvetes.',
    racha: 'DIAS DE OFENSIVA', de5: 'DE 5 MIN', metaOk: 'Meta diária cumprida', dias: ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
    ruta: '5 etapas · 20 mapas · 100 ilhas', etapa: 'Etapa', recorrido: 'DO ARQUIPÉLAGO DA ORIGEM À BAÍA DO TESOURO',
    certMarca: 'DELHOS ACADEMY · DATAVENTURA', certTitulo: 'Certificado de etapa', certTexto: ['Você concluiu a etapa ', ': suas 20 ilhas.'], codigo: 'CÓDIGO VERIFICÁVEL',
    cierre1: 'Aprenda a pensar com dados', cierre2: 'em 5 minutos por dia'
  }
};

export const TEXTOS = {
  es: { ...diseno.es, ...es, paginas: { ...diseno.es.paginas, ...es.paginas } },
  en: { ...diseno.en, ...en, paginas: { ...diseno.en.paginas, ...en.paginas } },
  pt: { ...diseno.pt, ...pt, paginas: { ...diseno.pt.paginas, ...pt.paginas } }
};

export type Textos = typeof TEXTOS.es;
