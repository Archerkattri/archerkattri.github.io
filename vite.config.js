import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    sourcemap: false,
    minify: 'esbuild',
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('d3') || id.includes('topojson')) return 'map';
            if (id.includes('react')) return 'react';
            return 'vendor';
          }
          if (id.includes('/components/WorldMap') || id.includes('/components/Timeline')) return 'map';
        },
      },
    },
  },
});
