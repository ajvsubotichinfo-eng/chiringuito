// ============================================================
// Formulario para registrar un pago. Permite cargar MÁS DE UN medio
// de pago de una sola vez (ej: $300 en efectivo + $700 transferidos,
// para la misma factura) — cada línea se guarda como un pago aparte
// en la base, todas con el mismo proveedor, fecha, comprobante y foto.
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api';
import { formatearPesos } from '../utils';
import { IconoVolver, IconoMas, IconoCerrar } from '../componentes/Iconos';

const MEDIOS = ['Efectivo', 'Transferencia', 'Cheque', 'Mercado Pago'];

function lineaVacia() {
  return { medioPago: 'Efectivo', monto: '' };
}

export default function PagoFormulario() {
  const navegar = useNavigate();

  const [proveedores, setProveedores] = useState([]);
  const [proveedorId, setProveedorId] = useState('');
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [nroComprobante, setNroComprobante] = useState('');
  const [notas, setNotas] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [lineas, setLineas] = useState([lineaVacia()]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/api/proveedores').then(respuesta => {
      if (respuesta.ok) {
        const activos = respuesta.proveedores.filter(p => p.activo);
        setProveedores(activos);
        setProveedorId(activos[0]?.id ?? '');
      }
    });
  }, []);

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

    if (!proveedorId) {
      setError('Elegí un proveedor');
      return;
    }
    if (lineas.some(l => !l.monto || Number(l.monto) <= 0)) {
      setError('Cada línea necesita un monto mayor a 0');
      return;
    }

    setGuardando(true);

    // Cada línea (medio de pago + monto) se manda como un pago aparte,
    // todos con los mismos datos generales (proveedor, fecha, comprobante).
    for (const linea of lineas) {
      const datos = new FormData();
      datos.append('fecha', fecha);
      datos.append('proveedor_id', proveedorId);
      datos.append('monto', linea.monto);
      datos.append('medio_pago', linea.medioPago);
      if (nroComprobante) datos.append('nro_comprobante', nroComprobante);
      if (notas) datos.append('notas', notas);
      if (archivo) datos.append('comprobante', archivo);

      const respuesta = await apiFetch('/api/pagos', { method: 'POST', body: datos });

      if (!respuesta.ok) {
        setGuardando(false);
        setError(respuesta.mensaje || 'No se pudo registrar el pago');
        return;
      }
    }

    setGuardando(false);
    navegar('/pagos');
  }

  return (
    <div className="contenedor-angosto">
      <Link to="/pagos" className="detalle-volver">
        <IconoVolver width={16} height={16} />
        Volver
      </Link>

      <h2 className="detalle-titulo">Registrar pago</h2>

      <form className="formulario" onSubmit={manejarEnvio}>
        <label htmlFor="proveedor">Proveedor</label>
        <select id="proveedor" value={proveedorId} onChange={e => setProveedorId(e.target.value)} required>
          {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>

        <div className="fila-campos">
          <div>
            <label htmlFor="fecha">Fecha</label>
            <input id="fecha" type="date" value={fecha} onChange={e => setFecha(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="nroComprobante">N° comprobante</label>
            <input id="nroComprobante" value={nroComprobante} onChange={e => setNroComprobante(e.target.value)} />
          </div>
        </div>

        <label>Medios de pago</label>
        <div className="lineas-pago">
          {lineas.map((linea, indice) => (
            <div key={indice} className="fila-linea-pago">
              <select
                value={linea.medioPago}
                onChange={e => actualizarLinea(indice, 'medioPago', e.target.value)}
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
                <button type="button" className="boton-quitar-linea" onClick={() => quitarLinea(indice)} aria-label="Quitar este medio de pago">
                  <IconoCerrar width={14} height={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="button" className="boton-agregar-linea" onClick={agregarLinea}>
          <IconoMas width={14} height={14} />
          Agregar otro medio de pago
        </button>

        {lineas.length > 1 && (
          <p className="total-lineas">Total: {formatearPesos(total)}</p>
        )}

        <label htmlFor="foto">Foto del comprobante (opcional)</label>
        <label className="selector-archivo" htmlFor="foto">
          {archivo ? archivo.name : 'Elegir foto'}
        </label>
        <input
          id="foto"
          type="file"
          accept="image/*,.pdf"
          style={{ display: 'none' }}
          onChange={e => setArchivo(e.target.files[0] ?? null)}
        />

        <label htmlFor="notas">Notas (opcional)</label>
        <input id="notas" value={notas} onChange={e => setNotas(e.target.value)} />

        {error && <p className="mensaje-error">{error}</p>}

        <div className="fila-botones">
          <Link to="/pagos" className="boton-secundario">Cancelar</Link>
          <button type="submit" className="boton-primario" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
