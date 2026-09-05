// ============================================================
// Pantalla Pagos: dos pestañas.
// - Recientes: lista de los últimos pagos + acceso para registrar uno.
// - Por mes (PagosPorMes.jsx): total pagado por mes/proveedor, con
//   filtros — es la Fase 4.5 del plan.
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api';
import { formatearFecha } from '../utils';
import { useConfiguracion } from '../contexto/ConfiguracionContext';
import { IconoMas } from '../componentes/Iconos';
import PagosPorMes from './PagosPorMes';

export default function Pagos() {
  const { formatearMonto } = useConfiguracion();
  const [pestana, setPestana] = useState('recientes');
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
      <div className="pestanas">
        <button type="button" className={'pestana' + (pestana === 'recientes' ? ' activa' : '')} onClick={() => setPestana('recientes')}>
          Recientes
        </button>
        <button type="button" className={'pestana' + (pestana === 'por-mes' ? ' activa' : '')} onClick={() => setPestana('por-mes')}>
          Por mes
        </button>
      </div>

      {pestana === 'por-mes' && <PagosPorMes />}

      {pestana === 'recientes' && (
        <div style={{ marginTop: 16 }}>
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
                  <span style={{ fontWeight: 800 }}>{formatearMonto(pago.monto)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Link to="/pagos/nuevo" className="boton-flotante">
        <IconoMas width={16} height={16} />
        Registrar pago
      </Link>
    </div>
  );
}
