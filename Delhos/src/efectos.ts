// Efectos visuales del diseño (antes en su app.js), como un solo hook con limpieza: aparición al hacer scroll,
// botones magnéticos, barra de progreso y navegación, índice lateral, palabra que se descifra, red de datos del
// héroe, inclinación con reflejo, banda de temas que acelera con el scroll, ramas del ecosistema que se dibujan,
// tarjetas del desafío, nombre gigante del pie y barrido de color al ir a una plataforma.
import { useEffect } from 'react';

// Los estados del índice y de «volver arriba» usan la clase visible: «show» es la clase de las tarjetas del héroe
// y, al compartirla, el índice dejaba de ser fijo y empujaba la página 263 px hacia abajo.

const lim = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const mezcla = (a: number, b: number, t: number) => a + (b - a) * t;
const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => c.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => Array.from(c.querySelectorAll<T>(s));

type Limpiar = () => void;

export function useEfectos(logos: { academy: string; dataventura: string }) {
  useEffect(() => {
    const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fino = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const limpiar: Limpiar[] = [];
    const escuchar = <K extends keyof WindowEventMap>(t: Window, ev: K, fn: (e: WindowEventMap[K]) => void, op?: AddEventListenerOptions) => {
      t.addEventListener(ev, fn, op); limpiar.push(() => t.removeEventListener(ev, fn));
    };
    const en = (el: Element | null, ev: string, fn: EventListener) => { if (!el) return; el.addEventListener(ev, fn); limpiar.push(() => el.removeEventListener(ev, fn)); };
    let vivo = true;
    let yScroll = 0;

    /* Aparición al hacer scroll */
    const aparece = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); aparece.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    $$('.rv, .split').forEach(el => aparece.observe(el));
    limpiar.push(() => aparece.disconnect());

    /* Las animaciones que se repiten (latidos, bordes que giran, barcos) se pausan en las secciones fuera de pantalla */
    const fuera = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('fuera', !e.isIntersecting)), { rootMargin: '120px 0px' });
    $$('main > section, main > .bands, footer').forEach(el => fuera.observe(el));
    limpiar.push(() => fuera.disconnect());

    /* Botones: brillo que sigue al puntero y, con mouse, efecto magnético */
    $$('.btn').forEach(b => en(b, 'pointermove', (e) => {
      const r = b.getBoundingClientRect(), p = e as PointerEvent;
      b.style.setProperty('--mx', `${p.clientX - r.left}px`); b.style.setProperty('--my', `${p.clientY - r.top}px`);
    }));
    if (fino && !reducir) {
      $$('.magnetic').forEach(el => {
        en(el, 'pointermove', e => {
          const r = el.getBoundingClientRect(), p = e as PointerEvent;
          el.style.transform = `translate(${(p.clientX - r.left - r.width / 2) * 0.28}px, ${(p.clientY - r.top - r.height / 2) * 0.38}px)`;
          el.style.transition = 'transform .15s ease-out, box-shadow .3s, background-color .3s';
        });
        en(el, 'pointerleave', () => { el.style.transition = 'transform .6s cubic-bezier(.34,1.56,.64,1), box-shadow .3s, background-color .3s'; el.style.transform = ''; });
      });
    }

    /* Navegación, progreso, índice, volver arriba, ramas del ecosistema y nombre gigante */
    const nav = $('#nav'), progreso = $('#progress'), arriba = $('#toTop'), toc = $('#toc'), menu = $('#menu');
    const tocLinks = toc ? $$<HTMLAnchorElement>('a', toc) : [];
    const destinos = tocLinks.map(a => $(a.getAttribute('href') || ''));
    const arbol = $('#tree'), gigante = $('#giant');
    const lnIn = arbol ? $$<SVGPathElement>('.links-in .ln', arbol) : [], lnOut = arbol ? $$<SVGPathElement>('.links-out .ln', arbol) : [];
    // Rendimiento: scrollY se lee una vez por cuadro (y lo usa también la banda de temas); el tramo del índice lo
    // avisa un IntersectionObserver; las ramas y el nombre gigante se miden solo cerca de la pantalla; y solo se
    // escribe en la página lo que cambió. Antes, cada cuadro medía todas las secciones y reescribía el índice, y
    // con las animaciones del héroe eso forzaba a recalcular el diseño de toda la página (lento en celulares).
    let antes = scrollY, pendiente = false, max = 1, tramo = 0, tramoPintado = -1, arbolCerca = false, giganteCerca = false;
    yScroll = scrollY;
    const medirAlto = () => { max = Math.max(1, document.documentElement.scrollHeight - innerHeight); pedir(); };
    const ro = new ResizeObserver(medirAlto);
    ro.observe(document.body);
    limpiar.push(() => ro.disconnect());
    const empezo = destinos.map(() => false);
    const ioToc = new IntersectionObserver(es => {
      es.forEach(e => { const i = destinos.indexOf(e.target as HTMLElement); if (i >= 0) empezo[i] = e.isIntersecting || e.boundingClientRect.bottom <= 0; });
      tramo = Math.max(0, empezo.lastIndexOf(true));
      pedir();
    }, { rootMargin: '0px 0px -55% 0px' });
    destinos.forEach(d => d && ioToc.observe(d));
    const ioCerca = new IntersectionObserver(es => {
      es.forEach(e => { if (e.target === arbol) arbolCerca = e.isIntersecting; if (e.target === gigante) giganteCerca = e.isIntersecting; });
      pedir();
    }, { rootMargin: '25% 0px' });
    if (arbol) ioCerca.observe(arbol);
    if (gigante) ioCerca.observe(gigante);
    limpiar.push(() => { ioToc.disconnect(); ioCerca.disconnect(); });
    const alScroll = () => {
      pendiente = false;
      const y = scrollY, p = Math.min(1, y / max);
      yScroll = y;
      // Primero las lecturas de layout y después las escrituras.
      const rArbol = arbolCerca ? arbol?.getBoundingClientRect() : undefined;
      const rGigante = giganteCerca ? gigante?.getBoundingClientRect() : undefined;
      const abierto = !!$('.dd.open') || !!menu?.classList.contains('open');
      if (nav) {
        nav.classList.toggle('scrolled', y > 30);
        if (!abierto && y > 700 && y > antes + 4) nav.classList.add('hide');
        if (y < antes - 4 || y < 700) nav.classList.remove('hide');
      }
      antes = y;
      if (progreso) progreso.style.transform = `scaleX(${p})`;
      if (arriba) { arriba.classList.toggle('visible', y > 900); if (y > 900) arriba.style.setProperty('--off', String(1 - p)); }
      if (toc) {
        if (tramo !== tramoPintado) {
          tocLinks.forEach((a, i) => { a.classList.toggle('on', i === tramo); if (i === tramo) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
          tramoPintado = tramo;
        }
        toc.classList.toggle('visible', y > innerHeight * 0.6);
      }
      if (rArbol) {
        const k = lim((innerHeight - rArbol.top) / (innerHeight * 0.9), 0, 1);
        const a = reducir ? 0 : 1 - lim(k * 2.2 - 0.3, 0, 1), b = reducir ? 0 : 1 - lim(k * 2.2 - 0.8, 0, 1);
        lnIn.forEach(l => l.style.setProperty('--draw', String(a)));
        lnOut.forEach(l => l.style.setProperty('--draw', String(b)));
      }
      if (rGigante) {
        gigante!.style.setProperty('--gf', `${(reducir ? 1 : lim((innerHeight - rGigante.top) / (innerHeight * 0.55), 0, 1)) * 100}%`);
      }
    };
    function pedir() { if (!pendiente) { pendiente = true; requestAnimationFrame(alScroll); } }
    escuchar(window, 'scroll', pedir, { passive: true });
    escuchar(window, 'resize', medirAlto);
    medirAlto();
    alScroll();

    /* Héroe: palabra que se descifra */
    const scr = $('#scramble');
    if (scr && !reducir) {
      const palabras = ['programar.', 'pensar con datos.', 'analizar.', 'crear con IA.', 'decidir mejor.'];
      const glifos = '01<>/{}[]=+*#%$_';
      let w = 0, espera = 0;
      const pasar = (a: string, alTerminar: () => void) => {
        const desde = scr.textContent || '', largo = Math.max(desde.length, a.length);
        const cola = Array.from({ length: largo }, (_, i) => { const ini = Math.floor(Math.random() * 14); return { de: desde[i] || '', a: a[i] || '', ini, fin: ini + 8 + Math.floor(Math.random() * 16), ch: '' }; });
        let f = 0;
        const paso = () => {
          if (!vivo) return;
          let html = '', listos = 0;
          cola.forEach(o => {
            if (f >= o.fin) { listos++; html += o.a; }
            else if (f >= o.ini) { if (!o.ch || Math.random() < 0.3) o.ch = glifos[Math.floor(Math.random() * glifos.length)]; html += `<span class="g">${o.ch.replace('<', '&lt;').replace('>', '&gt;')}</span>`; }
            else html += o.de;
          });
          scr.innerHTML = html;
          if (listos === cola.length) { scr.textContent = a; alTerminar(); return; }
          f++;
          requestAnimationFrame(paso);
        };
        paso();
      };
      let heroeVisible = true;
      const ioHeroe = new IntersectionObserver(e => { heroeVisible = e[0].isIntersecting; });
      const heroe = scr.closest('.hero');
      if (heroe) ioHeroe.observe(heroe);
      limpiar.push(() => ioHeroe.disconnect());
      const ciclo = () => {
        if (!heroeVisible || document.hidden) { espera = window.setTimeout(ciclo, 1000); return; }
        w = (w + 1) % palabras.length;
        pasar(palabras[w], () => { espera = window.setTimeout(ciclo, 2400); });
      };
      espera = window.setTimeout(ciclo, 3400);
      limpiar.push(() => clearTimeout(espera));
    }

    /* Héroe: red de datos con chispas que viajan */
    const lienzo = $<HTMLCanvasElement>('#net');
    if (lienzo) {
      const ctx = lienzo.getContext('2d')!, host = lienzo.parentElement!, raton = { x: -9999, y: -9999 };
      const cs = getComputedStyle(document.documentElement);
      const PUNTO = cs.getPropertyValue('--red-punto').trim() || '30,97,148', LINEA = cs.getPropertyValue('--red-linea').trim() || '74,144,194';
      const TRAMOS = 8;
      let W = 0, H = 0, visible = true, t = 0;
      let nodos: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
      let chispas: { a: typeof nodos[number]; b: typeof nodos[number]; k: number }[] = [];
      const medir = () => {
        const dpr = Math.min(devicePixelRatio || 1, 2);
        W = host.clientWidth; H = host.clientHeight;
        lienzo.width = W * dpr; lienzo.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        nodos = Array.from({ length: lim(Math.round((W * H) / 16000), 26, 96) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: 1.2 + Math.random() * 1.6 }));
      };
      const dibujar = () => {
        t++;
        ctx.clearRect(0, 0, W, H);
        const enlaces: [typeof nodos[number], typeof nodos[number]][] = [];
        if (!reducir) for (const p of nodos) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          const dx = p.x - raton.x, dy = p.y - raton.y, d = Math.hypot(dx, dy);
          if (d > 0 && d < 120) { p.x += (dx / d) * 1.4; p.y += (dy / d) * 1.4; }
        }
        // Las líneas se agrupan por tramos de opacidad y se dibujan en pocos trazos (uno por línea era lo más caro).
        ctx.lineWidth = 1;
        const tramos = Array.from({ length: TRAMOS }, () => new Path2D()), tramosRaton = Array.from({ length: TRAMOS }, () => new Path2D());
        for (let i = 0; i < nodos.length; i++) {
          const a = nodos[i];
          for (let j = i + 1; j < nodos.length; j++) {
            const b = nodos[j], dx = a.x - b.x, dy = a.y - b.y;
            if (dx > 150 || dx < -150 || dy > 150 || dy < -150) continue;
            const d = Math.hypot(dx, dy);
            if (d < 150) { const p = tramos[Math.min(TRAMOS - 1, Math.floor((d / 150) * TRAMOS))]; p.moveTo(a.x, a.y); p.lineTo(b.x, b.y); enlaces.push([a, b]); }
          }
          const dm = Math.hypot(a.x - raton.x, a.y - raton.y);
          if (dm < 180) { const p = tramosRaton[Math.min(TRAMOS - 1, Math.floor((dm / 180) * TRAMOS))]; p.moveTo(a.x, a.y); p.lineTo(raton.x, raton.y); }
        }
        for (let k = 0; k < TRAMOS; k++) {
          const f = 1 - (k + 0.5) / TRAMOS;
          ctx.strokeStyle = `rgba(${LINEA},${0.3 * f})`; ctx.stroke(tramos[k]);
          ctx.strokeStyle = `rgba(${PUNTO},${0.45 * f})`; ctx.stroke(tramosRaton[k]);
        }
        const puntos = new Path2D();
        for (const p of nodos) { puntos.moveTo(p.x + p.r, p.y); puntos.arc(p.x, p.y, p.r, 0, Math.PI * 2); }
        ctx.fillStyle = `rgba(${PUNTO},.55)`; ctx.fill(puntos);
        if (!reducir && enlaces.length && t % 18 === 0 && chispas.length < 7) { const [a, b] = enlaces[Math.floor(Math.random() * enlaces.length)]; chispas.push({ a, b, k: 0 }); }
        chispas = chispas.filter(s => s.k <= 1);
        for (const s of chispas) {
          s.k += 0.022;
          const x = mezcla(s.a.x, s.b.x, s.k), y = mezcla(s.a.y, s.b.y, s.k);
          const g = ctx.createRadialGradient(x, y, 0, x, y, 10);
          g.addColorStop(0, 'rgba(251,191,36,.95)'); g.addColorStop(1, 'rgba(251,191,36,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#E9B949'; ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
        }
      };
      let idRed = 0;
      const bucle = () => { if (!vivo || !visible) { idRed = 0; return; } dibujar(); idRed = requestAnimationFrame(bucle); };
      medir();
      escuchar(window, 'resize', () => { medir(); if (reducir) dibujar(); });
      const io = new IntersectionObserver(e => { visible = e[0].isIntersecting; if (visible && !idRed && !reducir) bucle(); });
      io.observe(lienzo);
      limpiar.push(() => { io.disconnect(); cancelAnimationFrame(idRed); });
      const foco = $('#heroSpot');
      en(host, 'pointermove', e => {
        const r = lienzo.getBoundingClientRect(), p = e as PointerEvent;
        raton.x = p.clientX - r.left; raton.y = p.clientY - r.top;
        foco?.style.setProperty('--sx', `${raton.x}px`); foco?.style.setProperty('--sy', `${raton.y}px`);
      });
      en(host, 'pointerleave', () => { raton.x = raton.y = -9999; });
      if (reducir) dibujar(); else bucle();
    }

    /* Inclinación 3D del escenario y reflejo en las tarjetas */
    const escenario = $('#stage'), escenarioIn = $('#stageIn');
    if (escenario && escenarioIn && fino && !reducir) {
      const heroe = escenario.closest('.hero');
      en(heroe, 'pointermove', e => {
        const r = escenario.getBoundingClientRect(), p = e as PointerEvent;
        const x = lim((p.clientX - r.left) / r.width - 0.5, -1, 1), y = lim((p.clientY - r.top) / r.height - 0.5, -1, 1);
        escenarioIn.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 6}deg)`;
      });
      en(heroe, 'pointerleave', () => { escenarioIn.style.transform = ''; });
    }
    $$('.show, .branch').forEach(el => en(el, 'pointermove', e => {
      const r = el.getBoundingClientRect(), p = e as PointerEvent;
      el.style.setProperty('--gx', `${p.clientX - r.left}px`); el.style.setProperty('--gy', `${p.clientY - r.top}px`);
    }));
    $$('.branch').forEach(b => { const c = $('.branch-cover', b); en(b, 'pointermove', e => { if (!c) return; const r = c.getBoundingClientRect(), p = e as PointerEvent; c.style.setProperty('--gx', `${p.clientX - r.left}px`); c.style.setProperty('--gy', `${p.clientY - r.top}px`); }); });

    /* Banda de temas: se mueve sola y acelera con el scroll */
    const pistas = $$('.band-track');
    const bandas = $('.bands');
    if (pistas.length && bandas && !reducir) {
      const estado = pistas.map(t => ({ t, x: 0, dir: +(t.dataset.speed || 1), w: 0 }));
      // La posición la deja alScroll (una lectura por cuadro): leer scrollY aquí también, después de que otros
      // efectos escribieron estilos, obligaba a recalcular el diseño de toda la página en cada cuadro.
      let vel = 0, yAntes = yScroll, verBandas = true;
      const medirBandas = () => estado.forEach(s => { s.w = s.t.scrollWidth / 2; });
      medirBandas(); escuchar(window, 'resize', medirBandas);
      let idBanda = 0;
      const io = new IntersectionObserver(e => { verBandas = e[0].isIntersecting; if (verBandas && !idBanda) mover(); });
      io.observe(bandas);
      limpiar.push(() => { io.disconnect(); cancelAnimationFrame(idBanda); });
      const mover = () => {
        if (!vivo || !verBandas) { idBanda = 0; return; }
        const dy = yScroll - yAntes; yAntes = yScroll;
        vel = mezcla(vel, lim(dy, -60, 60), 0.1);
        estado.forEach(s => {
          s.x -= s.dir * (0.6 + Math.abs(vel) * 0.35);
          if (s.x < -s.w) s.x += s.w;
          if (s.x > 0) s.x -= s.w;
          s.t.style.transform = `translateX(${s.x}px) skewX(${lim(-vel * 0.25, -8, 8)}deg)`;
        });
        idBanda = requestAnimationFrame(mover);
      };
    }

    /* El desafío: cada tarjeta pasa del problema a la respuesta */
    const dz = $('#dz');
    if (dz) {
      const tarjetas = $$('.dz-card', dz);
      const marcar = (c: HTMLElement, v: boolean) => { c.classList.toggle('solved', v); c.setAttribute('aria-pressed', String(v)); };
      let corrio = false;
      const tiempos: number[] = [];
      const io = new IntersectionObserver(e => {
        if (!e[0].isIntersecting || corrio) return;
        corrio = true;
        tarjetas.forEach((c, i) => tiempos.push(window.setTimeout(() => marcar(c, true), reducir ? 0 : 900 + i * 900)));
      }, { threshold: 0.4 });
      io.observe(dz);
      limpiar.push(() => { io.disconnect(); tiempos.forEach(clearTimeout); });
      tarjetas.forEach(c => {
        const alternar = () => marcar(c, !c.classList.contains('solved'));
        if (!fino) en(c, 'click', alternar);
        en(c, 'keydown', e => { const k = (e as KeyboardEvent).key; if (k === 'Enter' || k === ' ') { e.preventDefault(); alternar(); } });
        if (fino) {
          let estaba = false;
          en(c, 'pointerenter', () => { estaba = c.classList.contains('solved'); marcar(c, !estaba); });
          en(c, 'pointerleave', () => marcar(c, estaba));
        }
      });
    }

    /* Borde giratorio del formulario: se pausa fuera de pantalla */
    const formulario = $('#form');
    if (formulario) {
      const io = new IntersectionObserver(e => formulario.classList.toggle('parado', !e[0].isIntersecting));
      io.observe(formulario); limpiar.push(() => io.disconnect());
    }

    /* Barrido de color al ir a una plataforma: cubre la pantalla con su color y luego navega */
    if (!reducir) {
      const MARCAS: Record<string, [string, string]> = { ac: ['Delhos Academy', logos.academy], dv: ['Dataventura', logos.dataventura] };
      const barrido = document.createElement('div');
      barrido.className = 'wipe'; barrido.setAttribute('aria-hidden', 'true');
      barrido.innerHTML = '<div class="wipe-in"></div>';
      document.body.append(barrido);
      let ocupado = false;
      const alClic = (e: MouseEvent) => {
        const enlace = (e.target as Element | null)?.closest?.('a[data-wipe]') as HTMLAnchorElement | null;
        const marca = enlace && MARCAS[enlace.dataset.wipe || ''];
        if (!enlace || !marca || ocupado || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        ocupado = true;
        const caja = enlace.getBoundingClientRect(), teclado = e.detail === 0;
        barrido.className = `wipe wipe-${enlace.dataset.wipe}`;
        const dentro = barrido.firstElementChild as HTMLElement;
        dentro.replaceChildren();
        const img = document.createElement('img'); img.src = marca[1]; img.alt = '';
        dentro.append(img, marca[0]);
        barrido.style.setProperty('--x', `${teclado ? caja.left + caja.width / 2 : e.clientX}px`);
        barrido.style.setProperty('--y', `${teclado ? caja.top + caja.height / 2 : e.clientY}px`);
        void barrido.offsetWidth;
        barrido.classList.add('on');
        window.setTimeout(() => { location.href = enlace.href; }, 820);
        window.setTimeout(() => { barrido.classList.remove('on'); ocupado = false; }, 4000);
      };
      const alVolver = (e: PageTransitionEvent) => { if (e.persisted) { barrido.classList.remove('on'); ocupado = false; } };
      document.addEventListener('click', alClic);
      addEventListener('pageshow', alVolver);
      limpiar.push(() => { document.removeEventListener('click', alClic); removeEventListener('pageshow', alVolver); barrido.remove(); });
    }

    return () => { vivo = false; limpiar.forEach(fn => fn()); };
  }, [logos.academy, logos.dataventura]);
}
