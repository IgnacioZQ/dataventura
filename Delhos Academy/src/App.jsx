import { Toaster } from "@/components/ui/toaster"
import { Toaster as Avisos } from "sonner"
import ScrollToTop from "@/components/ScrollToTop"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { MotionConfig } from 'motion/react';
import PageNotFound from './lib/PageNotFound';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

// La Academy se publica en /academy/ dentro del dominio de Delhos (ver vite.config.js).
const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

const Cargando = () => (
  <div className="da flex min-h-[100dvh] items-center justify-center" role="status" aria-label="Cargando…">
    <div className="size-8 animate-spin rounded-full border-4 border-linea border-t-azul" aria-hidden="true" />
  </div>
);

const LayoutWrapper = ({ children, currentPageName }) => (
  <Suspense fallback={<Cargando />}>
    {Layout ? <Layout currentPageName={currentPageName}>{children}</Layout> : children}
  </Suspense>
);

// Estudiantes e instructores tienen su propia sesión (Acceso), así que todas las páginas son públicas.
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={
      <LayoutWrapper currentPageName={mainPageKey}>
        <MainPage />
      </LayoutWrapper>
    } />
    {Object.entries(Pages).map(([path, Page]) => (
      <Route
        key={path}
        path={`/${path}`}
        element={
          <LayoutWrapper currentPageName={path}>
            <Page />
          </LayoutWrapper>
        }
      />
    ))}
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);


function App() {

  return (
    <MotionConfig reducedMotion="user">
    <QueryClientProvider client={queryClientInstance}>
      <Router basename={basename}>
        <ScrollToTop />
        <AppRoutes />
      </Router>
      <Toaster />
      {/* Los avisos de sonner (toast.success, toast.error…) que usan los paneles; antes no se montaban y no se veían. */}
      <Avisos position="top-center" richColors closeButton toastOptions={{ style: { fontFamily: '"Figtree Variable", system-ui, sans-serif' } }} />
    </QueryClientProvider>
    </MotionConfig>
  )
}

export default App
