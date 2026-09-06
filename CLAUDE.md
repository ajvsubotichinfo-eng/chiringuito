# CRM Frutos Secos Carmen T

CRM interno de tienda: productos, proveedores, comparador de precios entre
proveedores, historial de cambios de precio, registro/reporte de pagos e
ingresos. Usuarios finales: el dueño + 1-2 empleados, principalmente desde el
celular. **Está en producción y en uso real** — cualquier cambio a datos o
esquema debe asumir que hay información real de la tienda cargada.

Este mismo proyecto es además el punto de partida de una visión más grande:
convertirlo en un producto SaaS multi-tenant vendible a otros comercios (ver
"Iniciativa multi-tenant" más abajo). Las dos cosas conviven en este repo; no
te confundas de capa antes de tocar código.

## Fuente de verdad del proyecto

- **Antes de construir o cambiar cualquier cosa, leé `docs/PLAN_Y_MANUAL.md`.**
  Ahí están: el plan por fases, qué está hecho y qué falta, la arquitectura,
  las pantallas y las decisiones ya tomadas (sección 6). No reabrir decisiones
  cerradas (stack, estructura de tablas) sin consultarlo con el dueño.
- El esquema de la base es `docs/crm_schema.sql`. Si un cambio requiere tocar
  tablas, actualizar también ese archivo.
- **Después de completar una tarea:** actualizar `docs/PLAN_Y_MANUAL.md` —
  marcar el checkbox de la fase correspondiente, y agregar una fila a la
  bitácora (sección 9) con fecha y qué se hizo.

## Iniciativa multi-tenant (visión SaaS a futuro)

- Documentación completa en `docs/arquitectura-multi-tenant/` — empezar por
  `00-INDICE.md`. Ahí vive la arquitectura de cada módulo futuro (catálogo,
  stock, TPV, facturación por conectores fiscales, impuestos, medios de pago,
  usuarios/permisos, reportes, planes SaaS, cumplimiento legal,
  infraestructura), con sus decisiones y pendientes.
- **No reemplaza a `docs/PLAN_Y_MANUAL.md`.** El plan operativo manda para el
  día a día de la tienda; esta carpeta es la capa de arquitectura que se va
  agregando en paralelo, sin romper lo que ya funciona en producción.
- Lo único de esta visión ya implementado sobre el proyecto real es la
  **Fase 1 del módulo 01** (2026-09-05): existe la tabla `tenants` con un
  único tenant real, y todas las tablas de negocio tienen `tenant_id`
  NOT NULL + FK. El backend todavía no resuelve el tenant por request: usa
  la constante `TENANT_ID_ACTUAL` de `src/config/tenant.js` en cada INSERT.
  Cualquier INSERT nuevo a una tabla de negocio debe incluir `tenant_id`
  usando esa constante. Cualquier otro módulo de esa carpeta es diseño a
  futuro, no algo para implementar salvo pedido explícito del dueño.
- Principio rector de esa visión: el core (ventas, stock, clientes,
  proveedores) es universal; todo lo que depende de un país (facturación
  fiscal, impuestos, medios de pago) se resuelve con conectores/adaptadores
  configurables por tenant, nunca hardcodeado.

## Stack y despliegue

- Node.js/Express (backend) + React (frontend) + MySQL. Sin frameworks
  adicionales de backend (no Laravel, no Nest): Express plano.
- Deploy: Web App Node.js en Hostinger plan Business, conectada a GitHub
  (rama `main`). Ver `docs/GUIA_DEPLOY_HOSTINGER.md`.
- La app React compilada se sirve desde `public/` por el propio Express.
- Instalación local paso a paso: `docs/GUIA_INSTALACION_LOCAL.md`.

## Comandos

- `npm install` — instalar dependencias
- `npm start` — servidor en http://localhost:3000
- `npm run dev` — con recarga automática
- `npm run build:frontend` (desde la raíz) — compila el frontend React a `public/`

## Convenciones del proyecto

- **Todo en español:** comentarios del código, mensajes de la API, textos de
  UI, commits y documentación. El dueño no es programador y necesita poder
  leer el código; comentar cada bloque explicando qué hace.
- Frontend mobile-first: botones grandes, navegación simple (se usa en el
  mostrador de la tienda). Antes de programar una pantalla nueva, proponer
  una maqueta y esperar aprobación del dueño.
- Identidad visual ya definida (índigo `#01006C`, tarjetas redondeadas,
  Montserrat, íconos de línea SVG) — ver decisión del 2026-09-04 en
  `docs/PLAN_Y_MANUAL.md` sección 6 antes de proponer cambios visuales.
- Una sola moneda activa a la vez por tienda, configurable por el admin
  (pantalla Configuración, código ISO 4217) — no hardcodear "$" ni "ARS"; usar
  `formatearMonto()` del `ConfiguracionContext`. DECIMAL(12,2) en base.
- El historial de precios (`historial_precios`) se registra SIEMPRE desde el
  backend al modificar `precios_proveedor.precio_compra` — nunca depende del
  frontend.
- Toda tabla de negocio nueva debe evaluarse contra la iniciativa
  multi-tenant: si el módulo 01 (ver arriba) ya está en curso o completo
  cuando la crees, incluí `tenant_id` desde el `CREATE TABLE` inicial.

## Seguridad

- Credenciales solo en `.env` (local) o variables de entorno de Hostinger
  (producción). NUNCA hardcodear ni commitear credenciales; `.env` está en
  `.gitignore` y debe seguir ahí.
- Contraseñas de usuarios: siempre hasheadas (bcrypt), jamás en texto plano.
