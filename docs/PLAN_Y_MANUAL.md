# CRM Tienda — Plan y Manual del Proyecto

**Última actualización:** 04 de septiembre de 2026
**Estado general:** ✅ Fases 1 a 4 completas (base de datos, deploy, backend y frontend con las 4 pantallas + PWA, todo con la identidad visual definitiva). Pendiente: mergear `feature/rediseno-visual` a `main` para desplegarlo, y arrancar la Fase 5 (puesta en marcha con datos y usuarios reales)
**Stack (DECISIÓN FINAL ✅):** React (frontend) + Node.js/Express (backend API) + MySQL
**Despliegue:** Web App en Hostinger, plan Business Web Hosting, conectada a GitHub (deploy automático)
**Usuarios:** Dueño + 1-2 personas

---

## 1. Objetivo del proyecto

Aplicación web a medida (usable como app en el celular vía PWA) para gestionar la tienda con foco en proveedores: comparar precios entre proveedores para el mismo producto, historial de cambios de precio, registro de pagos y control mensual de pagos por proveedor. En fases posteriores: cuenta corriente de proveedores, control de stock y ventas a clientes.

> **Historia de la decisión de stack** (para no volver a abrir el debate 😄): se evaluaron AppSheet, PHP plano, Laravel, WordPress y Node. Se eligió Node + React porque: (1) el plan Business de Hostinger soporta Web Apps de Node.js con deploy automático desde GitHub — sin SSH ni comandos para actualizar; (2) era el stack deseado originalmente; (3) el dueño no tiene experiencia técnica, así que la simplicidad de actualización pesa más que cualquier framework; (4) WordPress se descartó porque está hecho para contenido, no para lógica relacional a medida. Ver sección 6 para el detalle.

---

## 2. Arquitectura general

```
[Celular / PC: navegador]
        │
        ▼
  React (PWA) ──► API Node/Express ──► MySQL
        └──────────┬──────────┘            │
            Web App en Hostinger      Base MySQL en Hostinger
                   ▲
                   │ deploy automático
              GitHub (repositorio del código)
```

- **MySQL:** todos los datos. Incluida en el plan Business. Esquema: `crm_schema.sql` (ya generado ✅).
- **API Node/Express:** endpoints que leen/escriben la base, con login propio (JWT/sesiones), roles admin/empleado, y registro automático del historial de precios al modificar un precio.
- **React:** las pantallas, compiladas y servidas por la misma Web App. Configurada como PWA (instalable en el celular con ícono propio).
- **GitHub:** donde vive el código. Cada actualización = subir el código nuevo a GitHub → Hostinger redespliega solo.

---

## 3. Base de datos (tablas MySQL)

Archivo: `crm_schema.sql` — listo para importar en phpMyAdmin. Sirve tal cual, sin cambios, para este stack.

Resumen de tablas (detalle completo de columnas en el propio archivo SQL):

| Tabla | Rol |
|---|---|
| usuarios | Login con roles admin/empleado; cada pago y cambio de precio registra quién lo hizo |
| productos | Catálogo (nombre, categoría, código de barras, precio de venta, activo) |
| proveedores | Datos de contacto, día de visita, notas, activo |
| precios_proveedor ⭐ | Una fila por producto-proveedor con precio, unidad/bulto y cantidad por bulto (comparador de precio unitario real). UNIQUE(producto, proveedor) |
| historial_precios 📈 | Se llena automáticamente desde la API al modificar un precio: precio anterior, nuevo, fecha y usuario. Diferencia $ y % se calculan al mostrar |
| pagos | Fecha, proveedor, monto, medio de pago, comprobante (nro + foto), usuario. Filtro mensual por consultas sobre `fecha` |

Fases futuras (aún no crear): facturas_proveedor, movimientos_stock, ventas / detalle_ventas / clientes.

---

## 4. Pantallas de la app

