# Módulo 02 — Productos y catálogo

## Responsabilidad
Gestionar el catálogo de productos de cada tenant: alta, edición, precios, categoria, unidades de medida y códigos de identificación.

## Alcance
- Incluye: productos, categorías, precios, unidad de medida (unidad vs. peso/volumen).
- No incluye: cantidades en stock ni movimientos (eso es el módulo 03).

## Decisiones ya tomadas
- El sistema debe soportar **venta a granel** (precio por unidad de medida, ej. por kg), no solo productos por unidad entera — requisito surgido del caso de uso original (frutos secos), pero se mantiene como capacidad genérica del core porque cualquier tenant de alimentos/insumos puede necesitarlo.

## Modelo de datos (borrador)
- `productos`: id, tenant_id, nombre, categoría, unidad_de_medida (unidad / kg / litro / etc.), precio_base, tasa_impuesto_aplicable (referencia a módulo 08), código de barras (opcional).
- `categorias`: id, tenant_id, nombre.

## Dependencias con otros módulos
- Módulo 03 (stock): cada producto tiene su historial de movimientos.
- Módulo 08 (impuestos): cada producto referencia una categoría fiscal/tasa.
- Módulo 04 (ventas): el TPV busca productos por nombre/código de barras.
- Módulo 06 (proveedores): un producto puede tener múltiples precios de proveedor (comparador de precios).

## Pendiente de definir
- Soporte de variantes (talla/color/presentación) para tenants de otros rubros (no solo alimentos).
- Estándar de código de barras a soportar (EAN-13, UPC, códigos internos).
- Manejo de productos compuestos/combos (si aplica).
