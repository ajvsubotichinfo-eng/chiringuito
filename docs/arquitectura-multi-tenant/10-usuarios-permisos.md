# Módulo 10 — Usuarios y permisos

## Responsabilidad
Controlar quién puede hacer qué dentro de cada tenant, y dejar registro de las acciones sensibles.

## Alcance
- Incluye: roles, permisos, autenticación, auditoría de acciones críticas.
- No incluye: gestión de usuarios del propio equipo del SaaS (eso sería administración interna, fuera de este módulo).

## Decisiones ya tomadas
- Roles diferenciados como mínimo entre **cajero** y **administrador**.
- **Auditoría obligatoria** de acciones sensibles: quién anuló una venta, quién cambió un precio, etc.

## Modelo de datos (borrador)
- `usuarios`: id, tenant_id, nombre, rol, credenciales.
- `roles_permisos`: rol, acción permitida (ej. anular_venta, editar_precio, abrir_caja).
- `auditoria_log`: id, tenant_id, usuario_id, acción, entidad_afectada, fecha, detalle.

## Dependencias con otros módulos
- Transversal: módulos 04 (ventas/caja), 02 (productos/precios) y 06 (compras) consultan permisos antes de acciones sensibles y escriben en el log de auditoría.
- Módulo 01 (multi-tenant): los usuarios pertenecen a un tenant específico.

## Pendiente de definir
- Modelo de roles y permisos concreto (¿roles fijos o permisos granulares configurables por tenant?).
- Política de autenticación (email/contraseña, 2FA, SSO para planes más avanzados).
