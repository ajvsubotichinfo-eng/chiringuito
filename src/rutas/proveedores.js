// ============================================================
// Rutas de proveedores
//
// GET    /api/proveedores       → lista (con búsqueda opcional ?q=texto)
// GET    /api/proveedores/:id   → un proveedor puntual
// POST   /api/proveedores       → crear
// PUT    /api/proveedores/:id   → editar (incluye activar/desactivar
//                                  mandando el campo "activo")
// ============================================================

const express = require('express');
const { pool } = require('../config/db');
const { requiereLogin } = require('../middleware/autenticacion');
const { TENANT_ID_ACTUAL } = require('../config/tenant');

const router = express.Router();

// Todas las rutas de proveedores requieren estar logueado (admin o empleado).
router.use(requiereLogin);

router.get('/', async (req, res) => {
  const busqueda = req.query.q ? `%${req.query.q}%` : '%';

  try {
    const [filas] = await pool.query(
      `SELECT id, nombre, contacto, telefono, email, dia_visita, activo
       FROM proveedores
       WHERE nombre LIKE ?
       ORDER BY nombre`,
      [busqueda]
    );
    res.json({ ok: true, proveedores: filas });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al listar proveedores', detalle: error.code || error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [filas] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [req.params.id]);
    if (filas.length === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Proveedor no encontrado' });
    }
    res.json({ ok: true, proveedor: filas[0] });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al buscar el proveedor', detalle: error.code || error.message });
  }
});

router.post('/', async (req, res) => {
  const { nombre, contacto, telefono, email, dia_visita, notas } = req.body;

  if (!nombre) {
    return res.status(400).json({ ok: false, mensaje: 'Falta el nombre del proveedor' });
  }

  try {
    const [resultado] = await pool.query(
      `INSERT INTO proveedores (tenant_id, nombre, contacto, telefono, email, dia_visita, notas)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [TENANT_ID_ACTUAL, nombre, contacto || null, telefono || null, email || null, dia_visita || null, notas || null]
    );
    res.status(201).json({ ok: true, id: resultado.insertId });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al crear el proveedor', detalle: error.code || error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { nombre, contacto, telefono, email, dia_visita, notas, activo } = req.body;

  if (!nombre) {
    return res.status(400).json({ ok: false, mensaje: 'Falta el nombre del proveedor' });
  }

  try {
    const [resultado] = await pool.query(
      `UPDATE proveedores
       SET nombre = ?, contacto = ?, telefono = ?, email = ?, dia_visita = ?, notas = ?, activo = ?
       WHERE id = ?`,
      [nombre, contacto || null, telefono || null, email || null, dia_visita || null, notas || null, activo ?? 1, req.params.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Proveedor no encontrado' });
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al editar el proveedor', detalle: error.code || error.message });
  }
});

module.exports = router;
