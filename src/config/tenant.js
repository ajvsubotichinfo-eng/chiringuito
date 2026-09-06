// ============================================================
// Tenant actual (Fase 1 del módulo multi-tenant).
//
// Todavía no hay un middleware que resuelva el tenant de cada pedido:
// hay un solo comercio real (Frutos Secos Carmen T), así que alcanza
// con esta constante. Cuando exista un segundo tenant real (Fase 2,
// ver docs/arquitectura-multi-tenant/01-arquitectura-multi-tenant.md),
// esto se reemplaza por el tenant_id del usuario logueado.
// ============================================================

const TENANT_ID_ACTUAL = 1;

module.exports = { TENANT_ID_ACTUAL };
