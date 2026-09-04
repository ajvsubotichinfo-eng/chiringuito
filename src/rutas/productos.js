// ============================================================
// Rutas de productos
//
// GET    /api/productos        → lista (con búsqueda opcional ?q=texto)
// GET    /api/productos/:id    → un producto puntual
// POST   /api/productos        → crear
// PUT    /api/productos/:id    → editar (incluye activar/desactivar
//                                 mandando el campo "activo")
// ============================================================

const express = require('express');
const { pool } = require('../config/db');
const { requiereLogin } = require('../middleware/autenticacion');

const router = express.Router();

// Todas las rutas de productos requieren estar logueado (admin o empleado).
router.use(requiereLogin);

router.get('/', async (req, res) => {
  const busqueda = req.query.q ? `%${req.query.q}%` : '%';

  try {
    const [filas] = await pool.query(
      `SELECT id, nombre, categoria, codigo_barras, precio_venta, foto_url, activo
       FROM productos
       WHERE nombre LIKE ?
       ORDER BY nombre`,
      [busqueda]
    );
    res.json({ ok: true, productos: filas });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al listar productos', detalle: error.code || error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [filas] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    if (filas.length === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
    }
    res.json({ ok: true, producto: filas[0] });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al buscar el producto', detalle: error.code || error.message });
  }
});

router.post('/', async (req, res) => {
  const { nombre, categoria, codigo_barras, precio_venta, foto_url } = req.body;

  if (!nombre) {
    return res.status(400).json({ ok: false, mensaje: 'Falta el nombre del producto' });
  }

  try {
    const [resultado] = await pool.query(
      `INSERT INTO productos (nombre, categoria, codigo_barras, precio_venta, foto_url)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, categoria || null, codigo_barras || null, precio_venta || null, foto_url || null]
    );
    res.status(201).json({ ok: true, id: resultado.insertId });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al crear el producto', detalle: error.code || error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { nombre, categoria, codigo_barras, precio_venta, foto_url, activo } = req.body;

  if (!nombre) {
    return res.status(400).json({ ok: false, mensaje: 'Falta el nombre del producto' });
  }

  try {
    const [resultado] = await pool.query(
      `UPDATE productos
       SET nombre = ?, categoria = ?, codigo_barras = ?, precio_venta = ?, foto_url = ?, activo = ?
       WHERE id = ?`,
      [nombre, categoria || null, codigo_barras || null, precio_venta || null, foto_url || null, activo ?? 1, req.params.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al editar el producto', detalle: error.code || error.message });
  }
});

module.exports = router;
