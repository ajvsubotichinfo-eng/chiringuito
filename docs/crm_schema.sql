-- ============================================================
-- CRM Tienda — Esquema de base de datos (Fase 1)
-- Motor: MySQL / MariaDB (Hostinger)
-- Importar desde phpMyAdmin: pestaña "Importar" > elegir este archivo
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- Tabla: usuarios
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin','empleado') NOT NULL DEFAULT 'empleado',
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: productos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL,
  categoria VARCHAR(80) DEFAULT NULL,
  codigo_barras VARCHAR(50) DEFAULT NULL,
  precio_venta DECIMAL(12,2) DEFAULT NULL,
  foto_url VARCHAR(255) DEFAULT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_productos_nombre (nombre),
  KEY idx_productos_codigo (codigo_barras)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: proveedores
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS proveedores (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL,
  contacto VARCHAR(100) DEFAULT NULL,
  telefono VARCHAR(40) DEFAULT NULL,
  email VARCHAR(150) DEFAULT NULL,
  dia_visita VARCHAR(30) DEFAULT NULL,
  notas TEXT DEFAULT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_proveedores_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: precios_proveedor  (corazón del comparador)
-- Un proveedor tiene UN precio vigente por producto (UNIQUE).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS precios_proveedor (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  producto_id INT UNSIGNED NOT NULL,
  proveedor_id INT UNSIGNED NOT NULL,
  precio_compra DECIMAL(12,2) NOT NULL,
  unidad ENUM('unidad','bulto') NOT NULL DEFAULT 'unidad',
  cantidad_por_bulto INT UNSIGNED DEFAULT NULL, -- solo si unidad='bulto'
  fecha_actualizacion DATE NOT NULL,
  notas VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_producto_proveedor (producto_id, proveedor_id),
  KEY idx_pp_proveedor (proveedor_id),
  CONSTRAINT fk_pp_producto  FOREIGN KEY (producto_id)  REFERENCES productos(id),
  CONSTRAINT fk_pp_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: historial_precios
-- La llena el backend automáticamente al modificar un precio.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS historial_precios (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  producto_id INT UNSIGNED NOT NULL,
  proveedor_id INT UNSIGNED NOT NULL,
  precio_anterior DECIMAL(12,2) NOT NULL,
  precio_nuevo DECIMAL(12,2) NOT NULL,
  fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  usuario_id INT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_hp_producto (producto_id),
  KEY idx_hp_proveedor (proveedor_id),
  KEY idx_hp_fecha (fecha_cambio),
  CONSTRAINT fk_hp_producto  FOREIGN KEY (producto_id)  REFERENCES productos(id),
  CONSTRAINT fk_hp_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id),
  CONSTRAINT fk_hp_usuario   FOREIGN KEY (usuario_id)   REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: pagos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pagos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  fecha DATE NOT NULL,
  proveedor_id INT UNSIGNED NOT NULL,
  monto DECIMAL(12,2) NOT NULL,
  medio_pago ENUM('Efectivo','Transferencia','Cheque','Mercado Pago') NOT NULL,
  nro_comprobante VARCHAR(80) DEFAULT NULL,
  comprobante_url VARCHAR(255) DEFAULT NULL,
  notas TEXT DEFAULT NULL,
  usuario_id INT UNSIGNED DEFAULT NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pagos_fecha (fecha),
  KEY idx_pagos_proveedor (proveedor_id),
  CONSTRAINT fk_pagos_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id),
  CONSTRAINT fk_pagos_usuario   FOREIGN KEY (usuario_id)   REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: configuracion
-- Clave/valor genérico para ajustes de la app (por ahora, la
-- moneda). Pensada para poder sumar más ajustes en el futuro sin
-- tener que crear una columna nueva por cada uno.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS configuracion (
  clave VARCHAR(50) NOT NULL,
  valor VARCHAR(255) NOT NULL,
  PRIMARY KEY (clave)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO configuracion (clave, valor) VALUES ('moneda', 'ARS');

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- DATOS DE PRUEBA (opcionales)
-- Sirven para verificar que todo funciona. Se pueden borrar después.
-- El usuario admin de prueba se creará desde la app en la Fase 2
-- (la contraseña necesita encriptarse desde PHP).
-- ============================================================

INSERT INTO productos (nombre, categoria, precio_venta) VALUES
('Coca-Cola lata 354ml', 'Bebidas', 1500.00),
('Agua mineral 500ml', 'Bebidas', 900.00),
('Papas fritas clásicas 90g', 'Snacks', 1800.00);

INSERT INTO proveedores (nombre, contacto, telefono, dia_visita) VALUES
('Distribuidora Sur', 'Carlos', '+54 261 555-0001', 'Lunes'),
('Mayorista Centro', 'Ana', '+54 261 555-0002', 'Miércoles'),
('Bebidas del Oeste', 'Jorge', '+54 261 555-0003', 'Viernes');

-- Coca-Cola la venden los 3 proveedores (para probar el comparador)
INSERT INTO precios_proveedor (producto_id, proveedor_id, precio_compra, unidad, cantidad_por_bulto, fecha_actualizacion) VALUES
(1, 1, 950.00,  'unidad', NULL, CURDATE()),
(1, 2, 21600.00,'bulto',  24,   CURDATE()),   -- 900 por unidad
(1, 3, 1010.00, 'unidad', NULL, CURDATE()),
(2, 1, 520.00,  'unidad', NULL, CURDATE()),
(3, 2, 1150.00, 'unidad', NULL, CURDATE());

INSERT INTO pagos (fecha, proveedor_id, monto, medio_pago, nro_comprobante) VALUES
('2026-06-15', 1, 85000.00, 'Transferencia', 'FC-A-0001234'),
('2026-07-02', 1, 92000.00, 'Efectivo', 'FC-A-0001301'),
('2026-07-10', 2, 143500.00, 'Transferencia', 'FC-B-0009887');
