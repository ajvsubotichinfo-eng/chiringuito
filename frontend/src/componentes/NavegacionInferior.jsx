// ============================================================
// Barra de navegación inferior, fija, con los accesos principales.
// Pensada para el celular: iconos grandes + texto corto.
// ============================================================

import { NavLink } from 'react-router-dom';

const ACCESOS = [
  { ruta: '/', icono: '🔍', etiqueta: 'Buscar' },
  { ruta: '/productos', icono: '📦', etiqueta: 'Productos' },
  { ruta: '/proveedores', icono: '🚚', etiqueta: 'Proveedores' },
  { ruta: '/pagos', icono: '💰', etiqueta: 'Pagos' }
];

export default function NavegacionInferior() {
  return (
    <nav className="navegacion-inferior">
      {ACCESOS.map(acceso => (
        <NavLink
          key={acceso.ruta}
          to={acceso.ruta}
          end={acceso.ruta === '/'}
          className={({ isActive }) => 'acceso-nav' + (isActive ? ' activo' : '')}
        >
          <span className="icono-nav">{acceso.icono}</span>
          <span>{acceso.etiqueta}</span>
        </NavLink>
      ))}
    </nav>
  );
}
