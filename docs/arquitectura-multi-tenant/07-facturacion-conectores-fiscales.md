# Módulo 07 — Facturación: conectores fiscales

## Responsabilidad
Traducir una venta confirmada en un comprobante válido según el país del tenant, sin que el core del sistema conozca los detalles de cada normativa fiscal.

## Alcance
- Incluye: interfaz genérica de conector fiscal, implementaciones concretas por país/proveedor.
- No incluye: la lógica de venta en sí (módulo 04) ni el cálculo de impuestos (módulo 08, que sí es parte del core).

## Decisiones ya tomadas — decisión de fondo del proyecto
- **El sistema no integra ARCA/AFIP directamente.** Es una exclusión explícita del alcance.
- En su lugar, se define una **interfaz genérica de conector fiscal** ("FiscalConnector") que cada país resuelve mediante un proveedor externo ya homologado:
  - Argentina: proveedor con API (ej. TusFacturasAPP) en lugar de integración directa contra los webservices de ARCA.
  - España: proveedor certificado bajo el Reglamento VeriFactu (Ley Antifraude), dado que España exige que el software de registro de ventas cumpla requisitos técnicos específicos (trazabilidad, hash, no manipulación) con plazos de entrada en vigencia 2026-2027.
- Motivo de esta arquitectura: si el propio sistema terminara siendo "el registro de ventas" de un cliente español, el proveedor del software (el usuario) podría caer bajo esa normativa directamente. Delegar a un conector certificado evita ese riesgo.

## Modelo de datos (borrador)
- `conectores_fiscales`: id, tenant_id, país, proveedor, credenciales (cifradas), estado.
- `comprobantes`: id, venta_id, conector_id, estado (pendiente/emitido/error), identificador externo (ej. CAE, o el equivalente español), fecha de emisión.

## Dependencias con otros módulos
- Módulo 04 (ventas): dispara la solicitud de comprobante al conector activo del tenant.
- Módulo 01 (multi-tenant): el conector fiscal es configuración por tenant, no global.
- Módulo 08 (impuestos): el cálculo de impuesto es del core; el conector solo empaqueta y envía el comprobante ya calculado.

## Pendiente de definir
- Diseño concreto de la interfaz `FiscalConnector` (métodos mínimos: emitir, consultar estado, anular/nota de crédito).
- Qué proveedor se integra primero (probablemente el de Argentina, por ser el mercado de arranque).
- Manejo de reintentos y cola de comprobantes pendientes cuando el conector falla (ligado al modo offline del módulo 04).
