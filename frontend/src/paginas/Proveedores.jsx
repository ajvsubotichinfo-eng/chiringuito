// ============================================================
// Pantalla Proveedores: lista con búsqueda. Cada fila lleva al
// detalle del proveedor (productos que vende y pagos recibidos).
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api';
import { IconoBuscar, IconoMas } from '../componentes/Iconos';

export default function Proveedores() {
  const [busqueda, setBusqueda] = useState('');
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const espera = setTimeout(async () => {
      setCargando(true);
      const respuesta = await apiFetch(`/api/proveedores?q=${encodeURIComponent(busqueda)}`);
      if (respuesta.ok) {
        setProveedores(respuesta.proveedores);
      }
      setCargando(false);
    }, 250);

    return () => clearTimeout(espera);
  }, [busqueda]);

  return (
    <div className="contenedor-angosto">
      <div className="buscador">
        <IconoBuscar className="buscador-icono" width={20} height={20} />
        <input
          type="text"
          placeholder="Buscar proveedor..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {cargando && <p className="texto-suave" style={{ marginTop: 16 }}>Cargando...</p>}

      {!cargando && proveedores.length === 0 && (
        <p className="texto-suave" style={{ marginTop: 16 }}>No se encontraron proveedores.</p>
      )}

      {!cargando && proveedores.length > 0 && (
        <ul className="lista-items" style={{ marginTop: 16 }}>
          {proveedores.map(proveedor => (
            <li key={proveedor.id}>
              <Link to={`/proveedores/${proveedor.id}`} className={'item-lista' + (proveedor.activo ? '' : ' inactivo')}>
                <div className="item-lista-fila">
                  <div className="item-lista-datos">
                    <span className="item-lista-titulo">{proveedor.nombre}</span>
                    <span className="texto-secundario">
                      {proveedor.contacto || 'Sin contacto'}
                      {proveedor.dia_visita && ` · Visita: ${proveedor.dia_visita}`}
                    </span>
                  </div>
                  {!proveedor.activo && <span className="insignia-inactivo">Inactivo</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link to="/proveedores/nuevo" className="boton-flotante">
        <IconoMas width={16} height={16} />
        Nuevo proveedor
      </Link>
    </div>
  );
}
