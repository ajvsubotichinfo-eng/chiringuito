// ============================================================
// Rutas de ingresos: plata que entra por ventas del día (cierre de
// caja), separada por medio de cobro. A diferencia de "pagos" (que
// va A un proveedor), acá no hay proveedor ni comprobante: es lo
// recaudado en el mostrador.
//
// GET  /api/ingresos               → lista (filtro opcional ?mes=YYYY-MM)
// POST /api/ingresos                → registrar un ingreso
// PUT  /api/ingresos/:id            → editar un ingreso
// ============================================================

const express = require('express');
const { pool } = require('../config/db');
const { requiereLogin } = require('../middleware/autenticacion');
const { TENANT_ID_ACTUAL } = require('../config/tenant');

const router = express.Router();

router.use(requiereLogin);

router.get('/', async (req, res) => {
  const { mes } = req.query;
  const condiciones = [];
  const parametros = [];

  if (mes) {
    condiciones.push("DATE_FORMAT(fecha, '%Y-%m') = ?");
    parametros.push(mes);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  try {
    const [filas] = await pool.query(
      `SELECT id, fecha, monto, medio, notas
       FROM ingresos
       ${where}
       ORDER BY fecha DESC, id DESC`,
      parametros
    );
    res.json({ ok: true, ingresos: filas });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al listar los ingresos', detalle: error.code || error.message });
  }
});

router.post('/', async (req, res) => {
  const { fecha, monto, medio, notas } = req.body;

  if (!fecha || !monto || !medio) {
    return res.status(400).json({ ok: false, mensaje: 'Faltan datos: fecha, monto y medio son obligatorios' });
  }

  try {
    const [resultado] = await pool.query(
      `INSERT INTO ingresos (tenant_id, fecha, monto, medio, notas, usuario_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [TENANT_ID_ACTUAL, fecha, monto, medio, notas || null, req.usuario.id]
    );
    res.status(201).json({ ok: true, id: resultado.insertId });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al registrar el ingreso', detalle: error.code || error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { fecha, monto, medio, notas } = req.body;

  if (!fecha || !monto || !medio) {
    return res.status(400).json({ ok: false, mensaje: 'Faltan datos: fecha, monto y medio son obligatorios' });
  }

  try {
    const [resultado] = await pool.query(
      `UPDATE ingresos SET fecha = ?, monto = ?, medio = ?, notas = ? WHERE id = ?`,
      [fecha, monto, medio, notas || null, req.params.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Ingreso no encontrado' });
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al editar el ingreso', detalle: error.code || error.message });
  }
});

module.exports = router;
