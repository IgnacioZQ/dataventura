import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// La landing de Delhos vive en la raíz del dominio (mapa en ../herramientas/sitio.mjs).
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/remotion') || id.includes('node_modules/@remotion')) return 'remotion';
        }
      }
    }
  }
});
