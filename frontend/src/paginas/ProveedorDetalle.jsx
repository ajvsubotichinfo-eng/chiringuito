// ============================================================
// Detalle de un proveedor: sus datos, los productos que le compramos
// (con su precio) y los pagos que se le hicieron.
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../api';
import { formatearFecha } from '../utils';
import { useConfiguracion } from '../contexto/ConfiguracionContext';
import { IconoVolver, IconoEditar } from '../componentes/Iconos';

export default function ProveedorDetalle() {
  const { formatearMonto } = useConfiguracion();
  const { id } = useParams();

  const [proveedor, setProveedor] = useState(null);
  const [productos, setProductos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch(`/api/proveedores/${id}`),
      apiFetch(`/api/precios/proveedor/${id}`),
      apiFetch(`/api/pagos?proveedor_id=${id}`)
    ]).then(([rProveedor, rProductos, rPagos]) => {
      if (rProveedor.ok) setProveedor(rProveedor.proveedor);
      if (rProductos.ok) setProductos(rProductos.precios);
      if (rPagos.ok) setPagos(rPagos.pagos);
      setCargando(false);
    });
  }, [id]);

  if (cargando) {
    return <p className="texto-suave">Cargando...</p>;
  }

  if (!proveedor) {
    return <p className="texto-suave">No se encontró el proveedor.</p>;
  }

  return (
    <div className="contenedor-angosto">
      <Link to="/proveedores" className="detalle-volver">
        <IconoVolver width={16} height={16} />
        Volver
      </Link>

      <div className="detalle-encabezado">
        <div>
          <h2 className="detalle-titulo">{proveedor.nombre}</h2>
          <p className="detalle-subtitulo">
            {proveedor.contacto || 'Sin contacto'}
            {proveedor.telefono && ` · ${proveedor.telefono}`}
            {proveedor.dia_visita && ` · Visita: ${proveedor.dia_visita}`}
          </p>
        </div>
        <Link to={`/proveedores/${id}/editar`} className="boton-circulo" aria-label="Editar proveedor">
          <IconoEditar width={18} height={18} />
        </Link>
      </div>

      <div className="detalle-seccion">
        <h3 className="etiqueta">Productos que vende</h3>

        {productos.length === 0 && (
          <p className="texto-suave">Todavía no tiene productos cargados.</p>
        )}

        {productos.length > 0 && (
          <ul className="lista-items">
            {productos.map(p => (
              <li key={p.id} className="item-lista">
                <div className="item-lista-fila">
                  <div className="item-lista-datos">
                    <span className="item-lista-titulo">{p.producto_nombre}</span>
                    <span className="texto-secundario">
                      {p.unidad === 'bulto' ? `por bulto x${p.cantidad_por_bulto}` : 'por unidad'}
                    </span>
                  </div>
                  <div className="precio-grande" style={{ fontSize: 17 }}>
                    <span>{formatearMonto(p.precio_unitario)}</span>
                    <span className="texto-secundario">/u</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="detalle-seccion">
        <h3 className="etiqueta">Pagos recientes</h3>

        {pagos.length === 0 && (
          <p className="texto-suave">Todavía no se le registraron pagos.</p>
        )}

        {pagos.length > 0 && (
          <ul className="lista-historial">
            {pagos.slice(0, 8).map(pago => (
              <li key={pago.id} className="fila-historial">
                <div className="fila-historial-datos">
                  <span className="proveedor-nombre" style={{ fontSize: 13 }}>{formatearFecha(pago.fecha)}</span>
                  <span className="texto-secundario">{pago.medio_pago}</span>
                </div>
                <span style={{ fontWeight: 800 }}>{formatearMonto(pago.monto)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
