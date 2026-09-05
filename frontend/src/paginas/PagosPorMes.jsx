// ============================================================
// Pestaña "Por mes" de la pantalla Pagos: total pagado en el mes
// elegido (agrupado por proveedor), con filtros de mes y proveedor.
// ============================================================

import { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { useConfiguracion } from '../contexto/ConfiguracionContext';
import { mesActual, nombreMes } from '../utils';

export default function PagosPorMes() {
  const { formatearMonto } = useConfiguracion();
  const [mes, setMes] = useState(mesActual());
  const [proveedorId, setProveedorId] = useState('');
  const [proveedores, setProveedores] = useState([]);
  const [reporte, setReporte] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    apiFetch('/api/proveedores').then(respuesta => {
      if (respuesta.ok) setProveedores(respuesta.proveedores);
    });
  }, []);

  useEffect(() => {
    setCargando(true);
    const parametros = new URLSearchParams({ mes });
    if (proveedorId) parametros.set('proveedor_id', proveedorId);

    apiFetch(`/api/reportes/pagos-por-mes?${parametros}`).then(respuesta => {
      if (respuesta.ok) setReporte(respuesta.reporte);
      setCargando(false);
    });
  }, [mes, proveedorId]);

  const total = reporte.reduce((suma, fila) => suma + fila.total, 0);
  const cantidadPagos = reporte.reduce((suma, fila) => suma + fila.cantidad_pagos, 0);

  return (
    <div>
      <div className="tarjeta-total">
        <span className="etiqueta">Total {nombreMes(mes)}</span>
        <span className="monto-total">{formatearMonto(total)}</span>
        <span className="subtexto">
          {cantidadPagos} {cantidadPagos === 1 ? 'pago' : 'pagos'} · {reporte.length} {reporte.length === 1 ? 'proveedor' : 'proveedores'}
        </span>
      </div>

      <div className="fila-campos" style={{ marginTop: 16 }}>
        <div>
          <label htmlFor="filtroMes" className="etiqueta" style={{ display: 'block', marginBottom: 6 }}>Mes</label>
          <input id="filtroMes" type="month" value={mes} onChange={e => setMes(e.target.value)} />
        </div>
        <div>
          <label htmlFor="filtroProveedor" className="etiqueta" style={{ display: 'block', marginBottom: 6 }}>Proveedor</label>
          <select id="filtroProveedor" value={proveedorId} onChange={e => setProveedorId(e.target.value)}>
            <option value="">Todos</option>
            {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
      </div>

      {cargando && <p className="texto-suave" style={{ marginTop: 16 }}>Cargando...</p>}

      {!cargando && reporte.length === 0 && (
        <p className="texto-suave" style={{ marginTop: 16 }}>No hubo pagos en ese mes.</p>
      )}

      {!cargando && reporte.length > 0 && (
        <ul className="lista-historial" style={{ marginTop: 16 }}>
          {reporte.map(fila => (
            <li key={fila.proveedor_id} className="fila-historial">
              <div className="fila-historial-datos">
                <span className="proveedor-nombre" style={{ fontSize: 14 }}>{fila.proveedor_nombre}</span>
                <span className="texto-secundario">
                  {fila.cantidad_pagos} {fila.cantidad_pagos === 1 ? 'pago' : 'pagos'}
                </span>
              </div>
              <span style={{ fontWeight: 800 }}>{formatearMonto(fila.total)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
