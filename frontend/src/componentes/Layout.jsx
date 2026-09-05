// ============================================================
// Estructura general de la app ya logueada: encabezado (con quién
// está logueado y el botón para cerrar sesión) + el contenido de la
// pantalla activa + la navegación inferior fija.
// ============================================================

import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexto/AuthContext';
import NavegacionInferior from './NavegacionInferior';

export default function Layout() {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <div className="app-shell">
      <header className="encabezado">
        <span>{usuario?.nombre}</span>
        <button onClick={cerrarSesion} className="boton-salir">Salir</button>
      </header>

      <main className="contenido">
        <Outlet />
      </main>

      <NavegacionInferior />
    </div>
  );
}
