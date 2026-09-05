// ============================================================
// Formulario chico para cargar o editar el precio de un proveedor
// para un producto puntual. Se usa dentro del detalle de Productos.
//
// - Si viene "precioExistente", edita ese precio (el proveedor no se
//   puede cambiar: si vendió otra cosa, se carga como precio nuevo).
// - Si no, crea un precio nuevo: hay que elegir el proveedor de una
//   lista (ya filtrada por el que llama, para no repetir uno que ya
//   tiene precio cargado).
// ============================================================

import { useState } from 'react';
import { apiFetch } from '../api';

export default function FormularioPrecio({ productoId, proveedores, precioExistente, onGuardado, onCancelar }) {
  const [proveedorId, setProveedorId] = useState(precioExistente?.proveedor_id ?? proveedores[0]?.id ?? '');
  const [precioCompra, setPrecioCompra] = useState(precioExistente?.precio_compra ?? '');
  const [unidad, setUnidad] = useState(precioExistente?.unidad ?? 'unidad');
  const [cantidadPorBulto, setCantidadPorBulto] = useState(precioExistente?.cantidad_por_bulto ?? '');
  const [notas, setNotas] = useState(precioExistente?.notas ?? '');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setGuardando(true);

    const cuerpo = {
      precio_compra: precioCompra,
      unidad,
      cantidad_por_bulto: unidad === 'bulto' ? cantidadPorBulto : null,
      notas: notas || null
    };

    const respuesta = precioExistente
      ? await apiFetch(`/api/precios/${precioExistente.id}`, { method: 'PUT', body: cuerpo })
      : await apiFetch('/api/precios', { method: 'POST', body: { ...cuerpo, producto_id: productoId, proveedor_id: proveedorId } });

    setGuardando(false);

    if (respuesta.ok) {
      onGuardado();
    } else {
      setError(respuesta.mensaje || 'No se pudo guardar el precio');
    }
  }

  return (
    <form className="formulario tarjeta-formulario" onSubmit={manejarEnvio}>
      {precioExistente ? (
        <p className="texto-secundario" style={{ fontSize: 13 }}>{precioExistente.proveedor_nombre}</p>
      ) : (
        <>
          <label htmlFor="proveedor">Proveedor</label>
          <select id="proveedor" value={proveedorId} onChange={e => setProveedorId(e.target.value)} required>
            {proveedores.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </>
      )}

      <div className="fila-campos">
        <div>
          <label htmlFor="precioCompra">Precio</label>
          <input
            id="precioCompra"
            type="number"
            step="0.01"
            min="0"
            value={precioCompra}
            onChange={e => setPrecioCompra(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="unidad">Vende por</label>
          <select id="unidad" value={unidad} onChange={e => setUnidad(e.target.value)}>
            <option value="unidad">Unidad</option>
            <option value="bulto">Bulto</option>
          </select>
        </div>
      </div>

      {unidad === 'bulto' && (
        <>
          <label htmlFor="cantidadPorBulto">Unidades por bulto</label>
          <input
            id="cantidadPorBulto"
            type="number"
            min="1"
            value={cantidadPorBulto}
            onChange={e => setCantidadPorBulto(e.target.value)}
            required
          />
        </>
      )}

      <label htmlFor="notas">Notas (opcional)</label>
      <input id="notas" value={notas} onChange={e => setNotas(e.target.value)} />

      {error && <p className="mensaje-error">{error}</p>}

      <div className="fila-botones">
        <button type="button" className="boton-secundario" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="boton-primario" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
