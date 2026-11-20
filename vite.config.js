import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        404: fileURLToPath(new URL('./404.html', import.meta.url)),
        500: fileURLToPath(new URL('./500.html', import.meta.url)),
        recovery: fileURLToPath(new URL('./recuperacao.html', import.meta.url)),
      },
    },
  },
});
