// ============================================================
// Pestaña "Por mes" de la pantalla Ingresos: total ingresado en el
// mes elegido, agrupado por medio de cobro (efectivo, transferencia,
// tarjeta/POS, etc.), con filtro de mes.
// ============================================================

import { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { useConfiguracion } from '../contexto/ConfiguracionContext';
import { mesActual, nombreMes } from '../utils';

export default function IngresosPorMes() {
  const { formatearMonto } = useConfiguracion();
  const [mes, setMes] = useState(mesActual());
  const [reporte, setReporte] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    apiFetch(`/api/reportes/ingresos-por-mes?mes=${mes}`).then(respuesta => {
      if (respuesta.ok) setReporte(respuesta.reporte);
      setCargando(false);
    });
  }, [mes]);

  const total = reporte.reduce((suma, fila) => suma + fila.total, 0);
  const cantidad = reporte.reduce((suma, fila) => suma + fila.cantidad, 0);

  return (
    <div>
      <div className="tarjeta-total">
        <span className="etiqueta">Total {nombreMes(mes)}</span>
        <span className="monto-total">{formatearMonto(total)}</span>
        <span className="subtexto">
          {cantidad} {cantidad === 1 ? 'ingreso registrado' : 'ingresos registrados'}
        </span>
      </div>

      <div style={{ marginTop: 16 }}>
        <label htmlFor="filtroMes" className="etiqueta" style={{ display: 'block', marginBottom: 6 }}>Mes</label>
        <input id="filtroMes" type="month" value={mes} onChange={e => setMes(e.target.value)} />
      </div>

      {cargando && <p className="texto-suave" style={{ marginTop: 16 }}>Cargando...</p>}

      {!cargando && reporte.length === 0 && (
        <p className="texto-suave" style={{ marginTop: 16 }}>No hubo ingresos en ese mes.</p>
      )}

      {!cargando && reporte.length > 0 && (
        <ul className="lista-historial" style={{ marginTop: 16 }}>
          {reporte.map(fila => (
            <li key={fila.medio} className="fila-historial">
              <div className="fila-historial-datos">
                <span className="proveedor-nombre" style={{ fontSize: 14 }}>{fila.medio}</span>
                <span className="texto-secundario">
                  {fila.cantidad} {fila.cantidad === 1 ? 'registro' : 'registros'}
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
