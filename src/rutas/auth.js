// ============================================================
// Rutas de autenticación
//
// POST /api/login: recibe email + contraseña, los compara contra la
// base (la contraseña está guardada hasheada con bcrypt, nunca en
// texto plano) y devuelve un token JWT que el frontend guarda y manda
// en cada petición siguiente para probar que está logueado. Si manda
// "recordarme: true" (switch "Mantenerme conectado" del login), el
// token dura 30 días en vez de 12 horas — pensado para cuando alguien
// entra desde su propia computadora y no quiere loguearse seguido.
//
// GET /api/perfil: ruta protegida de prueba, devuelve los datos del
// usuario logueado según el token. Sirve para confirmar que el login
// funciona de punta a punta.
// ============================================================

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { requiereLogin } = require('../middleware/autenticacion');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password, recordarme } = req.body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, mensaje: 'Faltan el email o la contraseña' });
  }

  try {
    const [filas] = await pool.query(
      'SELECT id, nombre, email, password_hash, rol, activo FROM usuarios WHERE email = ?',
      [email]
    );
    const usuario = filas[0];

    // Mismo mensaje tanto si el usuario no existe como si la contraseña
    // está mal, para no darle pistas a quien intenta adivinar cuentas.
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ ok: false, mensaje: 'Email o contraseña incorrectos' });
    }

    const coincide = await bcrypt.compare(password, usuario.password_hash);
    if (!coincide) {
      return res.status(401).json({ ok: false, mensaje: 'Email o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: recordarme ? '30d' : '12h' }
    );

    res.json({
      ok: true,
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al iniciar sesión',
      detalle: error.code || error.message
    });
  }
});

router.get('/perfil', requiereLogin, (req, res) => {
  res.json({ ok: true, usuario: req.usuario });
});

module.exports = router;
