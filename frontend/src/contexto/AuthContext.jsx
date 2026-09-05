// ============================================================
// Contexto de sesión: guarda quién está logueado (nombre, rol) y
// expone funciones para iniciar/cerrar sesión. Cualquier pantalla
// puede usar useAuth() para saber si hay un usuario logueado y
// quién es, sin tener que pasar props de un lado a otro.
// ============================================================

import { createContext, useContext, useState } from 'react';
import { apiFetch, guardarToken, borrarToken, obtenerToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Si ya había un token guardado de una sesión anterior, arrancamos
  // "logueados" (el backend igual valida el token en cada pedido).
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('crm_usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  async function iniciarSesion(email, password) {
    const respuesta = await apiFetch('/api/login', {
      method: 'POST',
      body: { email, password }
    });

    if (respuesta.ok) {
      guardarToken(respuesta.token);
      localStorage.setItem('crm_usuario', JSON.stringify(respuesta.usuario));
      setUsuario(respuesta.usuario);
    }

    return respuesta;
  }

  function cerrarSesion() {
    borrarToken();
    localStorage.removeItem('crm_usuario');
    setUsuario(null);
  }

  const estaLogueado = Boolean(usuario && obtenerToken());

  return (
    <AuthContext.Provider value={{ usuario, estaLogueado, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
