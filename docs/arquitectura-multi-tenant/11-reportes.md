# Módulo 11 — Reportes

## Responsabilidad
Convertir los datos operativos de ventas y stock en información accionable para el dueño del comercio (tenant).

## Alcance
- Incluye: reportes de caja, ventas y stock.
- No incluye: reportes propios del negocio SaaS (eso es el módulo 12).

## Decisiones ya tomadas
- Reportes mínimos identificados: cierre de caja diario, ventas por producto/período, alertas de stock bajo, y productos por vencer (cuando el tenant usa lotes con vencimiento).

## Modelo de datos (borrador)
Este módulo consume datos de otros (no tiene tablas propias necesariamente, salvo configuración de alertas):
- `alertas_config`: tenant_id, tipo (stock_bajo/vencimiento), umbral.

## Dependencias con otros módulos
- Módulo 03 (stock): base de las alertas de stock bajo y vencimientos.
- Módulo 04 (ventas): base del cierre de caja y ventas por producto/período.

## Pendiente de definir
- Formato de entrega (dashboard en la app, export a Excel/PDF, envío por email).
- Nivel de personalización de reportes por tenant.
