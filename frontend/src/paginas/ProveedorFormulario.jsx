// ============================================================
// Formulario para crear o editar un proveedor. Igual que el de
// productos: /proveedores/nuevo para crear, /proveedores/:id/editar
// para editar (carga los datos existentes).
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api';
import { IconoVolver, IconoTilde } from '../componentes/Iconos';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function ProveedorFormulario() {
  const { id } = useParams();
  const navegar = useNavigate();
  const editando = Boolean(id);

  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [diaVisita, setDiaVisita] = useState('');
  const [notas, setNotas] = useState('');
  const [activo, setActivo] = useState(true);
  const [cargando, setCargando] = useState(editando);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editando) return;

    apiFetch(`/api/proveedores/${id}`).then(respuesta => {
      if (respuesta.ok) {
        const p = respuesta.proveedor;
        setNombre(p.nombre);
        setContacto(p.contacto || '');
        setTelefono(p.telefono || '');
        setEmail(p.email || '');
        setDiaVisita(p.dia_visita || '');
        setNotas(p.notas || '');
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
      contacto: contacto || null,
      telefono: telefono || null,
      email: email || null,
      dia_visita: diaVisita || null,
      notas: notas || null,
      activo
    };

    const respuesta = editando
      ? await apiFetch(`/api/proveedores/${id}`, { method: 'PUT', body: cuerpo })
      : await apiFetch('/api/proveedores', { method: 'POST', body: cuerpo });

    setGuardando(false);

    if (respuesta.ok) {
      navegar(`/proveedores/${editando ? id : respuesta.id}`);
    } else {
      setError(respuesta.mensaje || 'No se pudo guardar el proveedor');
    }
  }

  if (cargando) {
    return <p className="texto-suave">Cargando...</p>;
  }

  return (
    <div className="contenedor-angosto">
      <Link to={editando ? `/proveedores/${id}` : '/proveedores'} className="detalle-volver">
        <IconoVolver width={16} height={16} />
        Volver
      </Link>

      <h2 className="detalle-titulo">{editando ? 'Editar proveedor' : 'Nuevo proveedor'}</h2>

      <form className="formulario" onSubmit={manejarEnvio}>
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />

        <div className="fila-campos">
          <div>
            <label htmlFor="contacto">Contacto</label>
            <input id="contacto" value={contacto} onChange={e => setContacto(e.target.value)} />
          </div>
          <div>
            <label htmlFor="telefono">Teléfono</label>
            <input id="telefono" value={telefono} onChange={e => setTelefono(e.target.value)} />
          </div>
        </div>

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />

        <label htmlFor="diaVisita">Día de visita</label>
        <select id="diaVisita" value={diaVisita} onChange={e => setDiaVisita(e.target.value)}>
          <option value="">Sin definir</option>
          {DIAS.map(dia => <option key={dia} value={dia}>{dia}</option>)}
        </select>

        <label htmlFor="notas">Notas</label>
        <textarea id="notas" rows={3} value={notas} onChange={e => setNotas(e.target.value)} />

        {editando && (
          <label className="fila-switch" style={{ marginTop: 22, color: 'var(--color-texto)' }}>
            <span className="switch-caja">
              <input type="checkbox" checked={activo} onChange={e => setActivo(e.target.checked)} />
              <IconoTilde className="switch-check" width={14} height={14} />
            </span>
            Proveedor activo
          </label>
        )}

        {error && <p className="mensaje-error">{error}</p>}

        <div className="fila-botones">
          <Link to={editando ? `/proveedores/${id}` : '/proveedores'} className="boton-secundario">Cancelar</Link>
          <button type="submit" className="boton-primario" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
