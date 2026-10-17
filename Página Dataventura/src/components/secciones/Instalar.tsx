// 11 · Llévala contigo: sin tiendas. Botón directo a la app, pasos para instalarla según el sistema
// (se elige solo al detectar el dispositivo) y un QR generado con la dirección real de la app.
import { motion } from 'motion/react';
import QRCode from 'qrcode';
import { useEffect, useId, useState } from 'react';
import { Contenedor, Gema, Telefono } from '@/components/Piezas';
import { FluidTabs } from '@/components/ui/watermelon/fluid-tabs';
import { ShimmerLink } from '@/components/ui/watermelon/shimmer-button';
import { app, APP_URL } from '@/config';
import { useIdioma } from '@/i18n/idioma';

// Android en verde-700: el texto blanco de la pestaña activa sobre el verde claro quedaba en 2,35:1.
const COLORES = ['#1b1230', '#167a55', '#7b4dff'];

function sistema(): number {
  if (typeof navigator === 'undefined') return 2;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 0;
  if (/Android/.test(ua)) return 1;
  return 2;
}

export const Flecha = () => (
  <svg className="empuja" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M7 17L17 7M9 7h8v8" /></svg>
);

export function Instalar() {
  const { t } = useIdioma();
  const [pestana, setPestana] = useState(sistema);
  const [qr, setQr] = useState('');
  const panel = useId();
  const pestanas = useId();
  const local = /localhost|127\.0\.0\.1/.test(APP_URL);
  const pasos = (t.tabSteps as string[][])[pestana];

  useEffect(() => {
    let vivo = true;
    QRCode.toDataURL(`${APP_URL}/`, { margin: 1, width: 208, errorCorrectionLevel: 'M', color: { dark: '#1b1230', light: '#ffffff' } })
      .then(url => vivo && setQr(url))
      .catch(() => vivo && setQr(''));
    return () => { vivo = false; };
  }, []);

  return (
    <section id="instalar" className="overflow-hidden bg-white py-16 md:py-24">
      <Contenedor className="flex flex-wrap items-center justify-between gap-12">
        <motion.div initial={{ opacity: 0, x: -36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55 }}
          className="flex max-w-[520px] flex-[1_1_400px] flex-col gap-5">
          <span className="pildora"><b>11</b>{t.dlPill}</span>
          <h2 className="titulo-seccion text-dv">{t.dlH}</h2>
          <p className="text-lg leading-relaxed font-semibold text-suave">{t.dlP}</p>
          <ShimmerLink href={app('/')} data-wipe="dv" className="brillo self-start !min-h-[58px] !px-7">{t.open}<Flecha /></ShimmerLink>

          <div className="flex flex-col gap-1.5 rounded-[22px] border-2 border-borde bg-white p-2 shadow-[0_4px_0_#e5e0f2]">
            <FluidTabs ariaLabel={t.installH} panelId={panel} idBase={pestanas} active={String(pestana)} onChange={id => setPestana(Number(id))}
              className="grid grid-cols-3 rounded-2xl [&>button]:rounded-xl [&>button>span:first-child]:rounded-xl"
              tabs={(t.tabL as string[]).map((l, i) => ({ id: String(i), label: l, color: COLORES[i] }))} />
            {/* El panel envuelve la lista (role="tabpanel" sobre el <ol> le quitaba la semántica de lista). */}
            <div id={panel} role="tabpanel" aria-labelledby={`${pestanas}-${pestana}`}>
              <motion.ol key={`${pestana}-${t.langName}`} initial="oculto" animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.07 } } }} className="flex flex-col gap-2.5 px-2.5 pt-2 pb-2.5">
                {pasos.map((p, i) => (
                  <motion.li key={p} variants={{ oculto: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                    className="flex items-center gap-3 font-bold leading-snug text-tinta">
                    <span className="grid size-[30px] shrink-0 place-items-center rounded-[10px] bg-lila-200 font-ui text-sm font-extrabold text-dv-700">{i + 1}</span>{p}
                  </motion.li>
                ))}
              </motion.ol>
            </div>
          </div>

          {qr && (
            <div className="hidden items-center gap-3.5 self-start rounded-[20px] border-2 border-borde bg-white py-2.5 pr-4 pl-2.5 shadow-[0_4px_0_#e5e0f2] sm:flex">
              <img src={qr} alt={t.qrAlt} width={104} height={104} className="block size-[104px] rounded-[10px]" />
              <span className="flex max-w-[180px] flex-col gap-1">
                <span className="font-ui text-[15px] leading-tight font-extrabold text-tinta">{t.qr}</span>
                {local && <span className="text-xs font-semibold text-gris">{t.instalar.qrLocal}</span>}
              </span>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55 }}
          className="relative mx-auto flex max-w-[380px] flex-[1_1_300px] justify-center py-5">
          <div aria-hidden className="absolute top-1/2 left-1/2 size-[330px] -translate-1/2 rounded-full bg-[radial-gradient(circle,#e1d8ff,transparent_70%)]" />
          <motion.div whileHover={{ rotate: 0, scale: 1.02 }} initial={{ rotate: 4 }} transition={{ type: 'spring', stiffness: 160, damping: 16 }}>
            <Telefono src="img/app/app-mapa.webp" alt={t.phoneAlt} ancho={250} />
          </motion.div>
          <div aria-hidden className="flota absolute top-[110px] -left-1.5 flex -rotate-6 items-center gap-2 rounded-2xl border-2 border-borde bg-white px-3 py-2 shadow-[0_4px_0_#e5e0f2]">
            <svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#2fbf8a" /><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span className="font-ui text-sm font-extrabold text-verde-700">{t.badgeOk}</span>
          </div>
          <div aria-hidden className="flota d2 absolute -right-1 bottom-[120px] flex rotate-6 items-center gap-1.5 rounded-2xl bg-oro px-3 py-2 shadow-[0_4px_0_#d6a572]">
            <Gema tam={18} /><span className="font-display text-lg text-tinta">{t.chipGems}</span>
          </div>
        </motion.div>
      </Contenedor>
    </section>
  );
}
