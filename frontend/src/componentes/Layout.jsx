// ============================================================
// Estructura general de la app ya logueada: encabezado con el título
// de la pantalla activa + el contenido + la navegación (que abajo es
// una barra flotante en el celular y un panel lateral en computadora).
// También envuelve todo en ConfiguracionProvider, para que cualquier
// pantalla pueda formatear montos en la moneda que eligió el admin.
// ============================================================

import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexto/AuthContext';
import { ConfiguracionProvider } from '../contexto/ConfiguracionContext';
import Navegacion, { ACCESOS } from './Navegacion';
import { IconoUsuario, IconoConfiguracion } from './Iconos';

function tituloDePantalla(pathname) {
  if (pathname.startsWith('/configuracion')) return 'Configuración';
  const acceso = ACCESOS.find(a => (a.ruta === '/' ? pathname === '/' : pathname.startsWith(a.ruta)));
  return acceso?.titulo ?? '';
}

export default function Layout() {
  const { usuario, cerrarSesion } = useAuth();
  const { pathname } = useLocation();

  return (
    <ConfiguracionProvider>
      <div className="app-shell">
        <Navegacion />

        <div className="app-cuerpo">
          <header className="encabezado">
            <span className="monograma solo-celular">FS</span>
            <span className="titulo-pantalla">{tituloDePantalla(pathname)}</span>
            <span className="encabezado-acciones solo-celular">
              {usuario?.rol === 'admin' && (
                <Link to="/configuracion" className="boton-circulo" aria-label="Configuración">
                  <IconoConfiguracion width={18} height={18} />
                </Link>
              )}
              <button type="button" className="boton-circulo" onClick={cerrarSesion} aria-label="Cerrar sesión">
                <IconoUsuario width={20} height={20} />
              </button>
            </span>
          </header>

          <main className="contenido">
            <Outlet />
          </main>
        </div>
      </div>
    </ConfiguracionProvider>
  );
}
