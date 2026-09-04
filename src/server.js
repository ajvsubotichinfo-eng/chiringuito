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

const app = express();

// Puerto: Hostinger lo asigna por variable de entorno; local usa 3000.
const PORT = process.env.PORT || 3000;

// Permite recibir JSON en el cuerpo de las peticiones (lo usaremos en Fase 3).
app.use(express.json());

// Sirve los archivos estáticos de la carpeta /public (la página de prueba,
// y más adelante, la app React compilada).
app.use(express.static(path.join(__dirname, '..', 'public')));

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
// Arranque del servidor
// ------------------------------------------------------------
app.listen(PORT, () => {
  console.log('============================================');
  console.log('  CRM Frutos Secos Carmen T');
  console.log(`  Servidor corriendo en el puerto ${PORT}`);
  console.log(`  Abrir en el navegador: http://localhost:${PORT}`);
  console.log('============================================');
});
