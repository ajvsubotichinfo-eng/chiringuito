# 🥜 Frutos Secos Carmen T — CRM

Aplicación web a medida para gestionar la tienda: productos, proveedores, comparador de precios entre proveedores, historial de cambios de precio y registro/reporte de pagos.

**Stack:** React (frontend) · Node.js/Express (backend) · MySQL (base de datos)
**Hosting:** Hostinger Business Web Hosting (Web App Node.js con deploy desde GitHub)
**Estado actual:** 🚧 Fases 1, 2 y 3 completas (base de datos, deploy, backend) — Fase 4 (frontend) en curso

---

## 📂 ¿Qué hay en cada carpeta?

```
frutos-secos-carmen-t/
├── README.md              ← Este archivo: el mapa general
├── package.json           ← Dependencias y comandos del proyecto
├── .env.example           ← Plantilla de configuración (copiar como .env)
├── .gitignore             ← Qué NO se sube a GitHub (credenciales, etc.)
│
├── docs/                  ← 📚 TODA LA DOCUMENTACIÓN
│   ├── PLAN_Y_MANUAL.md           ← Plan maestro: fases, decisiones, bitácora
│   ├── GUIA_INSTALACION_LOCAL.md  ← Cómo correr el proyecto en tu PC
│   ├── GUIA_DEPLOY_HOSTINGER.md   ← Cómo subirlo a GitHub y Hostinger
│   └── crm_schema.sql             ← Script que crea las tablas en MySQL
│
├── src/                   ← 💻 CÓDIGO DEL BACKEND (Node/Express)
│   ├── server.js          ← Punto de entrada: levanta el servidor
│   ├── config/
│   │   └── db.js          ← Conexión a MySQL
│   ├── middleware/
│   │   └── autenticacion.js ← Verifica el login (JWT) en cada pedido
│   └── rutas/             ← Endpoints de la API: auth, productos, proveedores, precios, pagos, reportes
│
├── frontend/              ← 📱 CÓDIGO DEL FRONTEND (React + Vite)
│   └── src/               ← Pantallas, componentes, contexto de sesión
│                            (se compila con "npm run build:frontend" y el
│                             resultado va DIRECTO a /public, ver abajo)
│
├── uploads/comprobantes/  ← 🧾 Fotos de comprobantes de pago (subidas por
│                            los usuarios). Aparte de /public a propósito:
│                            el build de React no debe borrarlas nunca.
│
└── public/                ← 🌐 LO QUE SIRVE EXPRESS AL NAVEGADOR
    └── (generado)         ← App de React ya compilada — NO editar a mano,
                              se pisa solo con cada "npm run build:frontend"
```

## ▶️ Comandos rápidos

| Comando | Qué hace |
|---|---|
| `npm install` | Instala las dependencias del backend (solo la primera vez o si cambia package.json) |
| `npm start` | Arranca el servidor → http://localhost:3000 |
| `npm run dev` | Igual, pero se reinicia solo al editar código (para desarrollo) |
| `npm run build:frontend` | Compila la app de React y actualiza `/public` — **hacerlo siempre antes de subir un cambio de frontend** |

Para programar el frontend con recarga automática: `cd frontend && npm install` (primera vez) y `npm run dev` (abre en otro puerto, ej. 5173, y ya manda las llamadas a `/api` al backend).

## 🔧 ¿Necesitás hacer un arreglo a mano?

1. Todo el código está **comentado en español** explicando qué hace cada parte.
2. Empezá siempre por `src/server.js` — es la puerta de entrada, y desde ahí se ve qué archivo maneja cada cosa.
3. Después de editar, probá localmente con `npm start` antes de subir a GitHub.
4. La guía completa de cómo subir cambios está en `docs/GUIA_DEPLOY_HOSTINGER.md`.
5. Ante cualquier error, copiá el mensaje tal cual y pedile ayuda a Claude retomando el proyecto con este README y `docs/PLAN_Y_MANUAL.md` a mano.

## 📖 Documentación completa

- **Plan del proyecto, decisiones y qué falta:** [`docs/PLAN_Y_MANUAL.md`](docs/PLAN_Y_MANUAL.md)
- **Primera vez en tu PC:** [`docs/GUIA_INSTALACION_LOCAL.md`](docs/GUIA_INSTALACION_LOCAL.md)
- **Subir a producción:** [`docs/GUIA_DEPLOY_HOSTINGER.md`](docs/GUIA_DEPLOY_HOSTINGER.md)
