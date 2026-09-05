import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Registra el service worker (ver public/sw.js) para que el navegador
// pueda ofrecer "Instalar app". Se hace después de que cargó todo,
// para no competir por la conexión con lo importante (la app en sí).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Si falla (ej. navegador viejo), la app funciona igual, solo
      // sin la opción de instalarla.
    });
  });
}
