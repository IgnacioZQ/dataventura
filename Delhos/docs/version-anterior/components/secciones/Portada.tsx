// Portada oscura (sistema: héroe con data-theme="dark" + dh-oscuro, trama y red de puntos animada).
// A la derecha, los dos recuadros rotulados son los botones de entrada a cada plataforma (pedido del usuario),
// cada uno con su propio color de marca y una vista real de su sitio.
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { Mancha, Ola } from '@/components/Fondos';
import { Icono } from '@/components/Piezas';
import { TextEffect } from '@/components/ui/motion-primitives/text-effect';
import { TextLoop } from '@/components/ui/motion-primitives/text-loop';
import { Tilt } from '@/components/ui/motion-primitives/tilt';
import { recurso, SITIO } from '@/config';
import { PALABRAS_PORTADA } from '@/contenido';

/** Red de puntos que se conectan (la «red de puntos animada sutil» del sistema). */
function Red() {
  const lienzo = useRef<HTMLCanvasElement>(null);
  const reducir = useReducedMotion();
  useEffect(() => {
    const c = lienzo.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    let w = 0, h = 0, raf = 0;
    const puntos = Array.from({ length: 56 }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.00035, vy: (Math.random() - 0.5) * 0.00035 }));
    const medir = () => { const r = c.getBoundingClientRect(); w = c.width = r.width * devicePixelRatio; h = c.height = r.height * devicePixelRatio; };
    const dibujar = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of puntos) {
        if (!reducir) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > 1) p.vx *= -1; if (p.y < 0 || p.y > 1) p.vy *= -1; }
      }
      const lim = 150 * devicePixelRatio;
      for (let i = 0; i < puntos.length; i++) {
        const a = puntos[i];
        for (let j = i + 1; j < puntos.length; j++) {
          const b = puntos[j];
          const d = Math.hypot((a.x - b.x) * w, (a.y - b.y) * h);
          if (d < lim) { ctx.strokeStyle = `rgba(147,197,253,${(1 - d / lim) * 0.22})`; ctx.lineWidth = devicePixelRatio; ctx.beginPath(); ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w, b.y * h); ctx.stroke(); }
        }
        ctx.fillStyle = 'rgba(147,197,253,.55)'; ctx.beginPath(); ctx.arc(a.x * w, a.y * h, 1.6 * devicePixelRatio, 0, Math.PI * 2); ctx.fill();
      }
      if (!reducir) raf = requestAnimationFrame(dibujar);
    };
    medir(); dibujar();
    addEventListener('resize', medir);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', medir); };
  }, [reducir]);
  return <canvas ref={lienzo} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}

function TarjetaAcademy() {
  return (
    <a href={SITIO.academy} data-wipe="ac" aria-label="Delhos Academy: cursos en vivo, 100% online. Ir a Delhos Academy"
      className="group block overflow-hidden rounded-[26px] border border-white/15 bg-[#0F2537] shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)] transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-3 bg-gradient-to-br from-academy-osc to-academy px-5 py-4">
        <img src={recurso('assets/academy/academy-logo-192.png')} alt="" className="size-11 rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] tracking-[.14em] text-white/75 uppercase">Servicio</p>
          <p className="font-display text-xl leading-tight font-bold tracking-[-0.02em] text-white">Delhos Academy</p>
        </div>
      </div>
      <div className="px-5 pt-4">
        <div className="overflow-hidden rounded-t-[14px] border border-b-0 border-white/10 bg-white">
          <div className="flex items-center gap-1.5 bg-[#e8eef5] px-3 py-1.5" aria-hidden><i className="size-2 rounded-full bg-[#f0556f]" /><i className="size-2 rounded-full bg-[#FBBF24]" /><i className="size-2 rounded-full bg-[#2fbf8a]" /></div>
          <img src={recurso('assets/academy/academy-inicio.webp')} alt="" className="block h-[150px] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" loading="eager" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-white/10 px-5 py-3.5">
        <span className="text-sm font-semibold text-white/80">Cursos en vivo, 100% online</span>
        <span className="flex items-center gap-1 text-sm font-bold text-celeste">Entrar <Icono nombre="flecha" tam={16} className="transition-transform duration-200 group-hover:translate-x-1" /></span>
      </div>
    </a>
  );
}

