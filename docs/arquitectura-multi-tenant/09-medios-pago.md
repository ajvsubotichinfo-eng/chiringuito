# Módulo 09 — Medios de pago

## Responsabilidad
Permitir cobrar una venta con distintos medios de pago electrónico, mediante el mismo patrón de conector pluggable usado en facturación.

## Alcance
- Incluye: interfaz genérica de conector de pago, implementaciones por país/proveedor.
- No incluye: efectivo (se maneja directo en el módulo 04, sin conector externo).

## Decisiones ya tomadas
- Se aplica el **mismo patrón de conector pluggable** que en el módulo 07 (facturación): cada país resuelve sus medios de pago electrónico con su propio conector, sin tocar el core.
  - Argentina: Mercado Pago.
  - España: Bizum / Redsys / Stripe.

## Modelo de datos (borrador)
- `conectores_pago`: id, tenant_id, país, proveedor, credenciales (cifradas), estado.
- `pagos`: id, venta_id, conector_id, monto, estado (pendiente/aprobado/rechazado), referencia externa.

## Dependencias con otros módulos
- Módulo 04 (ventas): una venta puede tener uno o más pagos asociados, cada uno vía un conector distinto.
- Módulo 01 (multi-tenant): el conector de pago activo es configuración por tenant.

## Pendiente de definir
- Todo el detalle de implementación: cuál conector se integra primero, manejo de webhooks de confirmación de pago, conciliación con el cierre de caja (módulo 04).
