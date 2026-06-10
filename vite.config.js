import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// Injects a static render of the document view into dist/index.html.
// This is the no-JS / SEO fallback (hidden via `html.js .prerendered`
// the moment JS runs); all content and numbers are verifiable in the
// built HTML itself.
function prerenderDocument() {
  return {
    name: 'prerender-document',
    apply: 'build',
    async closeBundle() {
      const { createServer } = await import('vite');
      const server = await createServer({
        configFile: false,
        plugins: [react()],
        server: { middlewareMode: true },
        appType: 'custom',
        logLevel: 'error',
      });
      try {
        const mod = await server.ssrLoadModule('/src/prerender-entry.jsx');
        const html = mod.render();
        const file = path.resolve('dist/index.html');
        const out = fs
          .readFileSync(file, 'utf8')
          .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
        fs.writeFileSync(file, out);
        console.log('  ✓ prerendered document view into dist/index.html');
      } finally {
        await server.close();
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), prerenderDocument()],
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
            if (id.includes('react')) return 'react';
            return 'vendor';
          }
        },
      },
    },
  },
});
