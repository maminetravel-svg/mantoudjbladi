import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-map-gl', 'mapbox-gl'],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': { target: 'https://mantoudj.rflydz.com', changeOrigin: true, secure: true },
      '/uploads': { target: 'https://mantoudj.rflydz.com', changeOrigin: true, secure: true },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          map: ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
})