| Pantalla | Descripción |
|---|---|
| 🔐 Login | Email + contraseña |
| 🔍 Comparador | Buscás "coca cola" → proveedores que la venden con precio, del más barato al más caro, con precio unitario calculado si venden por bulto |
| 📦 Productos | Catálogo con búsqueda; el detalle muestra proveedores/precios e historial con variación en $ y % |
| 🚚 Proveedores | Lista; el detalle muestra sus productos, precios y pagos recibidos |
| 💰 Registrar pago | Formulario rápido con foto de comprobante |
| 📊 Pagos por mes | Totales agrupados por mes y proveedor, con filtros por mes y por proveedor |
| ⚙️ Administración | Alta/baja de usuarios (solo admin) |

---

## 5. Plan de trabajo por fases

### ✅ Fase 0 — Planificación
- [x] Requisitos, arquitectura de datos, evaluación de stacks y decisión final (26/07)

### 🚧 Fase 1 — Base de datos
- [x] 1.1 Crear la base de datos y el usuario MySQL en hPanel de Hostinger
- [x] 1.2 Importar `crm_schema.sql` (crea las 6 tablas) — importado por script Node en vez de phpMyAdmin, mismo resultado
- [x] 1.3 Verificar tablas y datos de prueba
- [ ] 1.4 Confirmar pregunta abierta de moneda (sección 7)

### ⏳ Fase 2 — Preparación del despliegue
- [x] 2.1 Crear cuenta gratuita en GitHub (si no existe) y repositorio del proyecto — repo `ajvsubotichinfo-eng/chiringuito`, código subido a rama `main`
- [x] 2.2 Identificar en hPanel la sección Web Apps / Node.js y conectarla al repositorio
- [x] 2.3 Desplegar una app mínima de prueba ("Hola mundo") para validar el circuito GitHub → Hostinger antes de escribir el sistema completo
- [x] 2.4 Conectar la app de prueba a MySQL y verificar lectura de datos — con `DB_HOST=localhost` en las variables de entorno de Hostinger (ver nota en la guía de deploy)

### ⏳ Fase 3 — Backend (API Node/Express)
- [x] 3.1 Estructura del proyecto y conexión a la base
- [x] 3.2 Login con roles admin/empleado
- [x] 3.3 Endpoints de productos y proveedores (listar, crear, editar, desactivar)
- [x] 3.4 Endpoints de precios + registro automático en historial al modificar
- [x] 3.5 Endpoints de pagos + subida de foto de comprobante
- [x] 3.6 Endpoint de reportes: pagos por mes/proveedor

### ⏳ Fase 4 — Frontend (React)
*Método por pantalla: maqueta rápida en el chat → feedback/aprobación → programación.*
- [x] 4.1 Proyecto base, login y navegación
- [x] 4.2 Pantalla Comparador
- [x] 4.3 Pantallas Productos y Proveedores (con historial de precios)
- [x] 4.4 Formulario de pagos
- [x] 4.5 Dashboard de pagos por mes con filtros
- [x] 4.6 Configuración PWA (instalable en el celular)

### ⏳ Fase 5 — Puesta en marcha
- [ ] 5.1 Deploy final y dominio/subdominio definitivo
- [ ] 5.2 Crear usuarios reales y probar desde los celulares
- [ ] 5.3 Carga inicial de productos y proveedores reales
- [ ] 5.4 Semana de prueba y ajustes

### ⏳ Fases futuras
- **Fase 6 — Cuenta corriente proveedores:** facturas, saldo (facturas − pagos), vencimientos con avisos.
- **Fase 7 — Control de stock:** movimientos, stock actual, alerta de mínimos, escaneo de código de barras.
- **Fase 8 — Ventas a clientes:** registro de ventas, descuento de stock, reportes, fiado.

