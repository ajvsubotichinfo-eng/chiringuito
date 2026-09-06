# Módulo 03 — Stock e inventario

## Responsabilidad
Mantener la cantidad disponible de cada producto de forma confiable, trazable y consistente ante ventas concurrentes.

## Alcance
- Incluye: movimientos de stock, ajustes, lotes/vencimientos, multi-depósito.
- No incluye: definición del producto en sí (módulo 02) ni compras a proveedores (módulo 06, aunque genera movimientos acá).

## Decisiones ya tomadas
- **No guardar solo un campo "cantidad" en el producto.** Cada cambio de stock se registra como un **movimiento** (venta, compra, ajuste manual, devolución) con fecha, usuario responsable y motivo. El stock actual se calcula (o se cachea) a partir de esos movimientos, permitiendo trazabilidad y auditoría completa.
- **Concurrencia**: las ventas deben descontar stock usando transacciones atómicas en MySQL, para evitar inconsistencias cuando dos operaciones tocan el mismo producto al mismo tiempo.
- Soporte de **lotes** para productos con vencimiento (no todos los tenants lo necesitarán, pero el modelo de datos debe contemplarlo desde el inicio para no rehacerlo después).

## Modelo de datos (borrador)
- `movimientos_stock`: id, tenant_id, producto_id, tipo (venta/compra/ajuste/devolución), cantidad, fecha, usuario_id, motivo, referencia (ej. id de venta o compra asociada).
- `lotes` (opcional por producto): id, producto_id, cantidad, fecha_vencimiento.
- Vista o campo calculado `stock_actual` por producto (y por depósito, si aplica multi-depósito).

## Dependencias con otros módulos
- Módulo 04 (ventas): genera movimientos de tipo "venta" al confirmar cada operación.
- Módulo 06 (proveedores/compras): genera movimientos de tipo "compra" al recibir mercadería.
- Módulo 11 (reportes): consume este módulo para alertas de stock bajo y productos por vencer.

## Pendiente de definir
- Método de costeo a aplicar cuando varía el precio de compra: FIFO, promedio ponderado, o costo por proveedor específico.
- Soporte multi-depósito (¿cada tenant puede tener más de un depósito/sucursal con stock independiente?).
- Umbral de "stock bajo" — ¿configurable por producto o global por tenant?
