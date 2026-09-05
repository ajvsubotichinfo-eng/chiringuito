// ============================================================
// Pantalla de Login: email + contraseña. Si el login funciona,
// redirige a la app; si falla, muestra el motivo (usa el mismo
// mensaje que devuelve el backend).
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexto/AuthContext';

export default function Login() {
  const { iniciarSesion } = useAuth();
  const navegar = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recordarme, setRecordarme] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setCargando(true);

    const respuesta = await iniciarSesion(email, password, recordarme);

    setCargando(false);

    if (respuesta.ok) {
      navegar('/');
    } else {
      setError(respuesta.mensaje || 'No se pudo iniciar sesión');
    }
  }

  return (
    <div className="pantalla-login">
      <div className="tarjeta-login">
        <h1>🌰 Frutos Secos<br />Carmen T</h1>

        <form onSubmit={manejarEnvio}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <label className="fila-switch">
            <input
              type="checkbox"
              checked={recordarme}
              onChange={e => setRecordarme(e.target.checked)}
            />
            Mantenerme conectado 30 días (solo en tu computadora personal)
          </label>

          {error && <p className="mensaje-error">{error}</p>}

          <button type="submit" className="boton-grande" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'INGRESAR'}
          </button>
        </form>
      </div>
    </div>
  );
}
