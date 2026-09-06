# Módulo 13 — Cumplimiento legal (protección de datos)

## Responsabilidad
Cumplir con la normativa de protección de datos personales de cada país donde el producto se vende, ya que el SaaS almacena datos de los clientes finales de cada tenant (no solo del tenant mismo).

## Alcance
- Incluye: base legal de tratamiento de datos, derechos de los titulares, acuerdos con los tenants.
- No incluye: cumplimiento fiscal (eso es el módulo 07).

## Decisiones ya tomadas
- Identificado que operar en España/UE implica **GDPR**, mientras que Argentina tiene su propia **Ley 25.326** de protección de datos personales — son marcos distintos y ambos aplican según el país del tenant/usuario final.
- Se marca explícitamente como **no bloqueante para el MVP**, pero sí como algo a resolver antes de facturar a un cliente real en España/UE (posible necesidad de un acuerdo de encargado de tratamiento con cada tenant).

## Modelo de datos (borrador)
Sin modelo de datos propio por ahora; impacta principalmente en políticas de retención/borrado sobre las tablas de `clientes` (módulo 05) y `usuarios` (módulo 10).

## Dependencias con otros módulos
- Módulo 01 (multi-tenant): el país del tenant determina qué marco legal aplica.
- Módulo 05 (clientes): datos personales de clientes finales, sujetos a derecho de acceso/olvido.

## Pendiente de definir
- Todo el detalle: política de retención y borrado, texto de acuerdo de encargado de tratamiento (DPA) para tenants europeos, proceso ante una solicitud de un titular de datos.
