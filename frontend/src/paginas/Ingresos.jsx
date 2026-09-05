// ============================================================
// Pantalla Ingresos: dos pestañas.
// - Recientes: lista de los últimos ingresos + acceso para registrar.
// - Por mes (IngresosPorMes.jsx): total del mes agrupado por medio.
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api';
import { formatearFecha } from '../utils';
import { useConfiguracion } from '../contexto/ConfiguracionContext';
import { IconoMas } from '../componentes/Iconos';
import IngresosPorMes from './IngresosPorMes';

export default function Ingresos() {
  const { formatearMonto } = useConfiguracion();
  const [pestana, setPestana] = useState('recientes');
  const [ingresos, setIngresos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    apiFetch('/api/ingresos').then(respuesta => {
      if (respuesta.ok) setIngresos(respuesta.ingresos);
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

      {pestana === 'por-mes' && <IngresosPorMes />}

      {pestana === 'recientes' && (
        <div style={{ marginTop: 16 }}>
          {cargando && <p className="texto-suave">Cargando...</p>}

          {!cargando && ingresos.length === 0 && (
            <p className="texto-suave">Todavía no hay ingresos registrados.</p>
          )}

          {!cargando && ingresos.length > 0 && (
            <ul className="lista-historial">
              {ingresos.map(ingreso => (
                <li key={ingreso.id} className="fila-historial">
                  <div className="fila-historial-datos">
                    <span className="proveedor-nombre" style={{ fontSize: 14 }}>{ingreso.medio}</span>
                    <span className="texto-secundario">{formatearFecha(ingreso.fecha)}</span>
                  </div>
                  <span style={{ fontWeight: 800 }}>{formatearMonto(ingreso.monto)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Link to="/ingresos/nuevo" className="boton-flotante">
        <IconoMas width={16} height={16} />
        Nuevo ingreso
      </Link>
    </div>
  );
}
