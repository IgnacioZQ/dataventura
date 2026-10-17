// Acceso de estudiantes e instructores (Claude Design, artboard Acceso). La sesión se guarda en el navegador
// (studentSession / instructorSession) y se entra al panel con una recarga completa, como antes.
import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { api } from '@/api/client';
import { A, Logo } from '@/components/rediseno/Marco';
import { pageHref } from '@/utils';

const ROLES = {
  Estudiante: { funcion: 'authenticateStudent', clave: 'student', sesion: 'studentSession', panel: 'StudentDashboard', sub: 'Entra a tus cursos y clases en vivo.' },
  Instructor: { funcion: 'authenticateInstructor', clave: 'instructor', sesion: 'instructorSession', panel: 'InstructorDashboard', sub: 'Gestiona tus cursos, estudiantes y clases.' }
};

export default function Acceso() {
  const [rol, setRol] = useState('Estudiante');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [ver, setVer] = useState(false);
  const [error, setError] = useState('');
  const [entrando, setEntrando] = useState(false);
  const r = ROLES[rol];

  const entrar = async e => {
    e.preventDefault();
    if (!correo.trim() || !clave) { setError('Escribe tu correo y tu contraseña.'); return; }
    setEntrando(true);
    setError('');
    try {
      const { data } = await api.functions.invoke(r.funcion, { email: correo.trim(), password: clave });
      if (data.error) { setError(data.error); setEntrando(false); return; }
      localStorage.setItem(r.sesion, JSON.stringify(data[r.clave]));
      window.location.href = pageHref(r.panel);
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('No pudimos iniciar sesión. Inténtalo de nuevo.');
      setEntrando(false);
    }
  };

  return (
    <div className="da flex min-h-[100dvh] flex-wrap">
      <section className="relative flex min-h-[360px] flex-[1_1_460px] flex-col justify-between gap-12 overflow-hidden bg-marino text-white" style={{ padding: 'clamp(32px, 5vw, 64px)' }}>
        <svg aria-hidden="true" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
          <defs><filter id="ab" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="70" /></filter></defs>
          <g filter="url(#ab)" opacity="0.55"><circle className="blob" cx="480" cy="160" r="200" fill="#2E6DB4" /><circle className="blob" style={{ animationDelay: '-9s' }} cx="120" cy="680" r="180" fill="#3D7FC4" /></g>
        </svg>
        <A pagina="Home" className="relative w-fit !text-white no-underline" aria-label="Delhos Academy, inicio"><Logo claro tam={40} /></A>
        <div className="relative flex max-w-[460px] flex-col gap-5">
          <h1 className="h rise !text-white" style={{ fontSize: 'clamp(32px, 3.6vw, 46px)' }}>Tus clases, tareas y avances en un solo lugar.</h1>
          <ul className="rise m-0 flex list-none flex-col gap-3 p-0 text-[#D5E2F0]" style={{ animationDelay: '.15s' }}>
            {['Enlace directo a cada clase en vivo', 'Grabaciones y material siempre disponibles', 'Mensajes y foro con tu instructor'].map(t => (
              <li key={t} className="flex items-center gap-2.5"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CC3EA" strokeWidth="2" aria-hidden="true"><path d="M5 12l4 4 10-10" /></svg>{t}</li>
            ))}
          </ul>
        </div>
        <span className="relative text-sm text-[#A9C0D8]">¿Aún no eres estudiante? <A pagina="Cursos" className="font-semibold !text-white">Mira los cursos</A></span>
      </section>

      <main id="contenido" className="flex flex-[1_1_460px] items-center justify-center px-6" style={{ paddingBlock: 'clamp(32px, 5vw, 64px)' }}>
        <form noValidate onSubmit={entrar} className="rise flex w-full max-w-[400px] flex-col gap-[22px]" style={{ animationDelay: '.1s' }}>
          <div className="flex flex-col gap-2">
            <h2 className="h text-[32px]">Iniciar sesión</h2>
            <motion.p key={rol} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="m-0 text-texto">{r.sub}</motion.p>
          </div>
          <div role="group" aria-label="Tipo de cuenta" className="relative grid grid-cols-2 gap-1 rounded-xl bg-linea-suave p-1">
            {Object.keys(ROLES).map(k => (
              <button key={k} type="button" aria-pressed={rol === k} onClick={() => { setRol(k); setError(''); }}
                className={`relative min-h-11 rounded-[9px] font-semibold transition-colors ${rol === k ? 'text-tinta' : 'text-texto hover:text-tinta'}`}>
                {rol === k && <motion.span layoutId="rol-activo" className="absolute inset-0 rounded-[9px] bg-white shadow-[0_1px_3px_rgba(22,32,44,0.12)]" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                <span className="relative">{k}</span>
              </button>
            ))}
          </div>
          <div className="fld">
            <label className="lbl" htmlFor="em">Correo electrónico</label>
            <input id="em" name="email" className="inp" type="email" inputMode="email" autoComplete="email" spellCheck={false} autoCapitalize="none" placeholder="tu@correo.com" value={correo} onChange={e => { setCorreo(e.target.value); setError(''); }} aria-invalid={!!error} aria-describedby={error ? 'acceso-error' : undefined} />
          </div>
          <div className="fld">
            <div className="flex items-baseline justify-between">
              <label className="lbl" htmlFor="pw">Contraseña</label>
              <A pagina="Contacto" className="text-sm font-semibold no-underline">¿La olvidaste?</A>
            </div>
            <div className="relative">
              <input id="pw" name="password" className="inp !pr-[52px]" type={ver ? 'text' : 'password'} autoComplete="current-password" value={clave} onChange={e => { setClave(e.target.value); setError(''); }} aria-invalid={!!error} aria-describedby={error ? 'acceso-error' : undefined} />
              <button type="button" onClick={() => setVer(!ver)} aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute right-0.5 top-0.5 flex size-11 items-center justify-center text-gris hover:text-tinta">
                {ver ? <EyeOff className="size-5" strokeWidth={1.8} /> : <Eye className="size-5" strokeWidth={1.8} />}
              </button>
            </div>
          </div>
          {error && <p id="acceso-error" role="alert" className="m-0 rounded-[10px] bg-[#FDECEA] px-3.5 py-3 text-sm font-semibold text-[#B42318]">{error}</p>}
          <button className="btn btn-p w-full active:scale-[0.98]" type="submit" disabled={entrando}>{entrando ? 'Entrando…' : `Entrar como ${rol.toLowerCase()}`}</button>
          <p className="m-0 text-center text-sm text-gris">¿Problemas para entrar? <A pagina="Contacto" className="font-semibold">Escríbenos</A> · <A pagina="Home" className="font-semibold">Volver al inicio</A></p>
        </form>
      </main>
    </div>
  );
}
