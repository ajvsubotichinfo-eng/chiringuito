# Módulo 08 — Impuestos y configuración regional

## Responsabilidad
Centralizar todo lo que varía según el país/idioma del tenant, para que ningún otro módulo tenga valores regionales hardcodeados.

## Alcance
- Incluye: tasas de impuesto, moneda, idioma, formato de número/fecha, numeración de comprobantes.
- No incluye: la emisión fiscal en sí (módulo 07).

## Decisiones ya tomadas
- Tasas de impuesto **configurables por tenant/país**, nunca hardcodeadas en el código (ej. no escribir "IVA 21%" fijo en ningún lado).
- Definir si el precio se maneja con impuesto incluido o no incluido, según la convención de cada país/tenant.
- **Numeración de comprobantes configurable por tenant**, porque cada país (y cada proveedor fiscal del módulo 07) tiene sus propias reglas de series/numeración.
- **i18n completo de la interfaz** (sin strings de UI hardcodeados en un solo idioma).
- Moneda y formato de número/fecha configurables por tenant (coma vs. punto decimal, símbolo de moneda antes/después del número).

## Modelo de datos (borrador)
- `configuracion_regional` (por tenant): país, idioma, moneda, formato_numero, formato_fecha.
- `tasas_impuesto`: id, tenant_id, nombre (ej. "IVA general"), porcentaje, vigencia_desde.
- `series_numeracion`: id, tenant_id, tipo_comprobante, prefijo, número_actual.

## Dependencias con otros módulos
- Módulo 01 (multi-tenant): esta configuración cuelga directamente de la tabla `tenants`.
- Módulo 02 (productos): cada producto referencia una tasa de impuesto.
- Módulo 04 (ventas) y 07 (facturación): usan esta configuración para calcular totales y numerar comprobantes.

## Pendiente de definir
- Catálogo inicial de países/tasas soportadas (arrancar con Argentina y España, dejar el modelo abierto a sumar más).
- Manejo de cambios de tasa en el tiempo (vigencia) sin romper comprobantes ya emitidos con la tasa anterior.
