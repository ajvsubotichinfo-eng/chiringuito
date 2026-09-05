// ============================================================
// Rutas de reportes
//
// GET /api/reportes/pagos-por-mes  (filtros opcionales ?mes=YYYY-MM
//                                    y/o ?proveedor_id=)
//     → total pagado por mes y por proveedor, con la cantidad de
//       pagos que forman ese total. Es lo que alimenta la pantalla
//       "Pagos por mes".
//
// GET /api/reportes/ingresos-por-mes?mes=YYYY-MM
//     → total ingresado en el mes, agrupado por medio de cobro.
// ============================================================

const express = require('express');
const { pool } = require('../config/db');
const { requiereLogin } = require('../middleware/autenticacion');

const router = express.Router();

router.use(requiereLogin);

router.get('/pagos-por-mes', async (req, res) => {
  const { mes, proveedor_id } = req.query;
  const condiciones = [];
  const parametros = [];

  if (mes) {
    condiciones.push("DATE_FORMAT(p.fecha, '%Y-%m') = ?");
    parametros.push(mes);
  }
  if (proveedor_id) {
    condiciones.push('p.proveedor_id = ?');
    parametros.push(proveedor_id);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  try {
    const [filas] = await pool.query(
      `SELECT DATE_FORMAT(p.fecha, '%Y-%m') AS mes,
              p.proveedor_id, prov.nombre AS proveedor_nombre,
              SUM(p.monto) AS total, COUNT(*) AS cantidad_pagos
       FROM pagos p
       JOIN proveedores prov ON prov.id = p.proveedor_id
       ${where}
       GROUP BY mes, p.proveedor_id, prov.nombre
       ORDER BY mes DESC, prov.nombre`,
      parametros
    );

    const conNumeros = filas.map(fila => ({ ...fila, total: Number(fila.total) }));
    res.json({ ok: true, reporte: conNumeros });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al generar el reporte', detalle: error.code || error.message });
  }
});

router.get('/ingresos-por-mes', async (req, res) => {
  const { mes } = req.query;

  if (!mes) {
    return res.status(400).json({ ok: false, mensaje: 'Falta indicar el mes' });
  }

  try {
    const [filas] = await pool.query(
      `SELECT medio, SUM(monto) AS total, COUNT(*) AS cantidad
       FROM ingresos
       WHERE DATE_FORMAT(fecha, '%Y-%m') = ?
       GROUP BY medio
       ORDER BY medio`,
      [mes]
    );

    const conNumeros = filas.map(fila => ({ ...fila, total: Number(fila.total) }));
    res.json({ ok: true, reporte: conNumeros });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al generar el reporte', detalle: error.code || error.message });
  }
});

module.exports = router;
