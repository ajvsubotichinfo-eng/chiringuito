// ============================================================
// Enrutado principal de la app.
//
// /login              → pantalla de login (pública)
// /                    → Comparador (dentro del shell logueado)
// /productos           → Productos      (dentro del shell logueado)
// /proveedores         → Proveedores    (dentro del shell logueado)
// /pagos               → Pagos          (dentro del shell logueado)
//
// Las 4 rutas de adentro comparten el mismo Layout (encabezado +
// navegación inferior) y están protegidas por RutaProtegida: si no
// hay sesión iniciada, mandan a /login.
// ============================================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexto/AuthContext';
import RutaProtegida from './componentes/RutaProtegida';
import Layout from './componentes/Layout';
import PantallaProximamente from './componentes/PantallaProximamente';
import Login from './paginas/Login';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<RutaProtegida />}>
            <Route element={<Layout />}>
              <Route path="/" element={<PantallaProximamente titulo="🔍 Comparador" />} />
              <Route path="/productos" element={<PantallaProximamente titulo="📦 Productos" />} />
              <Route path="/proveedores" element={<PantallaProximamente titulo="🚚 Proveedores" />} />
              <Route path="/pagos" element={<PantallaProximamente titulo="💰 Pagos" />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
