# Documentación técnica — TPV/Gestión Comercial Universal (SaaS multi-tenant)

> **Relación con el resto de `docs/`:** esta carpeta es la arquitectura de la visión a
> futuro (convertir el CRM de Carmen T en un producto vendible a otros comercios). La
> fuente de verdad del día a día del proyecto real en producción sigue siendo
> `docs/PLAN_Y_MANUAL.md` — no reemplaza nada de ahí. Las decisiones y el checklist de
> **Fase 1** de la migración multi-tenant (la única parte de esta visión que ya está en
> ejecución sobre el proyecto real) se registran también en la bitácora de
> `PLAN_Y_MANUAL.md`, además de acá.

## Qué es este proyecto

Sistema propio de gestión comercial, control de stock y punto de venta (TPV), pensado para ser vendido como **producto SaaS multi-tenant** a distintos comercios, en distintos países (arrancando por Argentina, con España como segundo mercado objetivo).

El punto de partida es el CRM de Frutos Secos Carmen T (`docs/PLAN_Y_MANUAL.md`), que
pasa a ser el **primer tenant real** del sistema a medida que se aplica esta
arquitectura, sin interrumpir su operación diaria.

## Principio de diseño rector

> El core del sistema (ventas, stock, clientes, proveedores) es 100% universal. Todo lo que depende de un país específico —facturación fiscal, medios de pago, impuestos, formato de datos— se resuelve mediante **conectores/adaptadores intercambiables**, nunca hardcodeado en el core.

Consecuencias directas de este principio:
- El sistema **no integra ARCA/AFIP** directamente. La emisión fiscal se delega a un conector externo (proveedor homologado) por país.
- Cualquier tasa de impuesto, moneda, formato de número/fecha o medio de pago vive en configuración por tenant, no en código.

## Stack técnico

Node/Express + React + MySQL (mismo stack que el resto de los proyectos del usuario). Hosting inicial: Hostinger Business Web Hosting para validar con pocos tenants; se prevé migrar a VPS/cloud cuando el volumen lo justifique (ver `14-infraestructura-despliegue.md`).

## Módulos

| # | Módulo | Estado |
|---|--------|--------|
| 01 | Arquitectura multi-tenant | ✅ Fase 1 completa (2026-09-05, ver `01-SPEC-multi-tenant-fase1.md` y bitácora de `PLAN_Y_MANUAL.md`) |
| 02 | Productos y catálogo | En diseño |
| 03 | Stock e inventario | En diseño |
| 04 | Ventas / TPV | En diseño |
| 05 | Clientes (CRM) | Pendiente de desarrollo |
| 06 | Proveedores y compras | En diseño |
| 07 | Facturación — conectores fiscales | En diseño (decisión de fondo tomada) |
| 08 | Impuestos y configuración regional | En diseño |
| 09 | Medios de pago | Pendiente de desarrollo |
| 10 | Usuarios y permisos | En diseño |
| 11 | Reportes | En diseño |
| 12 | Suscripciones y planes (facturación del propio SaaS) | Pendiente de desarrollo |
| 13 | Cumplimiento legal (GDPR / Ley 25.326) | Pendiente de desarrollo |
| 14 | Infraestructura y despliegue | En diseño |

Cada módulo tiene su propio archivo con la misma estructura: Responsabilidad, Alcance, Decisiones ya tomadas, Modelo de datos (borrador), Dependencias, Pendiente de definir.

## Cómo mantener esta documentación

- Cuando se tome una decisión de diseño en el chat o en código, actualizar el módulo correspondiente en "Decisiones ya tomadas" y sacarla de "Pendiente de definir".
- Si un módulo nuevo aparece durante el desarrollo, se agrega un archivo numerado y se suma a esta tabla.
- Este índice es el punto de entrada; no duplicar contenido de los módulos acá.
