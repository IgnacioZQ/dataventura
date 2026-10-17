import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // La Academy vive en /academy/ dentro del dominio de Delhos (mapa en ../herramientas/sitio.mjs).
  base: '/academy/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Remotion (videos del hero y de cada curso) y las librerías pesadas del panel van en archivos aparte.
        manualChunks(id) {
          if (id.includes('node_modules/remotion') || id.includes('node_modules/@remotion')) return 'remotion';
          if (id.includes('node_modules/jspdf') || id.includes('node_modules/html2canvas')) return 'pdf';
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) return 'graficos';
        }
      }
    }
  }
});
