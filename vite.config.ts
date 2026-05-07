import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Le frontend React (port 5173) proxifie vers le backend Node.js (port 3000)
// NE PAS lancer server.ts — utiliser backend/src/server.js uniquement

export default defineConfig({
  define: {
    'process.env': {},
    'process.env.NODE_ENV': JSON.stringify('development'),
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    host: '0.0.0.0', // accessible depuis le réseau local (mobile)
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // timeout généreux pour le scraping live (30s)
        timeout: 30000,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Optimisation taille pour mobile
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
        }
      }
    }
  }
})
