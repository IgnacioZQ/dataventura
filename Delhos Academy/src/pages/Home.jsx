// Inicio del rediseño (Claude Design «Delhos Academy — Rediseño web», artboard Inicio).
import { lazy, Suspense, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { A, Marco } from '@/components/rediseno/Marco';
import { Cascada, Iman, Inclinar, itemCascada, Revelar } from '@/components/rediseno/Movimiento';
import { FilaCurso, useCursos } from '@/lib/catalogo';
import { Llamado, Preguntas } from '@/components/rediseno/Secciones';

// La animación de Remotion se carga aparte, después del resto de la portada.
const HeroAnimado = lazy(() => import('@/components/rediseno/VideosRemotion').then(m => ({ default: m.HeroAnimado })));

const TITULAR = ['Aprende', 'ciencia', 'de', 'datos', 'con', 'criterio', 'y', 'foco', 'en', 'resultados.'];
const RESALTADAS = new Set([5, 9]);
const HERRAMIENTAS = ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn', 'Jupyter', 'Matplotlib', 'Seaborn', 'Plotly', 'Spark'];

const METODO = [
  ['Formación estructurada', 'Rutas claras de nivel inicial a avanzado, para avanzar sin perderte.'],
  ['Clases en vivo', 'Sesiones sincrónicas, preguntas en tiempo real y feedback directo sobre tus proyectos.'],
  ['Casos reales', 'Datos del sector público y de empresas, para que lo aprendido tenga impacto inmediato.'],
  ['Certificación profesional', 'Un certificado digital con tus horas de formación y competencias adquiridas.']
];

const PARTES = [
  { label: 'Teoría', flex: 3, paso: 'Primera parte', titulo: 'Concepto, sin relleno', texto: 'Lo justo para entender el porqué antes de tocar el código, con ejemplos del sector público y privado.', puntos: ['Explicación guiada por el instructor', 'Ejemplos aplicados a casos reales', 'Material de apoyo descargable'] },
  { label: 'Práctica en vivo', flex: 5, paso: 'Parte central', titulo: 'Manos en el teclado', texto: 'Ejercicios en vivo con bases de datos reales mientras el instructor acompaña y corrige en el momento.', puntos: ['Notebooks listos para trabajar', 'Bases de datos reales', 'Retroalimentación en tiempo real'] },
  { label: 'Preguntas', flex: 2, paso: 'Cierre', titulo: 'Tus dudas, en el momento', texto: 'Interacción directa con el instructor y tus compañeros para cerrar la clase sin cabos sueltos.', puntos: ['Ronda abierta de preguntas', 'Revisión de tus avances', 'Próximos pasos y tarea'] }
];

const DIFERENCIA = [
  ['i.', 'Práctico de verdad', 'Talleres en vivo con datasets reales del sector público y de empresas, no ejemplos artificiales.'],
  ['ii.', 'Rigurosamente diseñado', 'Metodología alineada a estándares de la industria y aterrizada al contexto tecnológico actual.'],
  ['iii.', 'Aplicable al día siguiente', 'Proyectos que llevas directo a tu organización y sumas a tu portafolio profesional.'],
  ['iv.', 'Acompañamiento cercano', 'Instructores que conocen tu avance, mensajería directa y foro de cada curso.']
];

const PUBLICO = [
  ['Profesionales en reconversión', 'Vienes de otra área y quieres entrar al mundo de los datos con una base sólida.'],
  ['Analistas que quieren crecer', 'Ya trabajas con datos y quieres sumar Python, modelos y automatización.'],
  ['Estudiantes universitarios', 'Quieres diferenciarte en el mercado laboral con proyectos reales en tu portafolio.']
];

const PASOS = [
  ['Postulas', 'Completas un formulario breve con tus datos e intereses.'],
  ['Te contactamos', 'El equipo revisa tu postulación y te escribe por correo.'],
  ['Confirmas el pago', 'Tarjeta, transferencia u otros medios electrónicos.'],
  ['Accedes a la plataforma', 'Recibes tu acceso, el calendario y el enlace de cada clase.']
];

const Visto = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E6DB4" strokeWidth="2.2" aria-hidden="true"><path d="M5 12l4 4 10-10" /></svg>;

function Hero() {
  const reducir = useReducedMotion();
  return (
    <section className="hero relative overflow-hidden pb-16 pt-20">
      <svg aria-hidden="true" viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <defs><filter id="suave" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="80" /></filter></defs>
        <g className="follow" filter="url(#suave)" style={{ transform: 'translate(calc(var(--px, 0) * -60px), calc(var(--py, 0) * -40px))' }}>
          <path className="blob" d="M120 520c80-70 230-60 290 20s20 190-90 210-230-10-260-90-20-70 60-140z" fill="#E4EEF9" />
          <circle className="blob" style={{ animationDelay: '-14s' }} cx="760" cy="660" r="150" fill="#E8F5EE" />
        </g>
      </svg>
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-2">
        <div className="par1 flex flex-col gap-[26px]">
          <span className="rise inline-flex items-center gap-2.5 text-sm font-semibold text-verde"><span className="dot live" />Clases en vivo · 100% online</span>
          <h1 className="h" style={{ fontSize: 'clamp(42px, 5.2vw, 64px)' }}>
            {TITULAR.map((p, i) => (
              <span key={i}>
                <motion.span className="inline-block" initial={reducir ? false : { opacity: 0, y: 16, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: 0.05 + i * 0.07, ease: [0.2, 0.7, 0.2, 1] }} style={RESALTADAS.has(i) ? { color: '#1E4E86' } : undefined}>
                  {RESALTADAS.has(i) ? <span className="hl" style={i === 9 ? { animationDelay: '1.4s' } : undefined}>{p}</span> : p}
                </motion.span>{i < TITULAR.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>
          <p className="lead rise max-w-[32em]" style={{ animationDelay: '.8s' }}>Formación práctica en ciencia de datos, inteligencia artificial y analítica aplicada a problemas reales del sector público y privado, con acompañamiento cercano de tus instructores.</p>
          <div className="rise flex flex-wrap items-center gap-x-5 gap-y-3" style={{ animationDelay: '.95s' }}>
            <Iman><A pagina="Cursos" className="btn btn-p active:scale-[0.98]">Ver próximos cursos <span className="arr" aria-hidden>→</span></A></Iman>
            <a href="#como" className="navl fuerte">Cómo funciona</a>
          </div>
          <p className="rise m-0 mt-1.5 text-[15px] text-gris" style={{ animationDelay: '1.1s' }}>Clases grabadas · Certificado digital · Desde nivel inicial</p>
        </div>
        <div className="par2">
          <div className="rise" style={{ animationDelay: '.35s' }}>
            <Inclinar className="overflow-hidden rounded-[20px] shadow-[0_30px_70px_rgba(30,58,95,0.14)]">
              <Suspense fallback={<div className="aspect-[4/3] w-full rounded-[20px] bg-[#EAF2FB]" />}>
                <HeroAnimado />
              </Suspense>
            </Inclinar>
          </div>
        </div>
      </div>
      <a href="#herramientas" className="rise relative mt-14 flex justify-center" style={{ animationDelay: '1.6s' }} aria-label="Bajar a la siguiente sección"><span className="scrollcue"><span /></span></a>
    </section>
  );
}

function Herramientas() {
  const lista = [...HERRAMIENTAS, ...HERRAMIENTAS];
  return (
    <section id="herramientas" className="pb-12 pt-2">
      <p className="m-0 mb-5 text-center text-sm font-semibold text-gris">Herramientas con las que vas a trabajar</p>
      <div className="marqwrap group">
        {/* Animada con CSS: se pausa al pasar el mouse y se detiene con «reducir movimiento». */}
        <div className="marq">
          {lista.map((h, i) => <span key={i} className="tool" translate="no" aria-hidden={i >= HERRAMIENTAS.length}>{h}</span>)}
        </div>
      </div>
    </section>
  );
}

function Metodo() {
  return (
    <section id="como" className="sec border-y border-linea bg-white">
      <div className="wrap flex flex-col gap-16">
        <Revelar className="grid items-end gap-x-16 gap-y-6 lg:grid-cols-2">
          <div className="flex flex-col gap-3.5"><span className="eyebrow">Cómo aprendes aquí</span><h2 className="h" style={{ fontSize: 'clamp(32px, 3.6vw, 44px)' }}>Tu camino hacia ser un profesional de datos</h2></div>
          <p className="lead !text-lg">Te guiamos paso a paso, desde los fundamentos hasta el dominio de la analítica y la ciencia de datos.</p>
        </Revelar>
        <Cascada className="grid gap-x-9 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {METODO.map(([t, p], i) => (
            <motion.div key={t} variants={itemCascada} className="step">
              <span className="numl">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="m-0 mt-1 text-[19px] font-semibold">{t}</h3>
              <p className="m-0 leading-relaxed text-texto">{p}</p>
            </motion.div>
          ))}
        </Cascada>
      </div>
    </section>
  );
}

function UnaClase() {
  const [parte, setParte] = useState(1);
  const p = PARTES[parte];
  return (
    <section className="sec">
      <div className="wrap flex flex-col gap-10">
        <Revelar className="flex max-w-[680px] flex-col gap-3.5">
          <span className="eyebrow">Una clase por dentro</span>
          <h2 className="h" style={{ fontSize: 'clamp(32px, 3.6vw, 44px)' }}>Así se vive cada sesión</h2>
          <p className="lead !text-lg">Pasa el mouse o toca cada parte para ver qué ocurre en ella.</p>
        </Revelar>
        <Revelar className="flex flex-col gap-10">
          <div role="tablist" aria-label="Partes de una clase" className="flex overflow-hidden rounded-xl shadow-[inset_0_0_0_1px_#CBD3DC]"
            onKeyDown={e => {
              const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
              const fin = e.key === 'Home' ? 0 : e.key === 'End' ? PARTES.length - 1 : null;
              if (!d && fin === null) return;
              e.preventDefault();
              const n = fin ?? (parte + d + PARTES.length) % PARTES.length;
              setParte(n);
              document.getElementById(`parte-${n}`)?.focus();
            }}>
            {PARTES.map((s, i) => {
              const activa = parte === i;
              return (
                <button key={s.label} id={`parte-${i}`} type="button" role="tab" aria-selected={activa} aria-controls="parte-panel" tabIndex={activa ? 0 : -1}
                  className="segb" onClick={() => setParte(i)} onMouseEnter={() => setParte(i)}
                  style={{ flex: `${activa ? s.flex + 2 : s.flex} 1 0`, background: activa ? '#1E3A5F' : '#FFFFFF', color: activa ? '#FFFFFF' : '#4A5563' }}>
                  {s.label}
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={parte} id="parte-panel" role="tabpanel" tabIndex={0} aria-labelledby={`parte-${parte}`} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.3 }}
              className="grid items-start gap-x-16 gap-y-8 md:grid-cols-2">
              <div className="flex flex-col gap-3"><span className="text-sm font-semibold text-gris">{p.paso}</span><h3 className="h text-[30px]">{p.titulo}</h3><p className="m-0 text-[17px] leading-[1.7] text-texto">{p.texto}</p></div>
              <ul className="m-0 list-none border-t border-linea-fuerte p-0">
                {p.puntos.map(x => <li key={x} className="flex items-center gap-3.5 border-b border-linea py-4 text-[17px]"><Visto />{x}</li>)}
              </ul>
            </motion.div>
          </AnimatePresence>
          <p className="m-0 text-texto">Después de cada clase quedan disponibles la <strong className="text-tinta">grabación</strong>, el <strong className="text-tinta">material de apoyo</strong>, el <strong className="text-tinta">código</strong> y las <strong className="text-tinta">bases de datos</strong>.</p>
        </Revelar>
      </div>
    </section>
  );
}

function ProximosCursos() {
  const { cursos, cargando } = useCursos();
  const abiertos = cursos.filter(c => c.abierto).slice(0, 3);
  const lista = abiertos.length ? abiertos : cursos.slice(0, 3);
  return (
    <section className="sec border-y border-linea bg-white">
      <div className="wrap flex flex-col gap-10">
        <Revelar className="flex flex-wrap items-end justify-between gap-5">
          <div className="flex flex-col gap-3.5">
            <span className="eyebrow">{abiertos.length ? 'Postulaciones abiertas' : 'Catálogo'}</span>
            <h2 className="h" style={{ fontSize: 'clamp(32px, 3.6vw, 44px)' }}>Próximos cursos</h2>
          </div>
          <A pagina="Cursos" className="navl fuerte">Ver todos los cursos <span aria-hidden>→</span></A>
        </Revelar>
        <Cascada className="border-t border-tinta">
          {cargando && [0, 1, 2].map(i => <div key={i} className="h-[104px] animate-pulse border-b border-linea bg-[linear-gradient(90deg,#F7F8FA,#EEF1F4,#F7F8FA)]" />)}
          {!cargando && lista.map((c, i) => <motion.div key={c.id} variants={itemCascada}><FilaCurso curso={c} numero={i + 1} /></motion.div>)}
          {!cargando && !lista.length && (
            <div className="flex flex-col gap-3 border-b border-linea py-12">
              <h3 className="h text-2xl">Estamos preparando la próxima cohorte</h3>
              <p className="m-0 text-texto">Déjanos tu correo en <A pagina="Contacto" className="font-semibold">Contacto</A> y te avisamos apenas se abran las postulaciones.</p>
            </div>
          )}
        </Cascada>
      </div>
    </section>
  );
}

function Diferencia() {
  return (
    <section className="sec">
      <div className="wrap grid items-start gap-x-20 gap-y-12 lg:grid-cols-2">
        <Revelar className="flex flex-col gap-[18px] lg:sticky lg:top-[120px]">
          <span className="eyebrow">Lo que nos hace distintos</span>
          <h2 className="h" style={{ fontSize: 'clamp(34px, 4vw, 50px)' }}>No vendemos atajos ni fórmulas mágicas.</h2>
          <p className="lead !text-lg">Te enseñamos a pensar con datos y a construir soluciones que funcionen en el mundo real.</p>
        </Revelar>
        <Cascada className="border-b border-linea-fuerte">
          {DIFERENCIA.map(([n, t, p]) => (
            <motion.div key={t} variants={itemCascada} className="stmt">
              <span className="sn">{n}</span>
              <div className="flex flex-col gap-2"><h3 className="h text-2xl">{t}</h3><p className="m-0 leading-[1.7] text-texto">{p}</p></div>
            </motion.div>
          ))}
        </Cascada>
      </div>
    </section>
  );
}

function FraseGrande() {
  return (
    <section aria-hidden="true" className="overflow-hidden pb-[72px] pt-6">
      <p className="bigtype h m-0 whitespace-nowrap font-medium text-[#DCE3EA]" style={{ fontSize: 'clamp(64px, 9vw, 132px)', letterSpacing: '-0.02em' }}>Pensar con datos · Pensar con datos · Pensar con datos</p>
    </section>
  );
}

function ParaQuien() {
  return (
    <section className="sec border-y border-linea bg-white">
      <div className="wrap flex flex-col gap-14">
        <Revelar className="flex max-w-[640px] flex-col gap-3.5">
          <span className="eyebrow">Para quién es</span>
          <h2 className="h" style={{ fontSize: 'clamp(32px, 3.6vw, 44px)' }}>Programas pensados para distintos momentos profesionales</h2>
        </Revelar>
        <Cascada className="grid gap-10 md:grid-cols-3">
          {PUBLICO.map(([t, p]) => (
            <motion.div key={t} variants={itemCascada} className="aud"><h3 className="h text-[23px]">{t}</h3><p className="m-0 leading-[1.7] text-texto">{p}</p></motion.div>
          ))}
        </Cascada>
      </div>
    </section>
  );
}

function Inscripcion() {
  return (
    <section className="sec">
      <div className="wrap flex flex-col gap-12">
        <Revelar className="flex max-w-[640px] flex-col gap-3.5">
          <span className="eyebrow">Proceso de inscripción</span>
          <h2 className="h" style={{ fontSize: 'clamp(32px, 3.6vw, 44px)' }}>Simple, en cuatro pasos</h2>
        </Revelar>
        <div className="relative">
          <div className="stepline absolute left-[18px] right-[18px] top-[17px] hidden h-0.5 bg-linea lg:block" aria-hidden><div className="fillx h-full bg-azul" /></div>
          <Cascada as="ol" className="relative m-0 grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {PASOS.map(([t, p], i) => (
              <motion.li key={t} variants={itemCascada} className="flex flex-col gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-full bg-marino font-bold text-white shadow-[0_0_0_6px_#F7F8FA]" aria-hidden="true">{i + 1}</span>
                <h3 className="m-0 mt-1.5 text-lg font-semibold">{t}</h3>
                <p className="m-0 leading-relaxed text-texto">{p}</p>
              </motion.li>
            ))}
          </Cascada>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Marco>
      <Hero />
      <Herramientas />
      <Metodo />
      <UnaClase />
      <ProximosCursos />
      <Diferencia />
      <FraseGrande />
      <ParaQuien />
      <Inscripcion />
      <Preguntas />
      <Llamado />
    </Marco>
  );
}

