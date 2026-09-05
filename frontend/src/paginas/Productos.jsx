// ============================================================
// Pantalla Productos: catálogo con búsqueda. Cada fila lleva al
// detalle del producto (proveedores/precios e historial).
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api';
import { formatearPesos } from '../utils';
import { IconoBuscar, IconoMas } from '../componentes/Iconos';

export default function Productos() {
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const espera = setTimeout(async () => {
      setCargando(true);
      const respuesta = await apiFetch(`/api/productos?q=${encodeURIComponent(busqueda)}`);
      if (respuesta.ok) {
        setProductos(respuesta.productos);
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
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {cargando && <p className="texto-suave" style={{ marginTop: 16 }}>Cargando...</p>}

      {!cargando && productos.length === 0 && (
        <p className="texto-suave" style={{ marginTop: 16 }}>No se encontraron productos.</p>
      )}

      {!cargando && productos.length > 0 && (
        <ul className="lista-items" style={{ marginTop: 16 }}>
          {productos.map(producto => (
            <li key={producto.id}>
              <Link to={`/productos/${producto.id}`} className={'item-lista' + (producto.activo ? '' : ' inactivo')}>
                <div className="item-lista-fila">
                  <div className="item-lista-datos">
                    <span className="item-lista-titulo">{producto.nombre}</span>
                    <span className="texto-secundario">
                      {producto.categoria || 'Sin categoría'}
                      {producto.precio_venta && ` · ${formatearPesos(producto.precio_venta)}`}
                    </span>
                  </div>
                  {!producto.activo && <span className="insignia-inactivo">Inactivo</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link to="/productos/nuevo" className="boton-flotante">
        <IconoMas width={16} height={16} />
        Nuevo producto
      </Link>
    </div>
  );
}
