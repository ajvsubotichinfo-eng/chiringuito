// ============================================================
// Formulario para crear o editar un producto.
//
// - /productos/:id/editar → edita los datos básicos (no toca precios,
//   eso se maneja en el detalle del producto).
// - /productos/nuevo → primero muestra una BÚSQUEDA entre los
//   productos que ya existen (para no crear el mismo dos veces por
//   error); solo si no está en la lista se pasa al formulario de
//   creación, que pide el producto Y su primer proveedor con precio
//   juntos — no se puede crear un producto sin proveedor ni precio.
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api';
import { IconoVolver, IconoTilde, IconoBuscar } from '../componentes/Iconos';

export default function ProductoFormulario() {
  const { id } = useParams();
  const navegar = useNavigate();
  const editando = Boolean(id);

  // Solo se usa al crear: primero se busca entre los productos
  // existentes, y recién si no aparece se pasa a "formulario".
  const [paso, setPaso] = useState(editando ? 'formulario' : 'buscar');
  const [busqueda, setBusqueda] = useState('');
  const [productosExistentes, setProductosExistentes] = useState([]);

  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [activo, setActivo] = useState(true);

  // Proveedor + precio: obligatorios al crear un producto nuevo.
  const [proveedores, setProveedores] = useState([]);
  const [proveedorId, setProveedorId] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');
  const [unidad, setUnidad] = useState('unidad');
  const [cantidadPorBulto, setCantidadPorBulto] = useState('');

  const [cargando, setCargando] = useState(editando);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editando) return;

    apiFetch(`/api/productos/${id}`).then(respuesta => {
      if (respuesta.ok) {
        const p = respuesta.producto;
        setNombre(p.nombre);
        setCategoria(p.categoria || '');
        setCodigoBarras(p.codigo_barras || '');
        setPrecioVenta(p.precio_venta ?? '');
        setActivo(Boolean(p.activo));
      }
      setCargando(false);
    });
  }, [id, editando]);

  // Búsqueda entre productos existentes (paso 1 al crear).
  useEffect(() => {
    if (paso !== 'buscar') return;

    const espera = setTimeout(async () => {
      const respuesta = await apiFetch(`/api/productos?q=${encodeURIComponent(busqueda)}`);
      if (respuesta.ok) setProductosExistentes(respuesta.productos);
    }, 250);

    return () => clearTimeout(espera);
  }, [busqueda, paso]);

  // Proveedores para el selector (paso 2 al crear).
  useEffect(() => {
    if (paso !== 'formulario' || editando) return;

    apiFetch('/api/proveedores').then(respuesta => {
      if (respuesta.ok) {
        const activos = respuesta.proveedores.filter(p => p.activo);
        setProveedores(activos);
        setProveedorId(activos[0]?.id ?? '');
      }
    });
  }, [paso, editando]);

  function irACrearNuevo() {
    setNombre(busqueda);
    setPaso('formulario');
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setGuardando(true);

    const cuerpo = editando
      ? { nombre, categoria: categoria || null, codigo_barras: codigoBarras || null, precio_venta: precioVenta || null, activo }
      : {
          nombre,
          categoria: categoria || null,
          codigo_barras: codigoBarras || null,
          precio_venta: precioVenta || null,
          proveedor_id: proveedorId,
          precio_compra: precioCompra,
          unidad,
          cantidad_por_bulto: unidad === 'bulto' ? cantidadPorBulto : null
        };

    const respuesta = editando
      ? await apiFetch(`/api/productos/${id}`, { method: 'PUT', body: cuerpo })
      : await apiFetch('/api/productos', { method: 'POST', body: cuerpo });

    setGuardando(false);

    if (respuesta.ok) {
      navegar(`/productos/${editando ? id : respuesta.id}`);
    } else {
      setError(respuesta.mensaje || 'No se pudo guardar el producto');
    }
  }

  if (cargando) {
    return <p className="texto-suave">Cargando...</p>;
  }

  // --- Paso 1 (solo al crear): buscar entre los productos existentes ---
  if (paso === 'buscar') {
    return (
      <div className="contenedor-angosto">
        <Link to="/productos" className="detalle-volver">
          <IconoVolver width={16} height={16} />
          Volver
        </Link>

        <h2 className="detalle-titulo">Nuevo producto</h2>
        <p className="detalle-subtitulo">
          Buscá primero si ya existe, para no cargarlo dos veces.
        </p>

        <div className="buscador" style={{ marginTop: 16 }}>
          <IconoBuscar className="buscador-icono" width={20} height={20} />
          <input
            type="text"
            placeholder="Nombre del producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            autoFocus
          />
        </div>

        {productosExistentes.length > 0 && (
          <ul className="lista-items" style={{ marginTop: 16 }}>
            {productosExistentes.map(producto => (
              <li key={producto.id}>
                <Link to={`/productos/${producto.id}`} className="item-lista">
                  <div className="item-lista-fila">
                    <div className="item-lista-datos">
                      <span className="item-lista-titulo">{producto.nombre}</span>
                      <span className="texto-secundario">{producto.categoria || 'Sin categoría'}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {productosExistentes.length === 0 && busqueda && (
          <p className="texto-suave" style={{ marginTop: 16 }}>No se encontró ningún producto con ese nombre.</p>
        )}

        <button type="button" className="boton-secundario" style={{ width: '100%', marginTop: 16 }} onClick={irACrearNuevo}>
          No está en la lista, crear producto nuevo
        </button>
      </div>
    );
  }

  // --- Paso 2: formulario (crear, con proveedor+precio obligatorios; o editar) ---
  return (
    <div className="contenedor-angosto">
      {editando ? (
        <Link to={`/productos/${id}`} className="detalle-volver">
          <IconoVolver width={16} height={16} />
          Volver
        </Link>
      ) : (
        <button type="button" className="detalle-volver" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => setPaso('buscar')}>
          <IconoVolver width={16} height={16} />
          Volver a la búsqueda
        </button>
      )}

      <h2 className="detalle-titulo">{editando ? 'Editar producto' : 'Nuevo producto'}</h2>

      <form className="formulario" onSubmit={manejarEnvio}>
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />

        <div className="fila-campos">
          <div>
            <label htmlFor="categoria">Categoría</label>
            <input id="categoria" value={categoria} onChange={e => setCategoria(e.target.value)} />
          </div>
          <div>
            <label htmlFor="codigoBarras">Código de barras</label>
            <input id="codigoBarras" value={codigoBarras} onChange={e => setCodigoBarras(e.target.value)} />
          </div>
        </div>

        <label htmlFor="precioVenta">Precio de venta</label>
        <input
          id="precioVenta"
          type="number"
          step="0.01"
          min="0"
          value={precioVenta}
          onChange={e => setPrecioVenta(e.target.value)}
        />

        {!editando && (
          <>
            <label htmlFor="proveedor">Proveedor</label>
            <select id="proveedor" value={proveedorId} onChange={e => setProveedorId(e.target.value)} required>
              {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>

            <div className="fila-campos">
              <div>
                <label htmlFor="precioCompra">Precio de compra</label>
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
          </>
        )}

        {editando && (
          <label className="fila-switch" style={{ marginTop: 22, color: 'var(--color-texto)' }}>
            <span className="switch-caja">
              <input type="checkbox" checked={activo} onChange={e => setActivo(e.target.checked)} />
              <IconoTilde className="switch-check" width={14} height={14} />
            </span>
            Producto activo
          </label>
        )}

        {error && <p className="mensaje-error">{error}</p>}

        <div className="fila-botones">
          <Link to={editando ? `/productos/${id}` : '/productos'} className="boton-secundario">Cancelar</Link>
          <button type="submit" className="boton-primario" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
