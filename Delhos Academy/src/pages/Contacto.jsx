// Contacto del rediseño. No hay servidor de correo: el formulario arma el mensaje y abre la aplicación de
// correo de la persona, dirigido a la Academy (src/lib/correo.js).
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { A, Marco } from '@/components/rediseno/Marco';
import { Iman } from '@/components/rediseno/Movimiento';
import { CORREO_CONTACTO } from '@/config/sitio';
import { PAISES } from '@/lib/contenido-academy';
import { abrirCorreo } from '@/lib/correo';

const TEMAS = {
  'Un curso': '¿Qué curso te interesa y qué te gustaría saber?',
  'Inscripción y pagos': 'Cuéntanos en qué parte del proceso estás.',
  'Webinars y workshops': '¿A qué evento quieres asistir o qué tema te gustaría que tratáramos?',
  'Otro': 'Escríbenos lo que necesites.'
};

const VACIO = { nombre: '', correo: '', pais: 'Chile', telefono: '', mensaje: '' };
const correoValido = c => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.trim());

export default function Contacto() {
  const [tema, setTema] = useState('Un curso');
  const [v, setV] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);
  const listo = useRef(null);
  const montado = useRef(false);
  // Al preparar el mensaje el foco va al aviso; al volver, al campo del mensaje.
  useEffect(() => {
    if (!montado.current) { montado.current = true; return; }
    if (enviado) listo.current?.focus(); else document.getElementById('c-mensaje')?.focus();
  }, [enviado]);
  const cambiar = k => e => { setV({ ...v, [k]: e.target.value }); if (errores[k]) setErrores({ ...errores, [k]: undefined }); };

  const enviar = e => {
    e.preventDefault();
    const err = {};
    if (!v.nombre.trim()) err.nombre = 'Escribe tu nombre.';
    if (!correoValido(v.correo)) err.correo = 'Revisa tu correo: debe tener la forma nombre@dominio.cl';
    if (v.mensaje.trim().length < 10) err.mensaje = 'Cuéntanos un poco más (al menos 10 caracteres).';
    setErrores(err);
    if (Object.keys(err).length) {
      document.getElementById(`c-${Object.keys(err)[0]}`)?.focus();
      return;
    }
    abrirCorreo(`Contacto desde la web: ${tema}`, [
      ['Tema', tema], ['Nombre', v.nombre], ['Correo', v.correo], ['País', v.pais], ['Teléfono', v.telefono], ['Mensaje', v.mensaje]
    ]);
    setEnviado(true);
  };

  const campo = (k, etiqueta, props = {}, opcional = false) => (
    <div className="fld">
      <label className="lbl" htmlFor={`c-${k}`}>{etiqueta}{opcional && <span className="font-normal text-gris"> (opcional)</span>}</label>
      <input id={`c-${k}`} name={k} className="inp" value={v[k]} onChange={cambiar(k)} aria-invalid={!!errores[k]} aria-describedby={errores[k] ? `c-${k}-error` : undefined} {...props} />
      {errores[k] && <span id={`c-${k}-error`} className="error">{errores[k]}</span>}
    </div>
  );

  return (
    <Marco>
      <div className="wrap flex flex-wrap items-start gap-14 pb-[104px] pt-[72px]">
        <aside className="flex flex-[1_1_320px] flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span className="eyebrow rise">Contacto</span>
            <h1 className="h rise" style={{ fontSize: 'clamp(36px, 3.8vw, 48px)', animationDelay: '.1s' }}>¿Tienes alguna pregunta?</h1>
            <p className="lead rise" style={{ animationDelay: '.2s' }}>Escríbenos sobre un curso, tu inscripción o los webinars. Te responderemos a la brevedad.</p>
          </div>
          <div className="rise flex flex-col" style={{ animationDelay: '.3s' }}>
            <a className="info flex items-center gap-3.5 py-[18px] no-underline" href={`mailto:${CORREO_CONTACTO}`}>
              <span><span className="text-sm text-gris">Correo</span><br /><strong className="break-all">{CORREO_CONTACTO}</strong></span>
            </a>
            <div className="info flex flex-col gap-2 py-[18px]">
              <span className="text-sm text-gris">Horario de atención (Chile)</span>
              <dl className="m-0 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 text-[15px]">
                <dt>Lunes a viernes</dt><dd className="m-0 font-semibold">9:00 – 18:00</dd>
                <dt>Sábado</dt><dd className="m-0 font-semibold">10:00 – 14:00</dd>
                <dt>Domingo</dt><dd className="m-0 text-gris">Cerrado</dd>
              </dl>
            </div>
          </div>
        </aside>

        <div className="card rise min-w-0 flex-[999_1_540px] shadow-[0_16px_40px_rgba(22,32,44,0.06)]" style={{ padding: 'clamp(24px, 4vw, 40px)', animationDelay: '.25s' }}>
          <AnimatePresence mode="wait">
            {!enviado ? (
              <motion.form key="form" noValidate onSubmit={enviar} className="flex flex-col gap-[22px]" exit={{ opacity: 0, y: -8 }}>
                <fieldset className="m-0 border-0 p-0">
                  <legend className="lbl mb-3 p-0">¿Sobre qué nos escribes?</legend>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(TEMAS).map(t => (
                      <button key={t} type="button" className={`opt active:scale-[0.97] ${tema === t ? 'on' : ''}`} aria-pressed={tema === t} onClick={() => setTema(t)}>{t}</button>
                    ))}
                  </div>
                </fieldset>
                <div className="grid gap-[18px] sm:grid-cols-2">
                  {campo('nombre', 'Nombre', { autoComplete: 'name' })}
                  {campo('correo', 'Correo electrónico', { type: 'email', autoComplete: 'email', inputMode: 'email', spellCheck: false, autoCapitalize: 'none' })}
                  <div className="fld">
                    <label className="lbl" htmlFor="c-pais">País</label>
                    <select id="c-pais" name="pais" autoComplete="country-name" className="inp" value={v.pais} onChange={cambiar('pais')}>{PAISES.map(([p]) => <option key={p}>{p}</option>)}</select>
                  </div>
                  {campo('telefono', 'Teléfono', { type: 'tel', autoComplete: 'tel' }, true)}
                </div>
                <div className="fld">
                  <label className="lbl" htmlFor="c-mensaje">Mensaje</label>
                  <textarea id="c-mensaje" name="mensaje" autoComplete="off" className="inp" placeholder={`${TEMAS[tema].replace(/[.?]$/, '')}…`} value={v.mensaje} onChange={cambiar('mensaje')} aria-invalid={!!errores.mensaje} aria-describedby={errores.mensaje ? 'c-mensaje-error' : undefined} />
                  {errores.mensaje && <span id="c-mensaje-error" className="error">{errores.mensaje}</span>}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3.5">
                  <span className="text-sm text-gris">Solo usamos tus datos para responderte.</span>
                  <Iman><button className="btn btn-p active:scale-[0.98]" type="submit">Enviar mensaje</button></Iman>
                </div>
              </motion.form>
            ) : (
              <motion.div key="listo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 py-10 text-center" role="status">
                <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }} className="flex size-16 items-center justify-center rounded-full bg-verde-suave">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1F6B43" strokeWidth="2.4" aria-hidden><path d="M5 12l4 4 10-10" /></svg>
                </motion.div>
                <h2 ref={listo} tabIndex={-1} className="h text-[30px]">Tu mensaje está listo</h2>
                <p className="m-0 max-w-[34em] text-[17px] leading-relaxed text-texto">Abrimos tu aplicación de correo con el mensaje escrito para <strong className="text-tinta">{CORREO_CONTACTO}</strong>. Solo falta que lo envíes desde ahí.</p>
                <div className="mt-1.5 flex flex-wrap justify-center gap-2.5">
                  <button type="button" className="btn btn-s" onClick={() => setEnviado(false)}>Volver al formulario</button>
                  <A pagina="Cursos" className="btn btn-p">Mientras tanto, revisa los cursos</A>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Marco>
  );
}
