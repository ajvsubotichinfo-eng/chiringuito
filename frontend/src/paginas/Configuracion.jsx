// ============================================================
// Pantalla de Configuración (solo admin): por ahora, elegir la
// moneda en la que se muestran todos los precios y montos de la app.
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api';
import { useConfiguracion } from '../contexto/ConfiguracionContext';
import { IconoVolver } from '../componentes/Iconos';

// Monedas más comunes para una tienda de la región. Si el día de
// mañana hace falta otra, se agrega acá — el backend acepta
// cualquier código de moneda válido (ISO 4217), no solo estos.
const MONEDAS = [
  { codigo: 'ARS', nombre: 'Peso argentino' },
  { codigo: 'USD', nombre: 'Dólar estadounidense' },
  { codigo: 'EUR', nombre: 'Euro' },
  { codigo: 'UYU', nombre: 'Peso uruguayo' },
  { codigo: 'CLP', nombre: 'Peso chileno' },
  { codigo: 'BRL', nombre: 'Real brasileño' },
  { codigo: 'PYG', nombre: 'Guaraní paraguayo' },
  { codigo: 'BOB', nombre: 'Boliviano' },
  { codigo: 'MXN', nombre: 'Peso mexicano' }
];

export default function Configuracion() {
  const { moneda, setMoneda } = useConfiguracion();
  const [monedaElegida, setMonedaElegida] = useState(moneda);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setMensaje('');
    setGuardando(true);

    const respuesta = await apiFetch('/api/configuracion', { method: 'PUT', body: { moneda: monedaElegida } });

    setGuardando(false);

    if (respuesta.ok) {
      setMoneda(monedaElegida);
      setMensaje('Guardado. Todos los precios de la app ya se muestran en esta moneda.');
    } else {
      setError(respuesta.mensaje || 'No se pudo guardar la configuración');
    }
  }

  return (
    <div className="contenedor-angosto">
      <Link to="/" className="detalle-volver">
        <IconoVolver width={16} height={16} />
        Volver
      </Link>

      <h2 className="detalle-titulo">Configuración</h2>
      <p className="detalle-subtitulo">Ajustes generales de la app (solo para administradores).</p>

      <form className="formulario" onSubmit={manejarEnvio}>
        <label htmlFor="moneda">Moneda</label>
        <select id="moneda" value={monedaElegida} onChange={e => setMonedaElegida(e.target.value)}>
          {MONEDAS.map(m => (
            <option key={m.codigo} value={m.codigo}>{m.nombre} ({m.codigo})</option>
          ))}
        </select>

        <p className="texto-suave" style={{ marginTop: 10 }}>
          Ejemplo: {new Intl.NumberFormat('es-AR', { style: 'currency', currency: monedaElegida, maximumFractionDigits: 0 }).format(1000)}
        </p>

        {mensaje && <p className="texto-suave" style={{ color: '#1A7F4E', fontWeight: 600 }}>{mensaje}</p>}
        {error && <p className="mensaje-error">{error}</p>}

        <button type="submit" className="boton-primario" style={{ marginTop: 24, width: '100%' }} disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}
