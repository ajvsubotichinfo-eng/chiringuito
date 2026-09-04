// ============================================================
// Rutas de precios (el corazón del comparador)
//
// GET  /api/precios/comparar/:productoId
//      → precio de cada proveedor para ese producto, con el precio
//        unitario real calculado (si vende por bulto, precio_compra
//        dividido cantidad_por_bulto), del más barato al más caro.
//
// POST /api/precios
//      → un proveedor empieza a vender un producto (primera vez).
//
// PUT  /api/precios/:id
//      → actualiza el precio de un producto-proveedor ya existente.
//        SIEMPRE que precio_compra cambia, se guarda el precio
//        anterior en historial_precios ANTES de pisarlo. Esto se hace
//        acá, en el backend, y no depende de lo que mande el frontend
//        (regla fija del proyecto, ver CLAUDE.md).
//
// GET  /api/precios/historial?producto_id=X&proveedor_id=Y (opcional)
//      → historial de cambios, con la diferencia en $ y % ya calculada,
//        del más reciente al más viejo.
// ============================================================

const express = require('express');
const { pool } = require('../config/db');
const { requiereLogin } = require('../middleware/autenticacion');

const router = express.Router();

router.use(requiereLogin);

// Calcula el precio por unidad real, sin importar si el proveedor
// vende por unidad suelta o por bulto. Así se puede comparar
// proveedores aunque vendan en presentaciones distintas.
function precioUnitario(fila) {
  if (fila.unidad === 'bulto' && fila.cantidad_por_bulto) {
    return Number(fila.precio_compra) / fila.cantidad_por_bulto;
  }
  return Number(fila.precio_compra);
}

router.get('/comparar/:productoId', async (req, res) => {
  try {
    const [filas] = await pool.query(
      `SELECT pp.id, pp.proveedor_id, prov.nombre AS proveedor_nombre,
              pp.precio_compra, pp.unidad, pp.cantidad_por_bulto,
              pp.fecha_actualizacion, pp.notas
       FROM precios_proveedor pp
       JOIN proveedores prov ON prov.id = pp.proveedor_id
       WHERE pp.producto_id = ? AND prov.activo = 1
       ORDER BY prov.nombre`,
      [req.params.productoId]
    );

    const conPrecioUnitario = filas
      .map(fila => ({ ...fila, precio_unitario: Number(precioUnitario(fila).toFixed(2)) }))
      .sort((a, b) => a.precio_unitario - b.precio_unitario);

    res.json({ ok: true, precios: conPrecioUnitario });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al comparar precios', detalle: error.code || error.message });
  }
});

router.post('/', async (req, res) => {
  const { producto_id, proveedor_id, precio_compra, unidad, cantidad_por_bulto, notas } = req.body;

  if (!producto_id || !proveedor_id || !precio_compra) {
    return res.status(400).json({ ok: false, mensaje: 'Faltan datos: producto, proveedor y precio son obligatorios' });
  }

  try {
    const [resultado] = await pool.query(
      `INSERT INTO precios_proveedor
         (producto_id, proveedor_id, precio_compra, unidad, cantidad_por_bulto, fecha_actualizacion, notas)
       VALUES (?, ?, ?, ?, ?, CURDATE(), ?)`,
      [producto_id, proveedor_id, precio_compra, unidad || 'unidad', cantidad_por_bulto || null, notas || null]
    );
    res.status(201).json({ ok: true, id: resultado.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ ok: false, mensaje: 'Ese proveedor ya tiene un precio cargado para este producto; usá editar en vez de crear' });
    }
    res.status(500).json({ ok: false, mensaje: 'Error al cargar el precio', detalle: error.code || error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { precio_compra, unidad, cantidad_por_bulto, notas } = req.body;

  if (!precio_compra) {
    return res.status(400).json({ ok: false, mensaje: 'Falta el precio' });
  }

  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();

    const [filas] = await conexion.query(
      'SELECT producto_id, proveedor_id, precio_compra FROM precios_proveedor WHERE id = ? FOR UPDATE',
      [req.params.id]
    );
    const actual = filas[0];

    if (!actual) {
      await conexion.rollback();
      return res.status(404).json({ ok: false, mensaje: 'No se encontró ese precio' });
    }

    // Solo se registra en el historial si el precio realmente cambió.
    if (Number(actual.precio_compra) !== Number(precio_compra)) {
      await conexion.query(
        `INSERT INTO historial_precios (producto_id, proveedor_id, precio_anterior, precio_nuevo, usuario_id)
         VALUES (?, ?, ?, ?, ?)`,
        [actual.producto_id, actual.proveedor_id, actual.precio_compra, precio_compra, req.usuario.id]
      );
    }

    await conexion.query(
      `UPDATE precios_proveedor
       SET precio_compra = ?, unidad = ?, cantidad_por_bulto = ?, fecha_actualizacion = CURDATE(), notas = ?
       WHERE id = ?`,
      [precio_compra, unidad || 'unidad', cantidad_por_bulto || null, notas || null, req.params.id]
    );

    await conexion.commit();
    res.json({ ok: true });
  } catch (error) {
    await conexion.rollback();
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar el precio', detalle: error.code || error.message });
  } finally {
    conexion.release();
  }
});

router.get('/historial', async (req, res) => {
  const { producto_id, proveedor_id } = req.query;

  if (!producto_id) {
    return res.status(400).json({ ok: false, mensaje: 'Falta indicar el producto' });
  }

  const condiciones = ['hp.producto_id = ?'];
  const parametros = [producto_id];
  if (proveedor_id) {
    condiciones.push('hp.proveedor_id = ?');
    parametros.push(proveedor_id);
  }

  try {
    const [filas] = await pool.query(
      `SELECT hp.id, hp.producto_id, hp.proveedor_id, prov.nombre AS proveedor_nombre,
              hp.precio_anterior, hp.precio_nuevo, hp.fecha_cambio, u.nombre AS usuario_nombre
       FROM historial_precios hp
       JOIN proveedores prov ON prov.id = hp.proveedor_id
       LEFT JOIN usuarios u ON u.id = hp.usuario_id
       WHERE ${condiciones.join(' AND ')}
       ORDER BY hp.fecha_cambio DESC`,
      parametros
    );

    const conVariacion = filas.map(fila => {
      const anterior = Number(fila.precio_anterior);
      const nuevo = Number(fila.precio_nuevo);
      return {
        ...fila,
        diferencia: Number((nuevo - anterior).toFixed(2)),
        variacion_pct: anterior !== 0 ? Number((((nuevo - anterior) / anterior) * 100).toFixed(2)) : null
      };
    });

    res.json({ ok: true, historial: conVariacion });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener el historial', detalle: error.code || error.message });
  }
});

module.exports = router;
