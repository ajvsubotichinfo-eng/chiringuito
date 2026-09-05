// ============================================================
// Formulario para registrar un ingreso (cierre de caja). Igual que
// "Registrar pago", permite cargar varios medios de cobro de una
// sola vez (ej: $50.000 en efectivo + $30.000 por transferencia) —
// cada línea se guarda como un ingreso aparte, todas con la misma
// fecha. No tiene proveedor ni foto: es lo recaudado en el mostrador,
// no un pago a un tercero.
// ============================================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api';
import { useConfiguracion } from '../contexto/ConfiguracionContext';
import { IconoVolver, IconoMas, IconoCerrar } from '../componentes/Iconos';

const MEDIOS = ['Efectivo', 'Transferencia', 'Tarjeta/POS', 'Mercado Pago', 'Otro'];

function lineaVacia() {
  return { medio: 'Efectivo', monto: '' };
}

export default function IngresoFormulario() {
  const navegar = useNavigate();
  const { formatearMonto } = useConfiguracion();

  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [notas, setNotas] = useState('');
  const [lineas, setLineas] = useState([lineaVacia()]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  function actualizarLinea(indice, campo, valor) {
    setLineas(lineas.map((linea, i) => (i === indice ? { ...linea, [campo]: valor } : linea)));
  }

  function agregarLinea() {
    setLineas([...lineas, lineaVacia()]);
  }

  function quitarLinea(indice) {
    setLineas(lineas.filter((_, i) => i !== indice));
  }

  const total = lineas.reduce((suma, linea) => suma + (Number(linea.monto) || 0), 0);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');

    if (lineas.some(l => !l.monto || Number(l.monto) <= 0)) {
      setError('Cada línea necesita un monto mayor a 0');
      return;
    }

    setGuardando(true);

    // Cada línea (medio + monto) se manda como un ingreso aparte,
    // todas con la misma fecha y notas.
    for (const linea of lineas) {
      const respuesta = await apiFetch('/api/ingresos', {
        method: 'POST',
        body: { fecha, monto: linea.monto, medio: linea.medio, notas: notas || null }
      });

      if (!respuesta.ok) {
        setGuardando(false);
        setError(respuesta.mensaje || 'No se pudo registrar el ingreso');
        return;
      }
    }

    setGuardando(false);
    navegar('/ingresos');
  }

  return (
    <div className="contenedor-angosto">
      <Link to="/ingresos" className="detalle-volver">
        <IconoVolver width={16} height={16} />
        Volver
      </Link>

      <h2 className="detalle-titulo">Registrar ingreso</h2>

      <form className="formulario" onSubmit={manejarEnvio}>
        <label htmlFor="fecha">Fecha</label>
        <input id="fecha" type="date" value={fecha} onChange={e => setFecha(e.target.value)} required />

        <label>Medios de cobro</label>
        <div className="lineas-pago">
          {lineas.map((linea, indice) => (
            <div key={indice} className="fila-linea-pago">
              <select
                value={linea.medio}
                onChange={e => actualizarLinea(indice, 'medio', e.target.value)}
              >
                {MEDIOS.map(medio => <option key={medio} value={medio}>{medio}</option>)}
              </select>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Monto"
                value={linea.monto}
                onChange={e => actualizarLinea(indice, 'monto', e.target.value)}
                required
              />
              {lineas.length > 1 && (
                <button type="button" className="boton-quitar-linea" onClick={() => quitarLinea(indice)} aria-label="Quitar este medio de cobro">
                  <IconoCerrar width={14} height={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="button" className="boton-agregar-linea" onClick={agregarLinea}>
          <IconoMas width={14} height={14} />
          Agregar otro medio de cobro
        </button>

        {lineas.length > 1 && (
          <p className="total-lineas">Total: {formatearMonto(total)}</p>
        )}

        <label htmlFor="notas">Notas (opcional)</label>
        <input id="notas" value={notas} onChange={e => setNotas(e.target.value)} />

        {error && <p className="mensaje-error">{error}</p>}

        <div className="fila-botones">
          <Link to="/ingresos" className="boton-secundario">Cancelar</Link>
          <button type="submit" className="boton-primario" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
