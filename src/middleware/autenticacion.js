// ============================================================
// Middleware de autenticación
//
// requiereLogin: verifica el token JWT que el frontend manda en el
// header "Authorization: Bearer <token>". Si es válido, guarda los
// datos del usuario en req.usuario para que la ruta siguiente sepa
// quién hizo la petición. Si no, corta con un 401 (no autorizado).
//
// requiereAdmin: se usa DESPUÉS de requiereLogin en las rutas que
// solo puede usar el dueño (ej: alta de usuarios). Corta con 403
// (prohibido) si el usuario logueado no es admin.
// ============================================================

const jwt = require('jsonwebtoken');

function requiereLogin(req, res, next) {
  const encabezado = req.headers.authorization;

  if (!encabezado || !encabezado.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, mensaje: 'Necesitás iniciar sesión' });
  }

  const token = encabezado.slice('Bearer '.length);

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, mensaje: 'Sesión inválida o vencida, iniciá sesión de nuevo' });
  }
}

function requiereAdmin(req, res, next) {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ ok: false, mensaje: 'Esta acción es solo para administradores' });
  }
  next();
}

module.exports = { requiereLogin, requiereAdmin };
