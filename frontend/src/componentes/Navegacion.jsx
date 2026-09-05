// ============================================================
// Navegación principal. Es UN solo componente que cambia de forma
// según el tamaño de pantalla (lo decide el CSS, ver App.css):
//  - Celular: barra flotante tipo "píldora" abajo, solo íconos + texto.
//  - Computadora / tablet horizontal: panel lateral índigo con la
//    marca arriba, los accesos en el medio y el usuario abajo.
// ============================================================

import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../contexto/AuthContext';
import { IconoBuscar, IconoProductos, IconoProveedores, IconoPagos, IconoIngresos, IconoUsuario, IconoConfiguracion } from './Iconos';

export const ACCESOS = [
  { ruta: '/', Icono: IconoBuscar, etiqueta: 'Comparar', titulo: 'Comparador' },
  { ruta: '/productos', Icono: IconoProductos, etiqueta: 'Productos', titulo: 'Productos' },
  { ruta: '/proveedores', Icono: IconoProveedores, etiqueta: 'Proveedores', titulo: 'Proveedores' },
  { ruta: '/pagos', Icono: IconoPagos, etiqueta: 'Pagos', titulo: 'Pagos' },
  { ruta: '/ingresos', Icono: IconoIngresos, etiqueta: 'Ingresos', titulo: 'Ingresos' }
];

export default function Navegacion() {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <nav className="navegacion">
      <div className="nav-marca">
        <span className="monograma monograma-claro">FS</span>
        <span className="nav-marca-texto">
          <span>Frutos Secos</span>
          <span>Carmen T</span>
        </span>
      </div>

      <div className="nav-accesos">
        {ACCESOS.map(({ ruta, Icono, etiqueta }) => (
          <NavLink
            key={ruta}
            to={ruta}
            end={ruta === '/'}
            className={({ isActive }) => 'acceso-nav' + (isActive ? ' activo' : '')}
          >
            <Icono />
            <span>{etiqueta}</span>
          </NavLink>
        ))}
      </div>

      <div className="nav-pie">
        {usuario?.rol === 'admin' && (
          <Link to="/configuracion" className="nav-usuario">
            <span className="nav-usuario-icono"><IconoConfiguracion width={18} height={18} /></span>
            <span className="nav-usuario-texto">
              <span>Configuración</span>
            </span>
          </Link>
        )}

        <button type="button" className="nav-usuario" onClick={cerrarSesion}>
          <span className="nav-usuario-icono"><IconoUsuario width={18} height={18} /></span>
          <span className="nav-usuario-texto">
            <span>{usuario?.nombre}</span>
            <span>Salir</span>
          </span>
        </button>
      </div>
    </nav>
  );
}
