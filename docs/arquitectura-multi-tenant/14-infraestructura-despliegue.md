# Módulo 14 — Infraestructura y despliegue

## Responsabilidad
Definir dónde y cómo corre el sistema, y cómo escala a medida que suman tenants.

## Alcance
- Incluye: hosting, base de datos, estrategia de escalado.
- No incluye: arquitectura de aislamiento de datos en sí (eso es el módulo 01; este módulo es la infraestructura física/cloud que la soporta).

## Decisiones ya tomadas
- Hosting inicial: **Hostinger Business Web Hosting** (el mismo usado para el proyecto de CRM personal del usuario), suficiente para validar con pocos tenants.
- Reconocido explícitamente que este hosting **no es la decisión final** para un SaaS multi-tenant en crecimiento: se prevé migrar a VPS o infraestructura cloud con autoscaling y pooling de conexiones a MySQL cuando el volumen lo justifique.
- Recomendación aplicada: no tomar decisiones tempranas que compliquen esa migración futura (ej. evitar dependencias específicas del hosting actual que no existan en un VPS/cloud estándar).

## Modelo de datos (borrador)
No aplica (módulo de infraestructura, no de datos de negocio).

## Dependencias con otros módulos
- Módulo 01 (multi-tenant): el pooling de conexiones y el escalado están directamente ligados a cuántos tenants comparten la misma base MySQL.

## Pendiente de definir
- Umbral de tenants/volumen que dispara la migración a VPS/cloud.
- Estrategia de backups automáticos de la base MySQL (no negociable dado que hay datos fiscales/comerciales de terceros involucrados).
- Estrategia de despliegue continuo (CI/CD) a medida que el proyecto crezca más allá de un deploy manual vía GitHub.
