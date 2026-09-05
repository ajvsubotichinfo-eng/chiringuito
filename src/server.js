// ============================================================
// FRUTOS SECOS CARMEN T — CRM
// Servidor principal (Fase 2: app mínima para validar el circuito
// local → GitHub → Hostinger antes de construir el sistema completo)
//
// ¿Qué hace este archivo?
//  1. Levanta un servidor web con Express.
//  2. Sirve la página de prueba que está en /public.
//  3. Expone dos endpoints de diagnóstico:
//     - GET /api/health   → confirma que el servidor Node está vivo.
//     - GET /api/db-test  → confirma que la conexión a MySQL funciona
//                           y cuenta los productos cargados.
//
// Para correrlo:  npm start   (o  npm run dev  mientras se desarrolla)
// Configuración:  se lee del archivo .env (ver .env.example)
// ============================================================

require('dotenv').config();
const express = require('express');
const path = require('path');
const { probarConexion } = require('./config/db');
const rutasAuth = require('./rutas/auth');
const rutasProductos = require('./rutas/productos');
const rutasProveedores = require('./rutas/proveedores');
const rutasPrecios = require('./rutas/precios');
const rutasPagos = require('./rutas/pagos');
const rutasReportes = require('./rutas/reportes');
const rutasConfiguracion = require('./rutas/configuracion');
const rutasIngresos = require('./rutas/ingresos');

const app = express();

// Puerto: Hostinger lo asigna por variable de entorno; local usa 3000.
const PORT = process.env.PORT || 3000;

// Permite recibir JSON en el cuerpo de las peticiones (lo usaremos en Fase 3).
app.use(express.json());

// Sirve los archivos estáticos de la carpeta /public (la página de prueba,
// y más adelante, la app React compilada).
app.use(express.static(path.join(__dirname, '..', 'public')));

// Fotos de comprobantes de pago: se sirven desde /uploads, una carpeta
// SEPARADA de /public a propósito. El build de React vacía /public en
// cada despliegue, y las fotos ya subidas por los usuarios no deben
// borrarse nunca por eso.
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rutas de login (POST /api/login) y perfil (GET /api/perfil).
app.use('/api', rutasAuth);

// Rutas de productos y proveedores (requieren estar logueado).
app.use('/api/productos', rutasProductos);
app.use('/api/proveedores', rutasProveedores);
app.use('/api/precios', rutasPrecios);
app.use('/api/pagos', rutasPagos);
app.use('/api/reportes', rutasReportes);
app.use('/api/configuracion', rutasConfiguracion);
app.use('/api/ingresos', rutasIngresos);

// ------------------------------------------------------------
// ENDPOINT DE DIAGNÓSTICO 1: ¿el servidor está vivo?
// Probar en el navegador: http://localhost:3000/api/health
// ------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'Servidor del CRM funcionando ✅',
    fecha: new Date().toISOString(),
    entorno: process.env.NODE_ENV || 'desarrollo'
  });
});

// ------------------------------------------------------------
// ENDPOINT DE DIAGNÓSTICO 2: ¿la base de datos responde?
// Probar en el navegador: http://localhost:3000/api/db-test
// ------------------------------------------------------------
app.get('/api/db-test', async (req, res) => {
  const resultado = await probarConexion();
  if (resultado.ok) {
    res.json(resultado);
  } else {
    // 500 = error del servidor. El mensaje ayuda a diagnosticar
    // sin exponer datos sensibles.
    res.status(500).json(resultado);
  }
});

// ------------------------------------------------------------
// Cualquier otra ruta (que no sea /api ni un archivo estático) devuelve
// la app de React. Así funcionan las rutas internas del frontend
// (ej. /productos, /productos/5) al escribirlas directo en el
// navegador o al refrescar la página — si no, el servidor no sabe qué
// contestar y da 404, porque esas rutas solo existen del lado de React.
// ------------------------------------------------------------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ------------------------------------------------------------
// Arranque del servidor
// ------------------------------------------------------------
app.listen(PORT, () => {
  console.log('============================================');
  console.log('  CRM Frutos Secos Carmen T');
  console.log(`  Servidor corriendo en el puerto ${PORT}`);
  console.log(`  Abrir en el navegador: http://localhost:${PORT}`);
  console.log('============================================');
});
