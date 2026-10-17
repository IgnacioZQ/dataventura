import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { A, Marco } from '@/components/rediseno/Marco';

export default function PageNotFound() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = 'Página no encontrada · Delhos Academy';
    document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex');
  }, []);
  return (
    <Marco>
      <div className="wrap flex flex-col items-start gap-4 py-28">
        <span className="eyebrow">Error 404</span>
        <h1 className="h text-5xl">Esta página no existe</h1>
        <p className="lead">No encontramos <strong className="text-tinta">{pathname}</strong> en Delhos Academy. Puede que el enlace esté mal escrito o que la página se haya movido.</p>
        <div className="mt-2 flex flex-wrap gap-3"><A pagina="Home" className="btn btn-p">Ir al inicio</A><A pagina="Cursos" className="btn btn-s">Ver cursos</A></div>
      </div>
    </Marco>
  );
}
