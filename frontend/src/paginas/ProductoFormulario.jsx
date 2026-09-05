// ============================================================
// Formulario para crear o editar un producto. Se usa en dos rutas:
// /productos/nuevo (crear) y /productos/:id/editar (editar) — si hay
// :id en la URL, carga esos datos y edita; si no, crea uno nuevo.
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api';
import { IconoVolver, IconoTilde } from '../componentes/Iconos';

export default function ProductoFormulario() {
  const { id } = useParams();
  const navegar = useNavigate();
  const editando = Boolean(id);

  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [activo, setActivo] = useState(true);
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

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setGuardando(true);

    const cuerpo = {
      nombre,
      categoria: categoria || null,
      codigo_barras: codigoBarras || null,
      precio_venta: precioVenta || null,
      activo
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

  return (
    <div className="contenedor-angosto">
      <Link to={editando ? `/productos/${id}` : '/productos'} className="detalle-volver">
        <IconoVolver width={16} height={16} />
        Volver
      </Link>

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
