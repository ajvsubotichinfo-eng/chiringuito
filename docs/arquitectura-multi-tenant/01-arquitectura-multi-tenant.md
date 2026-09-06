# Módulo 01 — Arquitectura multi-tenant

## Responsabilidad
Aislar los datos y la configuración de cada comercio (tenant) que usa el sistema, garantizando que un tenant nunca pueda ver ni modificar datos de otro.

## Alcance
- Incluye: estrategia de aislamiento de datos, identificación de tenant en cada request, capa de seguridad transversal.
- No incluye: lógica de negocio de cada módulo (eso vive en su propio archivo).

## Decisiones ya tomadas
- Patrón elegido para empezar: **una sola base MySQL compartida con columna `tenant_id`** en cada tabla relevante, en lugar de schema-por-tenant.
- Motivo: schema-por-tenant es más seguro pero más caro operativamente; con pocos clientes iniciales no se justifica.
- Riesgo identificado explícitamente: un query sin el filtro de `tenant_id` expone datos de otro comercio. Por eso se requiere una capa (middleware/ORM) que inyecte el filtro automáticamente, no confiar en que cada endpoint lo recuerde a mano.

## Modelo de datos (borrador)
- Tabla `tenants`: id, nombre comercial, país, moneda, idioma, plan, estado (activo/suspendido/trial).
- Toda tabla de negocio (productos, ventas, stock, clientes, etc.) lleva `tenant_id` como FK obligatoria.

## Dependencias con otros módulos
- Todos los módulos dependen de este: cualquier tabla nueva debe respetar el aislamiento por tenant.
- Módulo 08 (impuestos/config regional) cuelga directamente de `tenants` (país, moneda, idioma).
- Módulo 12 (suscripciones/planes) determina el estado y límites del tenant.

## Pendiente de definir
- Implementación concreta de la capa de inyección automática de `tenant_id` (middleware de Express, o a nivel de ORM/query builder).
- Estrategia de migración a schema-per-tenant si el volumen de algún cliente lo justifica más adelante.
- Manejo de tenants con múltiples sucursales (¿sucursal es una entidad debajo de tenant, o un tenant en sí?).