function TarjetaDataventura() {
  return (
    <a href={SITIO.dataventura} data-wipe="dv" aria-label="Dataventura: piensa con datos en 5 minutos al día. Ir a Dataventura"
      className="group block overflow-hidden rounded-[26px] border border-white/15 bg-[#1b1230] shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)] transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-3 bg-gradient-to-br from-dv-osc to-dv px-5 py-4">
        <img src={recurso('assets/dataventura/dataventura-icon.svg')} alt="" className="size-11 rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] tracking-[.14em] text-white/75 uppercase">Producto</p>
          <p className="font-display text-xl leading-tight font-bold tracking-[-0.02em] text-white">Dataventura</p>
        </div>
      </div>
      <div className="relative h-[175px] overflow-hidden px-5 pt-4">
        <div className="mx-auto w-[150px] rounded-[26px] bg-black p-[6px] transition-transform duration-500 group-hover:-translate-y-2">
          <img src={recurso('assets/dataventura/app-mapa.webp')} alt="" className="block w-full rounded-[20px]" loading="eager" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-white/10 px-5 py-3.5">
        <span className="text-sm font-semibold text-white/80">Piensa con datos, 5 min al día</span>
        <span className="flex items-center gap-1 text-sm font-bold text-dv-oro">Entrar <Icono nombre="flecha" tam={16} className="transition-transform duration-200 group-hover:translate-x-1" /></span>
      </div>
    </a>
  );
}

export function Portada() {
  return (
    <section id="inicio" data-theme="dark" className="dh-oscuro relative isolate overflow-hidden pt-[72px]">
      <div className="dh-trama absolute inset-0 opacity-40" aria-hidden />
      <Red />
      <Mancha color="rgba(30,97,148,.35)" semilla={17} tam={620} className="-right-40 -bottom-56 blur-2xl" />
      <img src={recurso('marca/delhos-simbolo-blanco.svg')} alt="" aria-hidden className="pointer-events-none absolute top-24 -right-28 w-[560px] opacity-[.05]" />

      <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-12 px-4 pt-14 pb-28 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:pt-20 lg:pb-36">
        <div className="flex flex-col items-start">
          <motion.span initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="dh-kicker">Educación · Tecnología · Innovación</motion.span>
          <h1 className="mt-6 font-display text-[clamp(2.75rem,6.4vw,4.5rem)] leading-[1.02] font-bold tracking-[-0.035em] text-white">
            <TextEffect as="span" per="word" preset="fade-in-blur" speedReveal={1.3} className="block">Un ecosistema para aprender a</TextEffect>
            <TextLoop interval={2.6} className="text-celeste" transition={{ duration: 0.35, ease: 'easeOut' }}
              variants={{ initial: { y: 24, opacity: 0, filter: 'blur(6px)' }, animate: { y: 0, opacity: 1, filter: 'blur(0px)' }, exit: { y: -24, opacity: 0, filter: 'blur(6px)' } }}>
              {PALABRAS_PORTADA.map(p => <span key={p}>{p}</span>)}
            </TextLoop>
          </h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.5 }} className="dh-lead mt-6">
            Delhos une educación, tecnología e innovación para crear nuevas formas de aprender ciencia de datos, inteligencia artificial y más. Aprende a programar y entrena tu pensamiento cognitivo de datos y analítica, con el acompañamiento de la IA y de herramientas tecnológicas.
          </motion.p>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }} className="mt-7 flex flex-wrap gap-2">
            {[{ i: 'online' as const, t: '100% online' }, { i: 'comunidad' as const, t: 'Para todo el mundo de habla hispana' }, { i: 'energia' as const, t: 'Con la IA como compañera' }].map(x => (
              <li key={x.t} className="flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3.5 py-2 text-[14px] font-semibold text-white/85"><Icono nombre={x.i} tam={18} className="text-celeste" />{x.t}</li>
            ))}
          </motion.ul>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }} className="mt-9 flex items-center gap-2 font-mono text-[12px] tracking-[.14em] text-texto-suave uppercase">
            Elige una plataforma para entrar <Icono nombre="flecha" tam={16} className="text-chispa max-lg:rotate-90" />
          </motion.p>
        </div>

        <div className="relative grid gap-5 sm:grid-cols-2">
          <div aria-hidden className="absolute -top-10 -left-10 size-72 rounded-full bg-academy/30 blur-3xl" />
          <div aria-hidden className="absolute -right-10 -bottom-10 size-72 rounded-full bg-dv/30 blur-3xl" />
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }} className="relative">
            <Tilt rotationFactor={7}><TarjetaAcademy /></Tilt>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45, ease: 'easeOut' }} className="relative sm:mt-14">
            <Tilt rotationFactor={7}><TarjetaDataventura /></Tilt>
          </motion.div>
        </div>
      </div>
      <Ola color="#EFF6FF" semilla={5} alto={80} className="absolute inset-x-0 -bottom-px" />
    </section>
  );
}
