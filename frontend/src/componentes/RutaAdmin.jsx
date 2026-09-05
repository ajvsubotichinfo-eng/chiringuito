// ============================================================
// Envoltorio para rutas que solo puede ver el admin (ej.
// Configuración). Si un empleado intenta entrar por URL directa, lo
// manda de vuelta al Comparador — la seguridad real la hace el
// backend (requiereAdmin en la ruta de la API).
// ============================================================

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexto/AuthContext';

export default function RutaAdmin() {
  const { usuario } = useAuth();

  if (usuario?.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
