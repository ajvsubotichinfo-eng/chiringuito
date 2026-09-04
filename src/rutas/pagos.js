// ============================================================
// Rutas de pagos
//
// GET  /api/pagos                → lista (filtros opcionales
//                                   ?proveedor_id= y ?mes=YYYY-MM)
// GET  /api/pagos/:id             → un pago puntual
// POST /api/pagos                 → registrar un pago nuevo, con foto
//                                    opcional del comprobante
// PUT  /api/pagos/:id             → editar un pago (puede reemplazar
//                                    la foto del comprobante)
//
// La foto se manda como multipart/form-data en el campo "comprobante".
// Se guarda en public/uploads/comprobantes/ y se sirve como archivo
// estático (ver server.js), por eso alcanza con guardar la URL relativa.
// ============================================================

const express = require('express');
const path = require('path');
const multer = require('multer');
const { pool } = require('../config/db');
const { requiereLogin } = require('../middleware/autenticacion');

const router = express.Router();

router.use(requiereLogin);

const almacenamiento = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'public', 'uploads', 'comprobantes'),
  filename: (req, file, cb) => {
    const sufijo = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${sufijo}${path.extname(file.originalname)}`);
  }
});

const subirComprobante = multer({
  storage: almacenamiento,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB alcanza de sobra para una foto de celular
  fileFilter: (req, file, cb) => {
    const permitidos = ['.jpg', '.jpeg', '.png', '.pdf', '.webp'];
    if (permitidos.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('El comprobante tiene que ser una imagen (jpg, png, webp) o PDF'));
    }
  }
});

router.get('/', async (req, res) => {
  const { proveedor_id, mes } = req.query;
  const condiciones = [];
  const parametros = [];

  if (proveedor_id) {
    condiciones.push('p.proveedor_id = ?');
    parametros.push(proveedor_id);
  }
  if (mes) {
    condiciones.push("DATE_FORMAT(p.fecha, '%Y-%m') = ?");
    parametros.push(mes);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  try {
    const [filas] = await pool.query(
      `SELECT p.id, p.fecha, p.proveedor_id, prov.nombre AS proveedor_nombre,
              p.monto, p.medio_pago, p.nro_comprobante, p.comprobante_url, p.notas
       FROM pagos p
       JOIN proveedores prov ON prov.id = p.proveedor_id
       ${where}
       ORDER BY p.fecha DESC, p.id DESC`,
      parametros
    );
    res.json({ ok: true, pagos: filas });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al listar pagos', detalle: error.code || error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [filas] = await pool.query('SELECT * FROM pagos WHERE id = ?', [req.params.id]);
    if (filas.length === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Pago no encontrado' });
    }
    res.json({ ok: true, pago: filas[0] });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al buscar el pago', detalle: error.code || error.message });
  }
});

router.post('/', subirComprobante.single('comprobante'), async (req, res) => {
  const { fecha, proveedor_id, monto, medio_pago, nro_comprobante, notas } = req.body;

  if (!fecha || !proveedor_id || !monto || !medio_pago) {
    return res.status(400).json({ ok: false, mensaje: 'Faltan datos: fecha, proveedor, monto y medio de pago son obligatorios' });
  }

  const comprobante_url = req.file ? `/uploads/comprobantes/${req.file.filename}` : null;

  try {
    const [resultado] = await pool.query(
      `INSERT INTO pagos (fecha, proveedor_id, monto, medio_pago, nro_comprobante, comprobante_url, notas, usuario_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [fecha, proveedor_id, monto, medio_pago, nro_comprobante || null, comprobante_url, notas || null, req.usuario.id]
    );
    res.status(201).json({ ok: true, id: resultado.insertId, comprobante_url });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al registrar el pago', detalle: error.code || error.message });
  }
});

router.put('/:id', subirComprobante.single('comprobante'), async (req, res) => {
  const { fecha, proveedor_id, monto, medio_pago, nro_comprobante, notas } = req.body;

  if (!fecha || !proveedor_id || !monto || !medio_pago) {
    return res.status(400).json({ ok: false, mensaje: 'Faltan datos: fecha, proveedor, monto y medio de pago son obligatorios' });
  }

  try {
    // Si mandaron una foto nueva, se reemplaza la URL guardada;
    // si no, se mantiene el comprobante que ya tenía.
    const campos = [fecha, proveedor_id, monto, medio_pago, nro_comprobante || null, notas || null];
    let set = 'fecha = ?, proveedor_id = ?, monto = ?, medio_pago = ?, nro_comprobante = ?, notas = ?';

    if (req.file) {
      set += ', comprobante_url = ?';
      campos.push(`/uploads/comprobantes/${req.file.filename}`);
    }

    campos.push(req.params.id);

    const [resultado] = await pool.query(`UPDATE pagos SET ${set} WHERE id = ?`, campos);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Pago no encontrado' });
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al editar el pago', detalle: error.code || error.message });
  }
});

module.exports = router;
