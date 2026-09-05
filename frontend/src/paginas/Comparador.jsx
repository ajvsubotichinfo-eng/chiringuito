// ============================================================
// Pantalla Comparador: buscás un producto y ves qué proveedor lo
// vende más barato, con el precio unitario real (aunque alguno
// venda por bulto), del más barato al más caro. El más barato va
// destacado, y cada uno lleva una barra y un "+X%" que muestran
// cuánto más caro es respecto al mejor precio.
// ============================================================

import { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { formatearPesos } from '../utils';
import { IconoBuscar, IconoCerrar } from '../componentes/Iconos';

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

  // Para la barra y el "+X%": todo se compara contra el más barato
  // (el primero, porque el backend ya los manda ordenados).
  const masBarato = precios[0]?.precio_unitario ?? 0;
  const masCaro = precios[precios.length - 1]?.precio_unitario ?? 0;

  return (
    <div className="pantalla-comparador">
      <div className="buscador">
        <IconoBuscar className="buscador-icono" width={20} height={20} />
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={e => cambiarBusqueda(e.target.value)}
        />
        {busqueda && (
          <button type="button" className="buscador-limpiar" onClick={() => cambiarBusqueda('')} aria-label="Limpiar búsqueda">
            <IconoCerrar width={18} height={18} />
          </button>
        )}
      </div>

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

      {!productoElegido && !busqueda && (
        <p className="texto-suave texto-centrado">Escribí el nombre de un producto para comparar precios entre proveedores.</p>
      )}

      {cargando && <p className="texto-suave">Buscando precios...</p>}
      {error && <p className="mensaje-error">{error}</p>}

      {productoElegido && !cargando && !error && precios.length === 0 && (
        <p className="texto-suave">Ningún proveedor tiene cargado un precio para este producto todavía.</p>
      )}

      {precios.length > 0 && (
        <>
          <div className="fila-etiquetas">
            <span className="etiqueta">Proveedores</span>
            <span className="texto-suave">del más barato al más caro</span>
          </div>

          <ul className="lista-precios">
            {precios.map((precio, indice) => {
              const esElMasBarato = indice === 0;
              const diferencia = masBarato ? Math.round((precio.precio_unitario / masBarato - 1) * 100) : 0;
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
                    <span className="insignia">
                      {esElMasBarato ? 'Mejor precio' : `+${diferencia}%`}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
