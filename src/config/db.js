// ============================================================
// Conexión a la base de datos MySQL
//
// Usa un "pool" de conexiones: en lugar de abrir y cerrar una
// conexión por cada consulta, mantiene varias abiertas y las
// reutiliza. Es la práctica estándar y más eficiente.
//
// Las credenciales NUNCA van escritas acá: se leen del archivo
// .env (que no se sube a GitHub — está en .gitignore).
// ============================================================

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,   // suficiente para 2-3 usuarios simultáneos
  charset: 'utf8mb4'
});

// ------------------------------------------------------------
// probarConexion(): usada por el endpoint /api/db-test.
// Intenta una consulta simple y cuenta los productos.
// Devuelve { ok, mensaje, ... } sin exponer credenciales.
// ------------------------------------------------------------
async function probarConexion() {
  try {
    const [filas] = await pool.query(
      'SELECT COUNT(*) AS total FROM productos'
    );
    return {
      ok: true,
      mensaje: 'Conexión a MySQL exitosa ✅',
      base: process.env.DB_NAME,
      productos_cargados: filas[0].total
    };
  } catch (error) {
    return {
      ok: false,
      mensaje: 'No se pudo conectar a la base de datos ❌',
      // error.code es un código corto tipo ER_ACCESS_DENIED_ERROR
      // que sirve para diagnosticar sin exponer la contraseña.
      detalle: error.code || error.message
    };
  }
}

module.exports = { pool, probarConexion };
