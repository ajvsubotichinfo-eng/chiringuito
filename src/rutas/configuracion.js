// ============================================================
// Rutas de configuración de la app (por ahora, solo la moneda).
//
// GET /api/configuracion  → cualquier usuario logueado: la necesita
//                            el frontend para formatear todos los
//                            montos ($, dólares, etc.) según lo que
//                            haya elegido el admin.
// PUT /api/configuracion  → solo admin: cambia uno o más valores.
// ============================================================

const express = require('express');
const { pool } = require('../config/db');
const { requiereLogin, requiereAdmin } = require('../middleware/autenticacion');
const { TENANT_ID_ACTUAL } = require('../config/tenant');

const router = express.Router();

router.use(requiereLogin);

router.get('/', async (req, res) => {
  try {
    const [filas] = await pool.query('SELECT clave, valor FROM configuracion WHERE tenant_id = ?', [TENANT_ID_ACTUAL]);
    const configuracion = Object.fromEntries(filas.map(fila => [fila.clave, fila.valor]));
    res.json({ ok: true, configuracion });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener la configuración', detalle: error.code || error.message });
  }
});

router.put('/', requiereAdmin, async (req, res) => {
  const { moneda } = req.body;

  if (!moneda) {
    return res.status(400).json({ ok: false, mensaje: 'Falta la moneda' });
  }

  // Se valida contra la lista real de códigos de moneda (ISO 4217) que
  // reconoce el propio Node, en vez de una lista fija: así cualquier
  // moneda válida funciona, y una inventada se rechaza.
  const codigo = moneda.toUpperCase();
  if (!Intl.supportedValuesOf('currency').includes(codigo)) {
    return res.status(400).json({ ok: false, mensaje: 'Ese código de moneda no es válido' });
  }

  try {
    await pool.query(
      'INSERT INTO configuracion (tenant_id, clave, valor) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE valor = VALUES(valor)',
      [TENANT_ID_ACTUAL, 'moneda', codigo]
    );
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al guardar la configuración', detalle: error.code || error.message });
  }
});

module.exports = router;
