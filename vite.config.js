import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 3100,
    strictPort: false
  },
  build: {
    outDir: 'dist'
  }
});
