// Contacto: no envía datos a ningún servidor; arma el correo para contacto@delhosacademy.cl y abre la aplicación
// de correo de la persona (igual que antes).
import { AnimatePresence, motion } from 'motion/react';
import { type FormEvent, useState } from 'react';
import { Contenedor, Encabezado, Icono, Revelar } from '@/components/Piezas';
import { Magnetic } from '@/components/ui/motion-primitives/magnetic';
import { CORREO } from '@/config';
import { INTERESES, PAISES, PERFILES } from '@/contenido';
import type { NombreIcono } from '@/iconos-datos';
import { cn } from '@/lib/utils';

const BENEFICIOS: { icono: NombreIcono; titulo: string; texto: string }[] = [
  { icono: 'mensaje', titulo: 'Respuesta cercana', texto: 'Te contactamos por correo a la brevedad.' },
  { icono: 'orientacion', titulo: 'Te orientamos', texto: 'Según lo que quieras enseñar o aprender.' },
  { icono: 'comunidad', titulo: 'Equipo experto', texto: 'Profesionales activos en datos e IA.' },
  { icono: 'online', titulo: '100% online', texto: 'Estés donde estés.' }
];

export function Contacto() {
  const [enviado, setEnviado] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const err: Record<string, string> = {};
    if (!d.nombre?.trim()) err.nombre = 'Escribe tu nombre.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.correo ?? '')) err.correo = 'Escribe un correo válido para que podamos responderte.';
    if (!d.mensaje?.trim()) err.mensaje = 'Cuéntanos en qué te podemos ayudar.';
    setErrores(err);
    if (Object.keys(err).length) return;
    const cuerpo = [`Nombre: ${d.nombre}`, `Correo: ${d.correo}`, `País: ${d.pais}`, `Perfil: ${d.perfil}`, `Interés: ${d.interes}`, '', d.mensaje].join('\n');
    location.href = `mailto:${CORREO}?subject=${encodeURIComponent(`Contacto web: ${d.interes}`)}&body=${encodeURIComponent(cuerpo)}`;
    setEnviado(true);
  };

  const campo = (nombre: string) => cn('dh-campo', errores[nombre] && 'is-error');

  return (
    <section id="contacto" className="relative bg-superficie-alt py-20 sm:py-[120px]">
      <Contenedor className="grid items-start gap-12 lg:grid-cols-2 lg:gap-[72px]">
        <div>
          <Encabezado kicker="Contacto" titulo="¿Tienes dudas?" destacado="Conversemos." bajada="Escríbenos si quieres enseñar o aprender en Delhos Academy, o si quieres saber más sobre Dataventura." />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {BENEFICIOS.map((b, i) => (
              <Revelar as="li" key={b.titulo} retraso={i} className="flex gap-3">
                <span className="dh-pilar-ico !size-11 !rounded-[14px]"><Icono nombre={b.icono} tam={20} /></span>
                <span><b className="block font-bold text-tinta">{b.titulo}</b><span className="text-[14px] leading-[22px] text-texto-suave">{b.texto}</span></span>
              </Revelar>
            ))}
          </ul>
          <a href={`mailto:${CORREO}`} className="mt-8 inline-flex items-center gap-2 font-bold text-enlace hover:underline"><Icono nombre="correo" tam={20} />{CORREO}</a>
        </div>

        <Revelar>
          <div data-theme="dark" className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-degradado-inicio to-azul p-6 shadow-[0_24px_60px_-24px_rgba(30,61,89,.6)] sm:p-8">
            <div className="dh-trama absolute inset-0 opacity-25" aria-hidden />
            <AnimatePresence mode="wait">
              {!enviado ? (
                <motion.form key="form" noValidate onSubmit={enviar} exit={{ opacity: 0, y: -10 }} className="relative flex flex-col gap-4" data-theme="light">
                  <div data-theme="dark">
                    <h3 className="dh-h2 !text-white">Conversemos</h3>
                    <p className="mt-1 text-[#DCE7F2]">Completa el formulario y preparamos tu mensaje.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={campo('nombre')}><input name="nombre" placeholder=" " autoComplete="name" aria-invalid={!!errores.nombre} /><span>Nombre</span></label>
                    <label className={campo('correo')}><input name="correo" type="email" placeholder=" " autoComplete="email" aria-invalid={!!errores.correo} /><span>Correo electrónico</span></label>
                    <label className="dh-campo"><select name="pais" defaultValue="Chile">{PAISES.map(p => <option key={p}>{p}</option>)}</select><span>País</span></label>
                    <label className="dh-campo"><select name="perfil" defaultValue="Estudiante">{PERFILES.map(p => <option key={p}>{p}</option>)}</select><span>Soy</span></label>
                  </div>
                  <label className="dh-campo"><select name="interes" defaultValue="Delhos Academy">{INTERESES.map(p => <option key={p}>{p}</option>)}</select><span>Me interesa</span></label>
                  <label className={campo('mensaje')}><textarea name="mensaje" placeholder=" " aria-invalid={!!errores.mensaje} /><span>Cuéntanos un poco más</span></label>
                  {Object.keys(errores).length > 0 && (
                    <div role="alert" className="rounded-[13px] bg-white px-4 py-3 text-[14px] font-semibold text-peligro">
                      {Object.values(errores).map(e => <p key={e}>{e}</p>)}
                    </div>
                  )}
                  <div data-theme="dark" className="flex justify-end">
                    <Magnetic intensity={0.2} range={90}>
                      <button type="submit" className="dh-btn">Enviar mensaje<Icono nombre="flecha" tam={18} className="dh-flecha" /></button>
                    </Magnetic>
                  </div>
                </motion.form>
              ) : (
                <motion.div key="listo" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative flex min-h-[420px] flex-col items-center justify-center gap-4 text-center" role="status">
                  <span className="grid size-16 place-items-center rounded-full bg-white/15 text-celeste"><Icono nombre="check" tam={34} /></span>
                  <h3 className="dh-h2 !text-white">¡Casi listo!</h3>
                  <p className="max-w-[36ch] text-[#DCE7F2]">Abrimos tu aplicación de correo con el mensaje preparado. Solo falta que presiones enviar.</p>
                  <button type="button" onClick={() => setEnviado(false)} className="dh-btn is-secundario !border-white/40 !text-white">Escribir otro mensaje</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Revelar>
      </Contenedor>
    </section>
  );
}
