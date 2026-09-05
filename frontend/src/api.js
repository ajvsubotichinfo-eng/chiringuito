// ============================================================
// Cliente de API: junta en un solo lugar cómo se llama al backend.
//
// - Agrega automáticamente el token de sesión (si hay uno guardado)
//   en el header Authorization.
// - Si el backend responde 401 (sesión vencida), borra el token
//   guardado para que la próxima pantalla mande al login de nuevo.
// ============================================================

const CLAVE_TOKEN = 'crm_token';

export function guardarToken(token) {
  localStorage.setItem(CLAVE_TOKEN, token);
}

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN);
}

export function borrarToken() {
  localStorage.removeItem(CLAVE_TOKEN);
}

// Uso: apiFetch('/api/productos') o apiFetch('/api/pagos', { method: 'POST', body: formData })
export async function apiFetch(ruta, opciones = {}) {
  const token = obtenerToken();
  const encabezados = { ...opciones.headers };

  if (token) {
    encabezados.Authorization = `Bearer ${token}`;
  }

  // Si el body es un objeto plano (no FormData), lo mandamos como JSON.
  let body = opciones.body;
  if (body && !(body instanceof FormData)) {
    encabezados['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const respuesta = await fetch(ruta, { ...opciones, headers: encabezados, body });

  // Si la sesión venció (o el token es inválido), se limpia y se manda
  // directo al login en vez de dejar la pantalla mostrando datos viejos.
  if (respuesta.status === 401) {
    borrarToken();
    localStorage.removeItem('crm_usuario');
    if (!ruta.includes('/api/login') && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  const datos = await respuesta.json();
  return { ok: respuesta.ok, ...datos };
}
