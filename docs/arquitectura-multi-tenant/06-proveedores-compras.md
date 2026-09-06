# Módulo 06 — Proveedores y compras

## Responsabilidad
Gestionar proveedores, sus precios por producto y el ingreso de mercadería (compras) que impacta el stock.

## Alcance
- Incluye: ficha de proveedor, precios por proveedor, historial de precios, recepción de mercadería.
- No incluye: pagos a proveedores como módulo contable completo (a definir si entra en alcance).

## Decisiones ya tomadas
- El sistema debe soportar **comparador de precios por proveedor** y **historial de precios** — funcionalidad heredada del proyecto original del usuario (CRM para su propia tienda) y que se mantiene como valor diferencial frente a los TPV comerciales genéricos, que normalmente no la cubren bien.

## Modelo de datos (borrador)
- `proveedores`: id, tenant_id, nombre, contacto.
- `precios_proveedor`: id, proveedor_id, producto_id, precio, fecha (para armar el historial).
- `compras`: id, tenant_id, proveedor_id, fecha, estado.
- `compra_items`: id, compra_id, producto_id, cantidad, precio_pactado.

## Dependencias con otros módulos
- Módulo 03 (stock): cada compra recibida genera movimientos de tipo "compra".
- Módulo 02 (productos): un producto puede tener precios de múltiples proveedores.

## Pendiente de definir
- Flujo completo de orden de compra (solicitud → confirmación → recepción parcial/total).
- Si se incluye gestión de pagos/cuenta corriente con proveedores o queda fuera de alcance del MVP.
