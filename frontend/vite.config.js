import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// El build de React se compila directo dentro de /public, que es la
// carpeta que Express ya sirve como archivos estáticos (ver src/server.js
// del backend). Así, subir el código nuevo a GitHub y que Hostinger
// redespliegue alcanza para actualizar también la app.
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: '../public',
    emptyOutDir: true
  },
  server: {
    // En desarrollo, Vite corre en su propio puerto (5173) pero las
    // llamadas a /api las manda al backend Express (puerto 3000) para
    // no tener que lidiar con CORS mientras programamos.
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
