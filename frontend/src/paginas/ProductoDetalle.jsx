// ============================================================
// Detalle de un producto: sus datos, los proveedores que lo venden
// (con la misma tarjeta del Comparador) y el historial de precios
// con la variación en $ y %. Desde acá también se cargan/editan
// precios de proveedores para este producto.
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../api';
import { formatearPesos, formatearFecha } from '../utils';
import { IconoVolver, IconoEditar, IconoMas } from '../componentes/Iconos';
import FormularioPrecio from '../componentes/FormularioPrecio';

export default function ProductoDetalle() {
  const { id } = useParams();

  const [producto, setProducto] = useState(null);
  const [precios, setPrecios] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [formulario, setFormulario] = useState(null); // null | 'nuevo' | precio a editar

  const cargarTodo = useCallback(async () => {
    const [rProducto, rPrecios, rHistorial, rProveedores] = await Promise.all([
      apiFetch(`/api/productos/${id}`),
      apiFetch(`/api/precios/comparar/${id}`),
      apiFetch(`/api/precios/historial?producto_id=${id}`),
      apiFetch('/api/proveedores')
    ]);

    if (rProducto.ok) setProducto(rProducto.producto);
    if (rPrecios.ok) setPrecios(rPrecios.precios);
    if (rHistorial.ok) setHistorial(rHistorial.historial);
    if (rProveedores.ok) setProveedores(rProveedores.proveedores.filter(p => p.activo));

    setCargando(false);
  }, [id]);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  function cerrarFormulario() {
    setFormulario(null);
    cargarTodo();
  }

  if (cargando) {
    return <p className="texto-suave">Cargando...</p>;
  }

  if (!producto) {
    return <p className="texto-suave">No se encontró el producto.</p>;
  }

  const masCaro = precios[precios.length - 1]?.precio_unitario ?? 0;
  const proveedoresSinPrecio = proveedores.filter(
    prov => !precios.some(p => p.proveedor_id === prov.id)
  );

  return (
    <div className="contenedor-angosto">
      <Link to="/productos" className="detalle-volver">
        <IconoVolver width={16} height={16} />
        Volver
      </Link>

      <div className="detalle-encabezado">
        <div>
          <h2 className="detalle-titulo">{producto.nombre}</h2>
          <p className="detalle-subtitulo">
            {producto.categoria || 'Sin categoría'}
            {producto.precio_venta && ` · Precio de venta ${formatearPesos(producto.precio_venta)}`}
          </p>
        </div>
        <Link to={`/productos/${id}/editar`} className="boton-circulo" aria-label="Editar producto">
          <IconoEditar width={18} height={18} />
        </Link>
      </div>

      <div className="detalle-seccion">
        <h3 className="etiqueta">Proveedores y precios</h3>

        {precios.length === 0 && (
          <p className="texto-suave">Todavía no hay ningún proveedor cargado para este producto.</p>
        )}

        {precios.length > 0 && (
          <ul className="lista-precios">
            {precios.map((precio, indice) => {
              const esElMasBarato = indice === 0;
              const diferencia = precios[0].precio_unitario
                ? Math.round((precio.precio_unitario / precios[0].precio_unitario - 1) * 100)
                : 0;
              const anchoBarra = masCaro ? Math.round((precio.precio_unitario / masCaro) * 100) : 100;

              return (
                <li key={precio.id} className={'tarjeta-precio' + (esElMasBarato ? ' destacada' : '')}>
                  <div className="tarjeta-precio-fila">
                    <span className="ranking">{indice + 1}</span>
                    <div className="tarjeta-precio-datos">
                      <span className="proveedor-nombre">{precio.proveedor_nombre}</span>
                      <span className="texto-secundario">
                        {precio.unidad === 'bulto'
                          ? `por bulto x${precio.cantidad_por_bulto} · ${formatearPesos(precio.precio_compra)}`
                          : 'por unidad'}
                      </span>
                    </div>
                    <div className="precio-grande">
                      <span>{formatearPesos(precio.precio_unitario)}</span>
                      <span className="texto-secundario">/u</span>
                    </div>
                  </div>

                  <div className="tarjeta-precio-fila">
                    <div className="barra">
                      <div className="barra-relleno" style={{ width: `${anchoBarra}%` }}></div>
                    </div>
                    <span className="insignia">{esElMasBarato ? 'Mejor precio' : `+${diferencia}%`}</span>
                    <button
                      type="button"
                      className="boton-circulo"
                      style={{ width: 34, height: 34 }}
                      onClick={() => setFormulario(precio)}
                      aria-label={`Editar precio de ${precio.proveedor_nombre}`}
                    >
                      <IconoEditar width={15} height={15} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {formulario && formulario !== 'nuevo' && (
          <FormularioPrecio
            productoId={id}
            proveedores={proveedores}
            precioExistente={formulario}
            onGuardado={cerrarFormulario}
            onCancelar={() => setFormulario(null)}
          />
        )}

        {formulario === 'nuevo' && (
          <FormularioPrecio
            productoId={id}
            proveedores={proveedoresSinPrecio}
            precioExistente={null}
            onGuardado={cerrarFormulario}
            onCancelar={() => setFormulario(null)}
          />
        )}

        {!formulario && proveedoresSinPrecio.length > 0 && (
          <button type="button" className="boton-secundario" style={{ width: '100%', marginTop: 14 }} onClick={() => setFormulario('nuevo')}>
            <IconoMas width={16} height={16} style={{ marginRight: 8 }} />
            Agregar proveedor
          </button>
        )}
      </div>

      <div className="detalle-seccion">
        <h3 className="etiqueta">Historial de precios</h3>

        {historial.length === 0 && (
          <p className="texto-suave">Todavía no hubo cambios de precio para este producto.</p>
        )}

        {historial.length > 0 && (
          <ul className="lista-historial">
            {historial.map(cambio => (
              <li key={cambio.id} className="fila-historial">
                <div className="fila-historial-datos">
                  <span className="proveedor-nombre" style={{ fontSize: 13 }}>{cambio.proveedor_nombre}</span>
                  <span className="texto-secundario">
                    {formatearFecha(cambio.fecha_cambio)} · {formatearPesos(cambio.precio_anterior)} → {formatearPesos(cambio.precio_nuevo)}
                  </span>
                </div>
                <span className={'variacion ' + (cambio.diferencia >= 0 ? 'sube' : 'baja')}>
                  {cambio.diferencia >= 0 ? '+' : ''}{cambio.variacion_pct}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
