# Módulo 04 — Ventas / TPV (punto de venta)

## Responsabilidad
Gestionar la operación de mostrador: registrar ventas, cobrar, controlar caja y emitir el comprobante correspondiente (fiscal o no).

## Alcance
- Incluye: apertura/cierre de caja, registro de venta, medios de pago, modo offline.
- No incluye: la emisión fiscal en sí (eso es el conector del módulo 07); acá solo se dispara la solicitud al conector.

## Decisiones ya tomadas
- Apertura y cierre de caja con control de efectivo (monto declarado al abrir vs. lo que debería haber al cerrar según ventas registradas).
- Debe soportar **múltiples medios de pago** en una misma venta, y cada uno debe reflejarse correctamente en el reporte de cierre de caja.
- **Modo offline/contingencia obligatorio**: si se cae la conexión o el conector fiscal no responde, la venta debe poder guardarse localmente y completarse (pedir el comprobante fiscal) apenas se restablece la conexión. El mostrador no puede detenerse por una falla externa.

## Modelo de datos (borrador)
- `ventas`: id, tenant_id, fecha, usuario_id, estado (pendiente_fiscal / completada / anulada), total, medios_de_pago (detalle por línea).
- `venta_items`: id, venta_id, producto_id, cantidad, precio_unitario, impuesto_aplicado.
- `caja_sesiones`: id, tenant_id, usuario_id, fecha_apertura, monto_apertura, fecha_cierre, monto_cierre_declarado, monto_cierre_calculado.

## Dependencias con otros módulos
- Módulo 03 (stock): cada venta confirmada genera movimientos de descuento de stock.
- Módulo 07 (facturación): cada venta dispara (o encola, si está offline) la solicitud de comprobante fiscal al conector correspondiente.
- Módulo 09 (medios de pago): integración con conectores de pago electrónico.
- Módulo 10 (usuarios/permisos): quién puede anular una venta o abrir/cerrar caja.

## Pendiente de definir
- Formato de comprobante por defecto cuando no hay conector fiscal activo (ticket no fiscal / PDF por email).
- Soporte de hardware de mostrador: lector de código de barras, balanza, impresora de tickets, cajón de dinero (drivers, integración por USB/serial).
- Política de anulación/devolución de ventas ya cerradas.
