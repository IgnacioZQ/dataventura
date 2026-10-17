// Quiénes somos (Claude Design, artboard Quiénes somos). El equipo sale de los instructores activos;
// si todavía no hay ninguno cargado, la sección no se muestra (no se inventan nombres ni fotos).
import { motion } from 'motion/react';
import { A, Marco } from '@/components/rediseno/Marco';
import { Cascada, itemCascada, Revelar } from '@/components/rediseno/Movimiento';
import { ECOSISTEMA } from '@/config/sitio';
import { useInstructores } from '@/lib/catalogo';

const PRINCIPIOS = [
  ['Práctico', 'Aprendizaje basado en proyectos reales, no solo teoría.', <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>],
  ['Riguroso', 'Metodología estructurada con estándares de la industria.', <><path d="M5 4h11l3 3v13H5z" /><path d="M9 12l2 2 4-4" /></>],
  ['Aplicado', 'Datasets reales para construir tu portafolio.', <path d="M4 19V5M4 19h16M8 15v-4M12 15V8M16 15v-6" />],
  ['Colaborativo', 'Una comunidad activa de estudiantes y profesionales.', <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 19c0-3 3-5 6-5s6 2 6 5M15 14c3 0 6 1.5 6 4.5" /></>],
  ['Certificado', 'Un certificado con tus horas y competencias.', <><circle cx="12" cy="9" r="5" /><path d="M9 13.5L8 21l4-2 4 2-1-7.5" /></>],
  ['Actualizado', 'Contenido al día con las tecnologías que se usan hoy.', <path d="M20 12a8 8 0 11-3-6.2M20 4v5h-5" />]
];

function Equipo() {
  const instructores = useInstructores();
  if (!instructores.length) return null;
  return (
    <section className="py-24">
      <div className="wrap flex flex-col gap-10">
        <Revelar className="flex max-w-[640px] flex-col gap-3.5">
          <span className="eyebrow">Quiénes te enseñan</span>
          <h2 className="h" style={{ fontSize: 'clamp(30px, 3.4vw, 42px)' }}>El equipo</h2>
          <p className="m-0 text-[17px] leading-relaxed text-texto">Científicos de datos, ingenieros de machine learning y analistas con experiencia en la industria y en docencia.</p>
        </Revelar>
        <Cascada className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {instructores.map(p => {
            const rol = p.experience?.[0] ? [p.experience[0].position, p.experience[0].company].filter(Boolean).join(' · ') : (p.specialties || []).slice(0, 2).join(' · ');
            return (
              <motion.div key={p.id} variants={itemCascada} className="spot flex flex-col gap-3 border-t border-linea-fuerte pt-5">
                {p.profile_image
                  ? <img src={p.profile_image} alt="" className="aspect-square w-full rounded-xl object-cover" />
                  : <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-azul-suave font-serif text-6xl font-semibold text-marino">{(p.name || '?').split(' ').map(x => x[0]).slice(0, 2).join('')}</div>}
                <span className="text-lg font-bold">{p.name}</span>
                {rol && <span className="text-gris">{rol}</span>}
                {p.linkedin && <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="w-fit font-semibold">LinkedIn<span className="sr-only"> (se abre en otra pestaña)</span></a>}
              </motion.div>
            );
          })}
        </Cascada>
      </div>
    </section>
  );
}

export default function Nosotros() {
  return (
    <Marco>
      <section className="relative overflow-hidden pb-[72px] pt-[88px]">
        <svg aria-hidden="true" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
          <defs><filter id="nb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="80" /></filter></defs>
          <g filter="url(#nb)"><circle className="blob" cx="1150" cy="180" r="220" fill="#DCE9F7" /><circle className="blob" style={{ animationDelay: '-10s' }} cx="250" cy="480" r="160" fill="#E8F5EE" /></g>
        </svg>
        <div className="wrap relative flex flex-col gap-[22px]">
          <span className="eyebrow rise">Quiénes somos</span>
          <h1 className="h rise max-w-[15em]" style={{ fontSize: 'clamp(38px, 5vw, 60px)', animationDelay: '.1s' }}>Aprender datos de la mano de quienes los usan todos los días</h1>
          <p className="lead rise max-w-[36em]" style={{ animationDelay: '.2s' }}>Delhos Academy es una academia online de ciencia de datos, inteligencia artificial y analítica. Nuestra misión es democratizar el acceso a una formación de calidad, con clases en vivo, proyectos prácticos y acompañamiento continuo.</p>
        </div>
      </section>

      <section className="pb-24">
        <Revelar className="wrap grid gap-12 lg:grid-cols-2">
          <p className="m-0 text-[17px] leading-[1.75] text-texto">Diseñamos los programas para profesionales que buscan reconvertirse hacia el mundo de los datos, analistas que quieren ampliar sus habilidades y estudiantes universitarios que desean diferenciarse. Cubrimos desde los fundamentos de Python y estadística hasta machine learning, visualización y despliegue de modelos.</p>
          <p className="m-0 text-[17px] leading-[1.75] text-texto">Nos diferencia la combinación de rigor académico con aplicabilidad inmediata: trabajamos con datos reales, fomentamos el pensamiento crítico y preparamos a cada estudiante para resolver problemas concretos de su organización.</p>
        </Revelar>
      </section>

      <section className="border-y border-linea bg-white py-24">
        <div className="wrap flex flex-col gap-12">
          <Revelar className="flex flex-col gap-3.5"><span className="eyebrow">Nuestro enfoque</span><h2 className="h" style={{ fontSize: 'clamp(30px, 3.4vw, 42px)' }}>Seis principios que guían cada curso</h2></Revelar>
          <Cascada className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPIOS.map(([t, p, icono]) => (
              <motion.div key={t} variants={itemCascada} className="val group flex gap-4">
                <span className="ico transition-transform duration-300 group-hover:-translate-y-[3px] group-hover:-rotate-6 group-hover:bg-marino group-hover:text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{icono}</svg>
                </span>
                <div><h3 className="h m-0 mb-1.5 text-[22px]">{t}</h3><p className="m-0 leading-relaxed text-texto">{p}</p></div>
              </motion.div>
            ))}
          </Cascada>
        </div>
      </section>

      <Equipo />

      <section className="pb-24 pt-24">
        <Revelar className="wrap">
          <div className="card grid items-center gap-10 md:grid-cols-2" style={{ padding: 'clamp(28px, 5vw, 56px)' }}>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-3"><img src={`${import.meta.env.BASE_URL}marca/delhos-icono-app.svg`} alt="" width={44} height={44} className="size-11 rounded-[10px]" /><span className="eyebrow">Ecosistema Delhos</span></div>
              <h2 className="h" style={{ fontSize: 'clamp(28px, 3vw, 36px)' }}>La Academy es parte de Delhos</h2>
              <p className="m-0 leading-[1.65] text-texto">Delhos es un ecosistema que une educación, tecnología e innovación para que más personas aprendan a programar y a pensar con datos.</p>
            </div>
            <div className="flex flex-col">
              {[[ECOSISTEMA.delhos, 'Delhos', 'La marca madre'], [ECOSISTEMA.dataventura, 'Dataventura', 'App para entrenar el pensamiento analítico']].map(([href, t, d]) => (
                <a key={t} href={href} className="spot group flex items-center justify-between border-t border-linea-fuerte px-0 py-5 text-tinta no-underline transition-[padding] duration-300 hover:pl-2.5 last:border-b">
                  <span><strong className="text-[17px] text-tinta">{t}</strong><br /><span className="text-gris">{d}</span></span>
                  <span aria-hidden className="text-azul transition-transform group-hover:translate-x-1">→</span>
                </a>
              ))}
            </div>
          </div>
        </Revelar>
      </section>

      <section className="pb-24">
        <Revelar className="wrap flex flex-wrap items-center justify-between gap-6 border-t border-linea-fuerte pt-10">
          <h2 className="h" style={{ fontSize: 'clamp(26px, 2.6vw, 34px)' }}>¿Quieres conocer los cursos?</h2>
          <div className="flex flex-wrap gap-3"><A pagina="Cursos" className="btn btn-p">Ver cursos</A><A pagina="Contacto" className="btn btn-s">Escríbenos</A></div>
        </Revelar>
      </section>
    </Marco>
  );
}
