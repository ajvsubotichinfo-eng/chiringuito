# CRM Frutos Secos Carmen T

CRM interno de tienda: productos, proveedores, comparador de precios entre
proveedores, historial de cambios de precio, y registro/reporte de pagos.
Usuarios finales: el dueño + 1-2 empleados, principalmente desde el celular.

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

## Stack y despliegue

- Node.js/Express (backend) + React (frontend) + MySQL. Sin frameworks
  adicionales de backend (no Laravel, no Nest): Express plano.
- Deploy: Web App Node.js en Hostinger plan Business, conectada a GitHub
  (rama `main`). Ver `docs/GUIA_DEPLOY_HOSTINGER.md`.
- La app React compilada se sirve desde `public/` por el propio Express.

## Comandos

- `npm install` — instalar dependencias
- `npm start` — servidor en http://localhost:3000
- `npm run dev` — con recarga automática

## Convenciones del proyecto

- **Todo en español:** comentarios del código, mensajes de la API, textos de
  UI, commits y documentación. El dueño no es programador y necesita poder
  leer el código; comentar cada bloque explicando qué hace.
- Frontend mobile-first: botones grandes, navegación simple (se usa en el
  mostrador de la tienda). Antes de programar una pantalla nueva, proponer
  una maqueta y esperar aprobación del dueño.
- Moneda única, sin decimales raros: usar DECIMAL(12,2) en base y formateo
  de pesos en UI.
- El historial de precios (`historial_precios`) se registra SIEMPRE desde el
  backend al modificar `precios_proveedor.precio_compra` — nunca depende del
  frontend.

## Seguridad

- Credenciales solo en `.env` (local) o variables de entorno de Hostinger
  (producción). NUNCA hardcodear ni commitear credenciales; `.env` está en
  `.gitignore` y debe seguir ahí.
- Contraseñas de usuarios: siempre hasheadas (bcrypt), jamás en texto plano.
