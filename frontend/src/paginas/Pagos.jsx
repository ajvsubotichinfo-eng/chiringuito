// ============================================================
// Pantalla Pagos: lista de los pagos más recientes + acceso para
// registrar uno nuevo. El detalle por mes/proveedor con totales y
// filtros es la Fase 4.5 (pantalla aparte, "Pagos por mes").
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api';
import { formatearPesos, formatearFecha } from '../utils';
import { IconoMas } from '../componentes/Iconos';

export default function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    apiFetch('/api/pagos').then(respuesta => {
      if (respuesta.ok) setPagos(respuesta.pagos);
      setCargando(false);
    });
  }, []);

  return (
    <div className="contenedor-angosto">
      {cargando && <p className="texto-suave">Cargando...</p>}

      {!cargando && pagos.length === 0 && (
        <p className="texto-suave">Todavía no hay pagos registrados.</p>
      )}

      {!cargando && pagos.length > 0 && (
        <ul className="lista-historial">
          {pagos.map(pago => (
            <li key={pago.id} className="fila-historial">
              <div className="fila-historial-datos">
                <span className="proveedor-nombre" style={{ fontSize: 14 }}>{pago.proveedor_nombre}</span>
                <span className="texto-secundario">
                  {formatearFecha(pago.fecha)} · {pago.medio_pago}
                  {pago.comprobante_url && (
                    <> · <a href={pago.comprobante_url} target="_blank" rel="noreferrer">ver comprobante</a></>
                  )}
                </span>
              </div>
              <span style={{ fontWeight: 800 }}>{formatearPesos(pago.monto)}</span>
            </li>
          ))}
        </ul>
      )}

      <Link to="/pagos/nuevo" className="boton-flotante">
        <IconoMas width={16} height={16} />
        Registrar pago
      </Link>
    </div>
  );
}
