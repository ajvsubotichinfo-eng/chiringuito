// ============================================================
// Envoltorio para rutas que necesitan sesión iniciada. Si no hay
// usuario logueado, manda directo a /login. La seguridad real la
// hace el backend (verifica el token en cada pedido); esto es solo
// para no mostrar pantallas vacías mientras tanto.
// ============================================================

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexto/AuthContext';

export default function RutaProtegida() {
  const { estaLogueado } = useAuth();

  if (!estaLogueado) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
