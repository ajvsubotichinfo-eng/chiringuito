# Módulo 05 — Clientes (CRM)

## Responsabilidad
Mantener el registro de clientes finales de cada tenant y su historial de compras.

## Alcance
- Incluye: datos de contacto del cliente, historial de compras asociado.
- No incluye: gestión de proveedores (módulo 06, es un CRM distinto con otro propósito).

## Decisiones ya tomadas
Ninguna definida todavía — módulo mencionado pero no discutido en profundidad.

## Modelo de datos (borrador)
- `clientes`: id, tenant_id, nombre, contacto, datos fiscales (si aplica para facturación a nombre del cliente).
- Relación con `ventas` (módulo 04) para historial de compras.

## Dependencias con otros módulos
- Módulo 04 (ventas): cada venta puede asociarse opcionalmente a un cliente.
- Módulo 07 (facturación): si el comprobante requiere datos fiscales del cliente (ej. factura A en Argentina, factura con NIF en España).

## Pendiente de definir
- Todo: nivel de detalle del CRM (solo datos básicos vs. seguimiento comercial tipo cuentas corrientes, fidelización, etc.).
- Si se permite venta sin cliente identificado ("consumidor final") y cómo se maneja eso de cara a la facturación fiscal de cada país.
