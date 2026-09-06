// ============================================================
// Rutas de productos
//
// GET    /api/productos        → lista (con búsqueda opcional ?q=texto)
// GET    /api/productos/:id    → un producto puntual
// POST   /api/productos        → crear — junto con su primer proveedor y
//                                 precio, en una misma transacción. Nunca
//                                 se crea un producto sin al menos un
//                                 precio cargado (evita productos "fantasma"
//                                 sin ningún proveedor, y frena duplicados
//                                 por accidente: el frontend hace buscar
//                                 primero en la lista existente antes de
//                                 ofrecer crear uno nuevo).
// PUT    /api/productos/:id    → editar (incluye activar/desactivar
//                                 mandando el campo "activo")
// ============================================================

const express = require('express');
const { pool } = require('../config/db');
const { requiereLogin } = require('../middleware/autenticacion');
const { TENANT_ID_ACTUAL } = require('../config/tenant');

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
  const {
    nombre, categoria, codigo_barras, precio_venta, foto_url,
    proveedor_id, precio_compra, unidad, cantidad_por_bulto
  } = req.body;

  if (!nombre) {
    return res.status(400).json({ ok: false, mensaje: 'Falta el nombre del producto' });
  }
  if (!proveedor_id || !precio_compra) {
    return res.status(400).json({ ok: false, mensaje: 'Todo producto nuevo necesita un proveedor y un precio de compra' });
  }

  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();

    const [resultadoProducto] = await conexion.query(
      `INSERT INTO productos (tenant_id, nombre, categoria, codigo_barras, precio_venta, foto_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [TENANT_ID_ACTUAL, nombre, categoria || null, codigo_barras || null, precio_venta || null, foto_url || null]
    );
    const productoId = resultadoProducto.insertId;

    await conexion.query(
      `INSERT INTO precios_proveedor (tenant_id, producto_id, proveedor_id, precio_compra, unidad, cantidad_por_bulto, fecha_actualizacion)
       VALUES (?, ?, ?, ?, ?, ?, CURDATE())`,
      [TENANT_ID_ACTUAL, productoId, proveedor_id, precio_compra, unidad || 'unidad', cantidad_por_bulto || null]
    );

    await conexion.commit();
    res.status(201).json({ ok: true, id: productoId });
  } catch (error) {
    await conexion.rollback();
    res.status(500).json({ ok: false, mensaje: 'Error al crear el producto', detalle: error.code || error.message });
  } finally {
    conexion.release();
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
