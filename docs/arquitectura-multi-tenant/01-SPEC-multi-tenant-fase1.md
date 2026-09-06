# SPEC — Módulo 01: Arquitectura multi-tenant — Fase 1 (migración del proyecto actual)

> Este documento es la spec ejecutable de esta iteración. El archivo `01-arquitectura-multi-tenant.md` explica el *por qué*; este explica el *qué exacto* y *cómo se verifica*. Está pensado para dárselo a Claude Code (u otra IA) como contrato de implementación.

## Objetivo de esta iteración (fase 1)

Introducir el concepto de tenant en el esquema de base de datos existente del proyecto Frutos Secos Carmen T, con **un único tenant real**, sin romper ninguna funcionalidad ya construida.

## Explícitamente fuera de alcance en esta fase

- Capa de inyección automática de `tenant_id` en cada query (middleware/ORM). Con un solo tenant no hay riesgo de fuga de datos todavía; se aborda en fase 2, antes de sumar un segundo tenant real.
- Multi-schema o base de datos separada por tenant.
- Cualquier UI para que un tenant administre su propia configuración (eso es un módulo aparte, más adelante).
- Módulos 12 (suscripciones) y 13 (cumplimiento legal): no se tocan en esta fase.

## Requisitos funcionales

**RF-01 — Tabla `tenants`**
Existe una tabla `tenants` con, como mínimo, las columnas:
| Columna | Tipo | Restricción |
|---|---|---|
| `id` | INT o UUID | PK |
| `nombre_comercial` | VARCHAR(255) | NOT NULL |
| `pais` | CHAR(2) | NOT NULL (código ISO, ej. `ES`) |
| `moneda` | CHAR(3) | NOT NULL (código ISO, ej. `EURO`) |
| `idioma` | VARCHAR(10) | NOT NULL (ej. `es-ES`) |
| `estado` | ENUM('activo','inactivo') | NOT NULL, default `activo` |
| `created_at` | DATETIME | NOT NULL, default now |

**RF-02 — Alta del tenant inicial**
Se inserta exactamente un registro: Frutos Secos Carmen T, país `ES`, moneda `EURO`, idioma `es-ES`, estado `activo`.

**RF-03 — Columna `tenant_id` en tablas existentes**
Cada una de las siguientes tablas de `docs/crm_schema.sql` recibe una columna `tenant_id`
(INT UNSIGNED, FK → `tenants.id`, NOT NULL — ver Pendiente de completar sobre el tipo):
- `usuarios`
- `productos`
- `proveedores`
- `precios_proveedor`
- `historial_precios`
- `pagos`
- `ingresos`
- `configuracion` — caso especial: hoy la PK es solo `clave` (par clave/valor global). Con
  multi-tenant, la clave deja de ser única por sí sola: la PK pasa a ser compuesta
  `(tenant_id, clave)`. Requiere ajustar la PK, no solo agregar la columna.

Tablas de aplicación que **no** son de negocio y quedan fuera de RF-03 (no representan
datos de un tenant): ninguna otra existe hoy en el esquema.

**RF-04 — Migración de datos existentes**
Después de aplicar RF-03, ningún registro de las tablas listadas tiene `tenant_id` nulo: todos quedan asociados al id del tenant creado en RF-02.

**RF-05 — Regla para tablas futuras**
Toda tabla de negocio que se cree de ahora en más debe incluir `tenant_id` desde su creación (regla de desarrollo — se valida por revisión de PR/checklist, no por test automático).

## Criterios de aceptación (Given-When-Then)

**RF-01 / RF-02**
- Given la base de datos migrada, When se consulta `SELECT * FROM tenants`, Then existe exactamente un registro con `nombre_comercial = 'Frutos Secos Carmen T'`, `pais = 'ES'`, `moneda = 'EURO'`.

**RF-03 / RF-04**
- Given cualquier tabla de negocio existente, When se ejecuta `SELECT COUNT(*) FROM <tabla> WHERE tenant_id IS NULL`, Then el resultado es `0`.
- Given la tabla `tenants` y cualquier tabla de negocio, When se hace `JOIN` por `tenant_id`, Then no hay registros huérfanos (todo `tenant_id` referenciado existe en `tenants`).

**RF-05**
- Given una migración nueva que crea una tabla de negocio, When se revisa el PR, Then la definición de la tabla incluye `tenant_id` desde el `CREATE TABLE` inicial (no agregada después).

## Orden de implementación sugerido

1. Crear tabla `tenants` + insertar el registro inicial (RF-01, RF-02).
2. Por cada tabla existente: `ALTER TABLE ... ADD COLUMN tenant_id ...`, luego `UPDATE ... SET tenant_id = <id del tenant>` (RF-03, RF-04).
3. Recién después de verificar los criterios de aceptación de arriba, agregar la restricción `NOT NULL` y la FK (si se hizo en el orden inverso, la migración falla con datos ya cargados).

## Decisión de tipo (resuelta)
`tenants.id` es **INT UNSIGNED AUTO_INCREMENT**, igual que el resto de las PK del
esquema (`docs/crm_schema.sql`). Con un solo tenant real y sin necesidad de generar
IDs fuera de la base, UUID no aporta nada y complica los JOIN. `tenant_id` en cada
tabla de negocio es también INT UNSIGNED.

## Pendiente para completar esta spec
- Resolver el ajuste de PK compuesta en `configuracion` (ver RF-03) antes de escribir la migración.
- Script de migración SQL concreto (`ALTER TABLE` + `UPDATE` por tabla, en el orden de la sección anterior).