### 💡 Backlog de ideas
- [ ] Margen de ganancia por producto (precio venta vs. mejor precio de compra) con alerta de margen bajo
- [ ] Ranking de aumentos: qué proveedor aumenta más seguido y en mayor %
- [ ] Gráfico de evolución de precio por producto/proveedor
- [ ] Lista de pedido sugerida por proveedor más barato
- [ ] Exportar resumen mensual de pagos a Excel/PDF para el contador
- [ ] Backup automático de la base de datos
- [ ] Web pública de la tienda (si algún día se quiere, ahí sí WordPress/WooCommerce en el dominio principal, conviviendo con el CRM en un subdominio)

---

## 6. Decisiones tomadas

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-07-22 | Tabla separada precios_proveedor | Un producto con N proveedores y N precios (requisito del comparador) |
| 2026-07-22 | Historial de precios automático desde el inicio | Comparar costo anterior vs. actual en cada reposición |
| 2026-07-26 | App a medida en vez de AppSheet | Hosting ya contratado; código 100% generado por Claude; sin suscripción extra |
| 2026-07-26 | Descartado PHP plano | Poca estructura para un proyecto que crecerá (fases 6-8) |
| 2026-07-26 | Descartado Laravel | Sus ventajas requieren experiencia previa que el dueño no tiene; su despliegue exige SSH/terminal en cada actualización |
| 2026-07-26 | Descartado WordPress | Hecho para contenido, no para lógica relacional a medida; requeriría pila de plugins frágil y aun así código custom |
| 2026-07-26 | ✅ FINAL: Node/Express + React + MySQL como Web App | El plan Business soporta Web Apps Node con deploy automático desde GitHub: actualizar la app no requiere terminal ni SSH. Stack deseado originalmente |
| 2026-07-26 | Frontend en React (no Angular) | Más simple y adecuado para el tamaño del proyecto |
| 2026-07-26 | Fase 2 dedicada a validar el circuito de deploy con app mínima | Detectar problemas de infraestructura antes de escribir el sistema completo |
| 2026-07-26 | Diseño visual iterativo, sin mockups formales previos | Herramienta interna de 2-3 usuarios: el diseño de datos/pantallas ya está cerrado (secciones 3-4); lo visual se valida con una maqueta rápida en el chat antes de programar cada pantalla y se ajusta con el uso real. Criterios fijos: mobile-first, botones grandes, navegación simple |
| 2026-09-04 | ✅ Identidad visual definida: estilo "fintech" — índigo profundo (**`#01006C`**, ajustado el 04/09 tras ver la maqueta; el primer borrador usaba `#3B3AC4`) como color principal, fondo gris muy claro, tarjetas blancas muy redondeadas con sombra suave, títulos en mayúsculas espaciadas, números grandes, íconos de línea (SVG, no emojis), tipografía Montserrat. Navegación flotante tipo píldora abajo en celular; panel lateral en computadora/tablet horizontal. El login vive en una tarjeta índigo (no pantalla entera) sobre el fondo gris | El dueño pidió un diseño atractivo y pasó una referencia de app bancaria. Se aprobó sobre una maqueta visual, con dos rondas de ajustes (color, tamaños, tarjeta) viendo capturas reales en el celular y en 1920x1080. Toda pantalla nueva se programa siguiendo este estilo (los estilos base están en `frontend/src/index.css` y `App.css`) |
| 2026-09-04 | La app debe usarse desde cualquier dispositivo (celular, tablet, computadora) | Pedido explícito del dueño. Es una sola app que se adapta al ancho de pantalla (corte en 900px): abajo de eso, disposición de celular; arriba, navegación lateral y contenido en columnas |
| 2026-09-05 | Un pago se puede cargar con varios medios de pago a la vez (ej: $300 efectivo + $700 transferencia), guardados como filas separadas en `pagos` con la misma fecha/proveedor/comprobante — **sin** crear todavía una tabla de facturas | El dueño necesita registrar pagos parciales en distintos medios para una misma compra. Adelantar la cuenta corriente de proveedores (facturas, saldo) es la Fase 6, fuera de alcance por ahora; se resuelve con una mejora de UI nada más, sin tocar el esquema de la base. Si en el futuro hace falta saber cuánto se debe por factura, ahí sí conviene construir Fase 6 |

