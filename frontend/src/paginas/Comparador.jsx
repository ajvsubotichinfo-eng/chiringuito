// ============================================================
// Pantalla Comparador: buscás un producto y ves qué proveedor lo
// vende más barato, con el precio unitario real (aunque alguno
// venda por bulto), del más barato al más caro.
// ============================================================

import { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { formatearPesos } from '../utils';

const MEDALLAS = ['🥇', '🥈', '🥉'];

export default function Comparador() {
  const [busqueda, setBusqueda] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [productoElegido, setProductoElegido] = useState(null);
  const [precios, setPrecios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Busca productos a medida que se escribe (con una pequeña pausa
  // para no mandar un pedido por cada letra tipeada).
  useEffect(() => {
    if (!busqueda.trim() || productoElegido) {
      setSugerencias([]);
      return;
    }

    const espera = setTimeout(async () => {
      const respuesta = await apiFetch(`/api/productos?q=${encodeURIComponent(busqueda)}`);
      if (respuesta.ok) {
        setSugerencias(respuesta.productos);
      }
    }, 300);

    return () => clearTimeout(espera);
  }, [busqueda, productoElegido]);

  function cambiarBusqueda(texto) {
    setBusqueda(texto);
    setProductoElegido(null);
    setPrecios([]);
    setError('');
  }

  async function elegirProducto(producto) {
    setProductoElegido(producto);
    setBusqueda(producto.nombre);
    setSugerencias([]);
    setCargando(true);
    setError('');

    const respuesta = await apiFetch(`/api/precios/comparar/${producto.id}`);

    setCargando(false);
    if (respuesta.ok) {
      setPrecios(respuesta.precios);
    } else {
      setError(respuesta.mensaje || 'No se pudo cargar el comparador');
    }
  }

  return (
    <div className="pantalla-comparador">
      <h2>🔍 Comparador</h2>

      <input
        type="text"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={e => cambiarBusqueda(e.target.value)}
      />

      {sugerencias.length > 0 && (
        <ul className="lista-sugerencias">
          {sugerencias.map(producto => (
            <li key={producto.id}>
              <button type="button" onClick={() => elegirProducto(producto)}>
                {producto.nombre}
              </button>
            </li>
          ))}
        </ul>
      )}

      {cargando && <p className="texto-suave">Buscando precios...</p>}
      {error && <p className="mensaje-error">{error}</p>}

      {productoElegido && !cargando && !error && precios.length === 0 && (
        <p className="texto-suave">Ningún proveedor tiene cargado un precio para este producto todavía.</p>
      )}

      {precios.length > 0 && (
        <ul className="lista-precios">
          {precios.map((precio, indice) => (
            <li key={precio.id} className="fila-precio">
              <span className="medalla">{MEDALLAS[indice] ?? ''}</span>
              <div className="detalle-precio">
                <div className="proveedor-nombre">{precio.proveedor_nombre}</div>
                <div className="texto-suave">
                  {formatearPesos(precio.precio_unitario)} /u
                  {precio.unidad === 'bulto' && ` (bulto x${precio.cantidad_por_bulto})`}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
