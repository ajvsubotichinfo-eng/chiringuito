# Módulo 12 — Suscripciones y planes (facturación del propio SaaS)

## Responsabilidad
Gestionar el negocio del SaaS en sí: qué plan tiene cada tenant, sus límites, y el cobro periódico al comercio cliente (no confundir con la facturación fiscal del módulo 07, que es la del comercio hacia sus propios clientes).

## Alcance
- Incluye: planes, límites por plan, trial, cobro recurrente al tenant.
- No incluye: facturación fiscal de las ventas del tenant (módulo 07).

## Decisiones ya tomadas
Ninguna todavía — módulo identificado como necesario para que el producto sea vendible, pero sin diseño concreto aún.

## Modelo de datos (borrador)
- `planes`: id, nombre, límites (usuarios, sucursales, productos), precio.
- `suscripciones`: tenant_id, plan_id, estado (trial/activa/vencida/cancelada), fecha_inicio, próxima_fecha_cobro.

## Dependencias con otros módulos
- Módulo 01 (multi-tenant): el estado de la suscripción determina si el tenant puede operar.
- Módulo 09 (medios de pago) o un procesador de pagos internacional (ej. Stripe) para cobrar la suscripción misma.

## Pendiente de definir
- Todo: estructura de planes y precios, procesador de pagos para cobrar a los tenants, manejo de mora/suspensión.