---

## 7. Preguntas abiertas

- ¿Moneda única (ARS) o más de una? *(Se asume una sola; confirmar en Fase 1.4.)*
- Dominio: ¿la app vivirá en el dominio principal o en un subdominio tipo `crm.tudominio.com`? (Se define en Fase 5.1)

---

## 8. Manual de operaciones

- **¿Dónde vive todo?** Código en GitHub; app y base de datos en Hostinger (hpanel.hostinger.com).
- **Credenciales de la base:** anotarlas en un lugar seguro al crearla (Fase 1.1): nombre de base, usuario, contraseña. *Nunca compartirlas en el chat ni subirlas a GitHub* (irán en variables de entorno de la Web App; se documentará en Fase 2).
- **Cómo actualizar la app (flujo normal):** Claude entrega el código nuevo → se sube al repositorio de GitHub (desde la web de GitHub, sin terminal) → Hostinger redespliega automáticamente. *(Guía paso a paso con capturas se completará en Fase 2.)*
- **Backups:** el plan Business incluye backups diarios. Además, exportar la base desde phpMyAdmin una vez por mes (pestaña Exportar → Continuar; guardar el archivo .sql).

---

## 9. Bitácora

| Fecha | Qué se hizo |
|---|---|
| 2026-07-22 | Plan completo, arquitectura de datos y fases (versión AppSheet inicial) |
| 2026-07-22 | Se sumó historial de precios al alcance inicial |
| 2026-07-26 | Migración a app a medida; esquema SQL generado (`crm_schema.sql`) |
| 2026-07-26 | Evaluación de PHP/Laravel/WordPress/Node → **decisión final: Node + React + MySQL como Web App con deploy vía GitHub**. Documento reescrito con plan en 5 fases + futuras |
| 2026-07-26 | **Proyecto creado** para `C:\programacion\enlaweb-tech\frutos-secos-carmen-t`: app mínima de Fase 2 (Express + endpoints /api/health y /api/db-test + página de prueba), probada y funcionando. Documentación integrada al repositorio (`README.md` + carpeta `docs/` con este plan, guía de instalación local y guía de deploy). Este documento pasa a vivir en `docs/PLAN_Y_MANUAL.md` dentro del proyecto. Próximos pasos: Fase 1.1 (crear base en hPanel) y Fase 2.1 (cuenta GitHub) |
| 2026-09-04 | Validación local completada: `npm install` y `npm start` funcionaron; el endpoint `/api/health` responde correctamente. El endpoint `/api/db-test` confirma que falta la configuración real de MySQL (`ECONNREFUSED`), por lo que el siguiente bloqueo es crear la base en Hostinger y completar `.env` con credenciales reales antes de continuar con la conexión a la base. |
| 2026-09-04 | `.env` completado con credenciales reales de Hostinger. Se probó `/api/db-test`: la conexión a MySQL funciona (host, usuario y contraseña correctos), pero devuelve `ER_NO_SUCH_TABLE` porque todavía no se importó `crm_schema.sql`. Fase 1.1 completada. Próximo paso: Fase 1.2 (importar el esquema en phpMyAdmin). |
| 2026-09-04 | `crm_schema.sql` importado en la base real de Hostinger (script Node temporal en vez de phpMyAdmin, mismo resultado: 6 tablas + datos de prueba). `/api/db-test` confirma `productos_cargados: 3`. Fase 1 completa. Falta solo confirmar la pregunta abierta de moneda (1.4, sección 7). |
| 2026-09-04 | Repositorio Git local inicializado y primer commit hecho (`.env` correctamente excluido). Falta crear el repositorio remoto en GitHub (Fase 2.1) — requiere la cuenta de GitHub del dueño, no se puede hacer sin acceso; `gh` CLI no está instalado en esta máquina. |
| 2026-09-04 | Dueño creó el repositorio `ajvsubotichinfo-eng/chiringuito` en GitHub. Se agregó como remoto (`origin`), se renombró la rama local a `main` (para coincidir con la config de Hostinger) y se subió el primer commit con `git push -u origin main`. Fase 2.1 completa. Próximo paso: Fase 2.2 (conectar la Web App de Hostinger a este repositorio desde hPanel). |
| 2026-09-04 | Dueño conectó la Web App de Hostinger al repositorio y cargó las variables de entorno. Primer intento dio `ER_ACCESS_DENIED_ERROR` en `/api/db-test` porque usó la IP externa de la base (la del `.env` local) como `DB_HOST`. Se corrigió a `DB_HOST=localhost` (la Web App corre en el mismo servidor que la base) y la conexión funcionó. Se corrigió `docs/GUIA_DEPLOY_HOSTINGER.md` para aclarar esta diferencia. **Fases 1 y 2 completas.** Próximo paso: Fase 3 (backend: estructura, login, endpoints). |
| 2026-09-04 | Fase 3.1 y 3.2: login con roles. Se agregó `bcryptjs` y `jsonwebtoken`; middleware `requiereLogin`/`requiereAdmin` (`src/middleware/autenticacion.js`) y ruta `POST /api/login` + `GET /api/perfil` (`src/rutas/auth.js`). Se creó el primer usuario admin (`admin@enlawebtech.local`) en la base real, con contraseña hasheada. Probado en local: login correcto, rechazo con contraseña incorrecta, ruta protegida con y sin token. |
| 2026-09-04 | Fase 3.3: endpoints de productos y proveedores (`src/rutas/productos.js`, `src/rutas/proveedores.js`) — listar con búsqueda, detalle, crear, editar/desactivar. Probados contra la base real (y los datos de prueba usados para probar se revirtieron). |
| 2026-09-04 | Fase 3.4: endpoints de precios (`src/rutas/precios.js`) — comparador por producto con precio unitario real (soporta venta por bulto), edición de precio con registro automático en `historial_precios` (solo si el precio cambió), consulta de historial con diferencia en $ y %. Probado: comparador ordena bien, historial se crea al cambiar precio y no se duplica si no cambia. |
| 2026-09-04 | Fase 3.5: endpoints de pagos (`src/rutas/pagos.js`) con subida de foto de comprobante (`multer`, guardado en `public/uploads/comprobantes/`, carpeta excluida de git salvo `.gitkeep`). Listar con filtros por proveedor y por mes. Probado con una imagen de prueba (subida y datos de prueba revertidos después). |
| 2026-09-04 | Fase 3.6: endpoint de reportes (`src/rutas/reportes.js`) — `GET /api/reportes/pagos-por-mes`, total y cantidad de pagos agrupados por mes y proveedor, con filtros opcionales por mes y por proveedor. **Fase 3 (backend) completa.** Próximo paso: Fase 4 (frontend React) — empezar por la maqueta de la pantalla de Login para aprobación del dueño. |
| 2026-09-04 | Fase 4.1: maqueta de Login + navegación inferior aprobada por el dueño. Se creó `frontend/` (React + Vite + react-router-dom), compilando directo a `/public` (`npm run build:frontend` desde la raíz). Se armó: login funcional contra `/api/login`, contexto de sesión (token en localStorage), rutas protegidas, layout con encabezado + navegación inferior (Buscar/Productos/Proveedores/Pagos), y pantallas placeholder "Próximamente" para las secciones que faltan. **Importante:** las fotos de comprobantes (`uploads/comprobantes/`) se movieron fuera de `/public` a un directorio propio en la raíz, porque el build de React vacía `/public` en cada compilación (`emptyOutDir`) y hubiera borrado las fotos ya subidas en cada deploy. `server.js` ahora sirve `/uploads` como un estático aparte. Probado de punta a punta en el navegador (playwright-cli): login correcto, error con contraseña incorrecta, navegación, y logout — todo verificado con capturas de pantalla en escritorio y en tamaño celular. |
| 2026-09-04 | Ajuste al login (pedido del dueño, antes de arrancar 4.2): switch "Mantenerme conectado 30 días" pensado para cuando se usa desde una computadora personal. `POST /api/login` acepta `recordarme`; si es `true` el token JWT dura 30 días en vez de las 12 horas por defecto. Frontend: checkbox en el Login, y `api.js` ahora redirige solo a `/login` si el token vence (antes dejaba la pantalla colgada con datos viejos). Probado: token de 12h sin el switch, 30 días marcándolo, confirmado tanto en la respuesta del backend como en el token guardado tras loguearse desde el navegador. |
| 2026-09-04 | Fase 4.2: pantalla Comparador (`frontend/src/paginas/Comparador.jsx`) — buscador de producto con sugerencias mientras se escribe (debounce 300ms contra `GET /api/productos?q=`), y al elegir uno muestra los proveedores que lo venden ordenados del más barato al más caro (`GET /api/precios/comparar/:id`), con medallas 🥇🥈🥉 para el top 3 y precio unitario real aclarando cuando el proveedor vende por bulto. Se agregó `frontend/src/utils.js` con `formatearPesos()` (Intl, pesos sin decimales) para reusar en las próximas pantallas. **Fase 4.2 completa.** Próximo paso: Fase 4.3 (pantallas Productos y Proveedores con historial de precios) — empezar por la maqueta para aprobación del dueño. |
| 2026-09-04 | **Rediseño visual** (rama `feature/rediseno-visual`). El dueño pidió un diseño atractivo e innovador y pasó una referencia de app bancaria; se armó una maqueta visual de 4 pantallas (Login, Comparador y Pagos en celular, Comparador en computadora), se ajustó y se aprobó (ver decisión en sección 6). Aplicado a la app: estilos base nuevos (`index.css`, `App.css`), íconos SVG de línea (`componentes/Iconos.jsx`) en lugar de emojis, `Navegacion.jsx` reemplaza a `NavegacionInferior.jsx` (un solo componente: píldora flotante en celular, panel lateral en computadora), Login en fondo índigo, Comparador con el más barato destacado, barra de precio relativo e insignia "Mejor precio" / "+X%", pantallas placeholder en el estilo nuevo, favicon "FS" (se fue el 404 del favicon), Montserrat vía Google Fonts. A pedido del dueño la app se adapta a cualquier dispositivo (corte en 900px). Probado en el navegador en 390px y 1440px con capturas: login, comparador con producto elegido y navegación. |
| 2026-09-04 | Correcciones al login (feedback del dueño viendo la maqueta en el celular): color principal cambiado a `#01006C` en toda la app, título más chico para que no se corte en pantallas angostas, mensaje de error en rojo sólido (antes se mezclaba con el fondo índigo), inputs redondeados con relleno, y checkbox "Mantenerme conectado" con estilo propio (antes se veía sin formato). |
| 2026-09-04 | Segunda corrección al login: el formulario pasa de "pantalla entera índigo" a vivir dentro de una tarjeta índigo redondeada (como las tarjetas destacadas del comparador) sobre el fondo gris claro del resto de la app; los inputs pasan a fondo claro con texto oscuro. Tarjeta y tipografía más grandes en pantallas de 900px+ (el dueño reportó letras chicas en 1920x1080). |
| 2026-09-04 | Fase 4.3: pantallas Productos y Proveedores, maqueta aprobada por el dueño. Se agregó al backend `GET /api/precios/proveedor/:id` (productos que vende un proveedor, con precio) para la pantalla de detalle de Proveedores. Frontend: `Productos.jsx`/`Proveedores.jsx` (lista con búsqueda + botón flotante "Nuevo"), `ProductoFormulario.jsx`/`ProveedorFormulario.jsx` (crear/editar, comparten estilo de formulario nuevo en `App.css`), `ProductoDetalle.jsx` (proveedores/precios con la tarjeta del comparador + historial con variación en $/%, y un formulario chico — `componentes/FormularioPrecio.jsx` — para cargar o editar el precio de un proveedor sin salir de la pantalla), `ProveedorDetalle.jsx` (productos que vende + pagos recientes). **Bug encontrado y corregido:** el servidor no tenía una ruta "catch-all", así que escribir una URL interna directo (ej. `/productos`) o refrescar la página daba 404; ahora cualquier ruta que no sea `/api` devuelve `index.html` (`app.get('*', ...)` en `server.js`), como corresponde a una SPA. Probado de punta a punta en el navegador: crear producto, agregar precio de proveedor, editar precio (con historial actualizándose solo), editar proveedor, navegar directo por URL — sin errores de consola. **Fase 4.3 completa.** Próximo paso: Fase 4.4 (formulario de pagos) — maqueta para aprobación del dueño. |
| 2026-09-05 | Fase 4.4: pantalla de Pagos, maqueta aprobada con un ajuste importante del dueño (ver decisión en sección 6): un pago se puede cargar en varios medios de pago a la vez. `Pagos.jsx` (lista de pagos recientes con link "ver comprobante" + botón flotante "Registrar pago") y `PagoFormulario.jsx` (proveedor, fecha, N° de comprobante, notas, foto opcional, y una lista de líneas repetibles de "medio de pago + monto" con total calculado — cada línea se manda como un `POST /api/pagos` aparte, todas con los mismos datos generales y la misma foto). Se borró `PantallaProximamente.jsx`, ya sin uso (las 4 pantallas de la navegación están completas). Probado en el navegador: pago con dos medios ($300 transferencia + $700 efectivo) con foto, ambos quedan como filas separadas en la lista — sin errores de consola. **Fase 4.4 completa y Fase 4 (frontend) prácticamente terminada** — solo falta 4.5 (dashboard de pagos por mes con filtros) y 4.6 (PWA). |
| 2026-09-05 | Fase 4.5: dashboard de pagos por mes, como pestaña "Por mes" dentro de la pantalla Pagos (`PagosPorMes.jsx`) — tarjeta con el total del mes elegido, filtros de mes y proveedor, y el detalle agrupado por proveedor (`GET /api/reportes/pagos-por-mes`, ya hecho en la Fase 3.6). Probado con datos reales: julio 2026 da $235.500 en 2 pagos a 2 proveedores, coincide exacto; el filtro por proveedor también funciona. |
| 2026-09-05 | Fase 4.6: configuración PWA — `frontend/public/manifest.webmanifest` (nombre, íconos, color de tema `#01006C`, `display: standalone`) y un service worker mínimo (`public/sw.js`, cachea los archivos de la app pero nunca `/api/` ni `/uploads/`, que siempre necesitan la base real). Se generaron los íconos (192, 512, 512 maskable, apple-touch-icon) con el monograma "FS" ya usado en la app. Se corrigió de paso el `theme-color` del `index.html`, que había quedado con el color índigo viejo (`#3B3AC4`) después del cambio de paleta. Probado: manifest e íconos responden bien, el service worker queda "activated" sin errores de consola. **Fase 4 (frontend) completa.** Con esto está el MVP completo de la Fase 4; falta mergear `feature/rediseno-visual` a `main` para probarlo en producción (Fase 5). |
| 2026-09-05 | `feature/rediseno-visual` mergeada a `main` y subida — Hostinger redesplegó con el MVP completo (login, Comparador, Productos, Proveedores, Pagos, PWA). **Bug encontrado en producción:** el login daba error con credenciales correctas. Causa: `JWT_SECRET` nunca se agregó a las variables de entorno de la Web App en Hostinger — se sumó al `.env` local recién en la Fase 3.2, después de escribir la guía de deploy (Fase 2), y la guía nunca se actualizó para incluirla. Sin esa variable, el servidor no puede firmar el token de sesión. Se corrigió `docs/GUIA_DEPLOY_HOSTINGER.md` para incluir `JWT_SECRET` en la tabla de variables, y se le pasó al dueño una clave para cargar en hPanel. |
