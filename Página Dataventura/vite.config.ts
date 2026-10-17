import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// La landing vive en /dataventura/ dentro del dominio de Delhos (mapa en ../herramientas/sitio.mjs).
export default defineConfig({
  base: '/dataventura/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  build: {
    rollupOptions: {
      // Portada y las tres subpáginas del diseño (Quiénes somos, Cómo enseñamos, Contacto).
      input: {
        inicio: fileURLToPath(new URL('./index.html', import.meta.url)),
        quienes: fileURLToPath(new URL('./quienes-somos/index.html', import.meta.url)),
        como: fileURLToPath(new URL('./como-ensenamos/index.html', import.meta.url)),
        contacto: fileURLToPath(new URL('./contacto/index.html', import.meta.url))
      },
      output: {
        // Remotion y Motion en archivos aparte: la portada carga primero y el video después.
        // React va en su propio archivo y ANTES que Remotion: si no, react-dom (que también usa la isla de ruta)
        // queda dentro del archivo de Remotion y las cuatro páginas lo precargan completo (unos 107 KB gzip).
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          if (/node_modules\/(@remotion|remotion)\//.test(id)) return 'remotion';
          if (/node_modules\/(motion|motion-dom|motion-utils|framer-motion)\//.test(id)) return 'motion';
        }
      }
    }
  }
});
