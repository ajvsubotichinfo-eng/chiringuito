// ============================================================
// Enrutado principal de la app.
//
// /login                       → pantalla de login (pública)
// /                             → Comparador
// /productos                   → lista de productos
// /productos/nuevo              → crear producto
// /productos/:id                → detalle (precios, historial)
// /productos/:id/editar         → editar producto
// /proveedores                  → lista de proveedores
// /proveedores/nuevo            → crear proveedor
// /proveedores/:id              → detalle (productos que vende, pagos)
// /proveedores/:id/editar       → editar proveedor
// /pagos                        → Pagos (pendiente, Fase 4.4)
//
// Todas las rutas de adentro comparten el mismo Layout (encabezado +
// navegación) y están protegidas por RutaProtegida: si no hay sesión
// iniciada, mandan a /login.
// ============================================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexto/AuthContext';
import RutaProtegida from './componentes/RutaProtegida';
import Layout from './componentes/Layout';
import PantallaProximamente from './componentes/PantallaProximamente';
import Login from './paginas/Login';
import Comparador from './paginas/Comparador';
import Productos from './paginas/Productos';
import ProductoFormulario from './paginas/ProductoFormulario';
import ProductoDetalle from './paginas/ProductoDetalle';
import Proveedores from './paginas/Proveedores';
import ProveedorFormulario from './paginas/ProveedorFormulario';
import ProveedorDetalle from './paginas/ProveedorDetalle';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<RutaProtegida />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Comparador />} />

              <Route path="/productos" element={<Productos />} />
              <Route path="/productos/nuevo" element={<ProductoFormulario />} />
              <Route path="/productos/:id" element={<ProductoDetalle />} />
              <Route path="/productos/:id/editar" element={<ProductoFormulario />} />

              <Route path="/proveedores" element={<Proveedores />} />
              <Route path="/proveedores/nuevo" element={<ProveedorFormulario />} />
              <Route path="/proveedores/:id" element={<ProveedorDetalle />} />
              <Route path="/proveedores/:id/editar" element={<ProveedorFormulario />} />

              <Route path="/pagos" element={<PantallaProximamente titulo="Pagos" />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
