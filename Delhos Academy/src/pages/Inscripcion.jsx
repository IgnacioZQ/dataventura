// Postulación en tres pasos (Claude Design, artboard Postulación). Sirve para cursos (?curso=<id>) y para
// webinars o workshops (?webinar=<id>); sin parámetro, deja elegir el curso. Al enviar, guarda la postulación
// (entidad Inscription) y abre el correo de la persona con los datos para la Academy (src/lib/correo.js).
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { api } from '@/api/client';
import { A, Marco } from '@/components/rediseno/Marco';
import { CORREO_CONTACTO } from '@/config/sitio';
import { useCursos, useEventos } from '@/lib/catalogo';
import { PAISES } from '@/lib/contenido-academy';
import { abrirCorreo } from '@/lib/correo';

const PASOS = ['Tus datos', 'Tu perfil', 'Revisa y envía'];
const VACIO = { nombre: '', correo: '', pais: 'Chile', telefono: '', ocupacion: '', motivo: '', extra: '' };
const correoValido = c => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.trim());

export default function Inscripcion() {
  const params = new URLSearchParams(window.location.search);
  const idEvento = params.get('webinar');
  const [idCurso, setIdCurso] = useState(params.get('curso') || '');
  const { cursos, cargando: cargandoCursos } = useCursos();
  const { eventos, cargando: cargandoEventos } = useEventos();
  const [paso, setPaso] = useState(1);
  const [v, setV] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [acepta, setAcepta] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [fallo, setFallo] = useState('');

  const evento = idEvento ? eventos.find(e => e.id === idEvento) : null;
  const curso = !idEvento && idCurso ? cursos.find(c => c.id === idCurso) : null;
  const elemento = evento || curso;
  const cargando = idEvento ? cargandoEventos : cargandoCursos;
  const esCurso = !idEvento;
  const prefijo = useMemo(() => PAISES.find(([p]) => p === v.pais)?.[1] ?? '+', [v.pais]);

  // Al cambiar de paso el foco va al panel; al cargar la página no, para que se lea primero el título.
  const primera = useRef(true);
  useEffect(() => {
    if (primera.current) { primera.current = false; return; }
    document.getElementById('inscripcion-panel')?.focus({ preventScroll: true });
  }, [paso]);

  const cambiar = k => e => { setV({ ...v, [k]: e.target.value }); if (errores[k]) setErrores({ ...errores, [k]: undefined }); };

  const validar = n => {
    const err = {};
    if (n === 1) {
      if (!v.nombre.trim()) err.nombre = 'Escribe tu nombre completo.';
      if (!correoValido(v.correo)) err.correo = 'Revisa tu correo: debe tener la forma nombre@dominio.cl';
      if (v.telefono.replace(/\D/g, '').length < 7) err.telefono = 'Escribe un teléfono de al menos 7 dígitos.';
      if (esCurso && !idCurso) err.curso = 'Elige el curso al que quieres postular.';
    }
    if (n === 2) {
      if (!v.ocupacion.trim()) err.ocupacion = 'Cuéntanos a qué te dedicas hoy.';
      if (esCurso && v.motivo.trim().length < 10) err.motivo = 'Cuéntanos un poco más (al menos 10 caracteres).';
    }
    setErrores(err);
    const primero = Object.keys(err)[0];
    if (primero) document.getElementById(`i-${primero}`)?.focus();
    return !primero;
  };

  const siguiente = e => { e.preventDefault(); if (validar(paso)) setPaso(paso + 1); };

  const enviar = async () => {
    if (!acepta) { setFallo('Para enviar, acepta que te contactemos sobre esta postulación.'); document.getElementById('i-acepta')?.focus(); return; }
    setEnviando(true);
    setFallo('');
    const tipo = evento ? evento.tipo.toLowerCase() : 'course';
    const titulo = elemento?.titulo || 'Curso';
    try {
      await api.entities.Inscription.create({
        type: tipo, item_id: elemento?.id || '', item_title: titulo, name: v.nombre.trim(), email: v.correo.trim(),
        phone: `${prefijo} ${v.telefono.trim()}`, country: v.pais, occupation: v.ocupacion.trim(), message: [v.motivo, v.extra].filter(Boolean).join('\n\n')
      });
    } catch (err) {
      setFallo(err?.message || 'No pudimos guardar tu postulación en este navegador, pero igual puedes enviarla por correo.');
    }
    abrirCorreo(`Postulación ${evento ? evento.tipo : 'curso'}: ${titulo}`, [
      [evento ? evento.tipo : 'Curso', titulo], ['Nombre', v.nombre], ['Correo', v.correo], ['País', v.pais], ['Teléfono', `${prefijo} ${v.telefono}`],
      ['Ocupación', v.ocupacion], [esCurso ? 'Por qué le interesa' : 'Detalle', v.motivo], ['Comentario', v.extra]
    ]);
    setEnviando(false);
    setPaso(4);
  };

  const campo = (k, etiqueta, props = {}, ayuda, opcional) => (
    <div className="fld">
      <label className="lbl" htmlFor={`i-${k}`}>{etiqueta}{opcional && <span className="font-normal text-gris"> (opcional)</span>}</label>
      {props.as === 'textarea'
        ? <textarea id={`i-${k}`} name={k} autoComplete="off" className="inp" value={v[k]} onChange={cambiar(k)} placeholder={props.placeholder} aria-invalid={!!errores[k]} aria-describedby={`i-${k}-ayuda`} />
        : <input id={`i-${k}`} name={k} className="inp" value={v[k]} onChange={cambiar(k)} aria-invalid={!!errores[k]} aria-describedby={`i-${k}-ayuda`} {...props} />}
      <span id={`i-${k}-ayuda`} className={errores[k] ? 'error' : 'hint'}>{errores[k] || ayuda}</span>
    </div>
  );

  if (!cargando && ((idEvento && !evento) || (params.get('curso') && !curso))) {
    return (
      <Marco>
        <div className="wrap flex flex-col items-start gap-4 py-24">
          <span className="eyebrow">Postulación</span>
          <h1 className="h text-4xl">{idEvento ? 'No encontramos este evento' : 'No encontramos este curso'}</h1>
          <p className="lead">Puede que ya no esté abierto o que el enlace esté incompleto.</p>
          <A pagina={idEvento ? 'Webinars' : 'Cursos'} className="btn btn-p mt-2">{idEvento ? 'Ver webinars y workshops' : 'Ver cursos'}</A>
        </div>
      </Marco>
    );
  }

  const detalle = evento
    ? [evento.fecha, evento.hora && `${evento.hora} hrs`, evento.tipo].filter(Boolean).join(' · ')
    : curso ? [curso.inicio && `Inicio ${curso.inicio}`, curso.duracion, 'En vivo'].filter(Boolean).join(' · ') : 'Elige el curso y completa tus datos';

  return (
    <Marco>
      <div className="wrap flex max-w-[1080px] flex-col gap-8 pb-24 pt-12">
        <div className="flex flex-col gap-2.5">
          <span className="eyebrow">{evento ? `Inscripción · ${evento.tipo}` : 'Postulación'}</span>
          <h1 className="h" style={{ fontSize: 'clamp(30px, 3.6vw, 42px)' }}>{cargando ? 'Cargando…' : elemento?.titulo || 'Postula a un curso'}</h1>
          <span className="text-gris">{detalle}</span>
        </div>

        <div className="flex flex-wrap items-start gap-8">
          <div id="inscripcion-panel" tabIndex={-1} className="card flex min-w-0 flex-[999_1_520px] flex-col gap-7 outline-none" style={{ padding: 'clamp(24px, 4vw, 40px)' }}>
            {paso < 4 && (
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between text-sm"><span className="font-semibold">{PASOS[paso - 1]}</span><span className="text-gris">Paso {paso} de 3</span></div>
                <div className="track" role="progressbar" aria-label="Avance de la postulación" aria-valuemin={1} aria-valuemax={3} aria-valuenow={paso} aria-valuetext={`Paso ${paso} de 3: ${PASOS[paso - 1]}`}><div className="fill" style={{ width: `${Math.round((paso / 3) * 100)}%` }} /></div>
              </div>
            )}
            <AnimatePresence mode="wait">
              {paso === 1 && (
                <motion.form key="p1" noValidate onSubmit={siguiente} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }} className="flex flex-col gap-5">
                  {esCurso && !params.get('curso') && (
                    <div className="fld">
                      <label className="lbl" htmlFor="i-curso">Curso</label>
                      <select id="i-curso" name="curso" className="inp" aria-describedby={errores.curso ? 'i-curso-error' : undefined} value={idCurso} onChange={e => { setIdCurso(e.target.value); setErrores({ ...errores, curso: undefined }); }} aria-invalid={!!errores.curso}>
                        <option value="">{cursos.length ? 'Elige un curso' : 'No hay cursos abiertos por ahora'}</option>
                        {cursos.filter(c => !c.finalizado).map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
                      </select>
                      {errores.curso && <span id="i-curso-error" className="error">{errores.curso}</span>}
                    </div>
                  )}
                  {campo('nombre', 'Nombre completo', { autoComplete: 'name' })}
                  {campo('correo', 'Correo electrónico', { type: 'email', autoComplete: 'email', inputMode: 'email', spellCheck: false, autoCapitalize: 'none' }, 'Aquí te enviaremos la confirmación.')}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="fld">
                      <label className="lbl" htmlFor="i-pais">País</label>
                      <select id="i-pais" className="inp" value={v.pais} onChange={cambiar('pais')} autoComplete="country-name">{PAISES.map(([p]) => <option key={p}>{p}</option>)}</select>
                    </div>
                    <div className="fld">
                      <label className="lbl" htmlFor="i-telefono">Teléfono móvil</label>
                      <div className="flex gap-2">
                        <span className="inp flex !w-[76px] flex-none items-center justify-center !bg-papel text-texto" aria-hidden>{prefijo}</span>
                        <input id="i-telefono" name="telefono" className="inp" type="tel" autoComplete="tel-national" value={v.telefono} onChange={cambiar('telefono')} aria-invalid={!!errores.telefono} aria-describedby="i-telefono-ayuda" />
                      </div>
                      <span id="i-telefono-ayuda" className={errores.telefono ? 'error' : 'hint'}>{errores.telefono || `Código de ${v.pais}: ${prefijo}`}</span>
                    </div>
                  </div>
                  <div className="flex justify-end pt-1"><button className="btn btn-p active:scale-[0.98]" type="submit">Continuar</button></div>
                </motion.form>
              )}
              {paso === 2 && (
                <motion.form key="p2" noValidate onSubmit={siguiente} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }} className="flex flex-col gap-5">
                  {campo('ocupacion', 'Ocupación actual', { placeholder: 'Ej.: analista en un servicio público…', autoComplete: 'organization-title' })}
                  {campo('motivo', esCurso ? '¿Por qué te interesa este curso?' : '¿Qué esperas de este evento?', { as: 'textarea', placeholder: 'Cuéntanos un poco sobre ti y lo que quieres lograr…' }, undefined, !esCurso)}
                  {campo('extra', 'Comentario adicional', { autoComplete: 'off' }, undefined, true)}
                  <div className="flex justify-between gap-3 pt-1"><button className="btn btn-s" type="button" onClick={() => setPaso(1)}>Atrás</button><button className="btn btn-p active:scale-[0.98]" type="submit">Revisar</button></div>
                </motion.form>
              )}
              {paso === 3 && (
                <motion.div key="p3" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }} className="flex flex-col gap-5">
                  <dl className="m-0 grid gap-4 rounded-xl bg-papel p-5 sm:grid-cols-2">
                    {[['Nombre', v.nombre], ['Correo', v.correo], ['País y teléfono', `${v.pais} · ${prefijo} ${v.telefono}`], ['Ocupación', v.ocupacion]].map(([k, x]) => (
                      <div key={k}><dt className="text-sm text-gris">{k}</dt><dd className="m-0 mt-1 break-words font-semibold">{x}</dd></div>
                    ))}
                  </dl>
                  <label className="flex cursor-pointer items-start gap-3 leading-normal text-texto">
                    <input id="i-acepta" name="acepta" type="checkbox" checked={acepta} onChange={e => { setAcepta(e.target.checked); setFallo(''); }} className="mt-0.5 size-5 flex-none accent-marino" />
                    Acepto que Delhos Academy me contacte sobre esta postulación.
                  </label>
                  {fallo && <p className="error m-0" role="alert">{fallo}</p>}
                  <div className="flex justify-between gap-3 pt-1">
                    <button className="btn btn-s" type="button" onClick={() => setPaso(2)}>Atrás</button>
                    <button className="btn btn-p active:scale-[0.98]" type="button" onClick={enviar} disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar postulación'}</button>
                  </div>
                  <p className="m-0 text-sm text-gris">Al enviar se abrirá tu aplicación de correo con los datos listos para {CORREO_CONTACTO}.</p>
                </motion.div>
              )}
              {paso === 4 && (
                <motion.div key="listo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-[18px] py-6 text-center" role="status">
                  <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }} className="flex size-16 items-center justify-center rounded-full bg-verde-suave">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1F6B43" strokeWidth="2.4" aria-hidden><path d="M5 12l4 4 10-10" /></svg>
                  </motion.div>
                  <h2 className="h text-[32px]">¡Recibimos tu postulación!</h2>
                  <p className="m-0 max-w-[30em] text-[17px] leading-relaxed text-texto">Envía el correo que se abrió y te escribiremos a <strong className="text-tinta">{v.correo}</strong> para confirmar tu {esCurso ? 'cupo' : 'lugar'}. Revisa también tu carpeta de spam.</p>
                  {fallo && <p className="error m-0">{fallo}</p>}
                  <div className="mt-2 flex flex-wrap justify-center gap-2.5">
                    <A pagina={esCurso ? 'Cursos' : 'Webinars'} className="btn btn-s">{esCurso ? 'Ver otros cursos' : 'Ver más eventos'}</A>
                    <A pagina="Home" className="btn btn-p">Volver al inicio</A>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside className="flex flex-[1_1_280px] flex-col gap-4">
            <div className="card flex flex-col gap-4 p-6">
              <span className="font-bold">¿Qué pasa después?</span>
              <ol className="m-0 flex list-none flex-col gap-3.5 p-0">
                {(esCurso
                  ? ['Revisamos tu postulación.', 'Te escribimos para confirmar el cupo y el pago.', 'Recibes tu acceso a la plataforma.']
                  : ['Revisamos tu inscripción.', 'Te escribimos para confirmar tu lugar.', 'Recibes el enlace del evento.']).map((t, i) => (
                  <li key={t} className="flex gap-3"><span className="flex size-[26px] flex-none items-center justify-center rounded-full bg-azul-suave text-[13px] font-bold text-marino-700">{i + 1}</span><span className="leading-normal text-texto">{t}</span></li>
                ))}
              </ol>
            </div>
            <p className="m-0 px-1 text-sm leading-normal text-gris">{esCurso ? 'Postular no te compromete a pagar.' : 'Inscribirte no te compromete a pagar.'} ¿Dudas? <A pagina="Contacto" className="font-semibold">Escríbenos</A>.</p>
          </aside>
        </div>
      </div>
    </Marco>
  );
}
