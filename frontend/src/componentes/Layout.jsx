// ============================================================
// Estructura general de la app ya logueada: encabezado con el título
// de la pantalla activa + el contenido + la navegación (que abajo es
// una barra flotante en el celular y un panel lateral en computadora).
// ============================================================

import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexto/AuthContext';
import Navegacion, { ACCESOS } from './Navegacion';
import { IconoUsuario } from './Iconos';

export default function Layout() {
  const { cerrarSesion } = useAuth();
  const { pathname } = useLocation();
  // Las rutas de detalle/formulario (ej. /productos/5) cuelgan de un
  // acceso de la navegación (/productos); se busca por prefijo, no
  // por igualdad exacta, para que el título siga siendo el correcto.
  const activo = ACCESOS.find(acceso => (acceso.ruta === '/' ? pathname === '/' : pathname.startsWith(acceso.ruta)));

  return (
    <div className="app-shell">
      <Navegacion />

      <div className="app-cuerpo">
        <header className="encabezado">
          <span className="monograma solo-celular">FS</span>
          <span className="titulo-pantalla">{activo?.titulo ?? ''}</span>
          <button type="button" className="boton-circulo solo-celular" onClick={cerrarSesion} aria-label="Cerrar sesión">
            <IconoUsuario width={20} height={20} />
          </button>
        </header>

        <main className="contenido">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
